package main

import (
	"./models"
	"./services"
	"./utils"
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/codegangsta/negroni"
	"github.com/julienschmidt/httprouter"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"strconv"
)

var db *sql.DB = setupDatabase()

func uploadImageHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var (
		status int
		err    error
	)

	defer func() {
		if nil != err {
			http.Error(w, err.Error(), status)
		}
	}()

	// parse request
	const _24K = (1 << 20) * 24
	if err = r.ParseMultipartForm(_24K); nil != err {
		status = http.StatusInternalServerError
		return
	}

	uploadResponse := new(models.ImageUploadResponse)

	uploadResponse.SubjectId, err = strconv.Atoi(r.MultipartForm.Value["subjectId"][0])
	uploadResponse.CollectionId, err = strconv.Atoi(r.MultipartForm.Value["collectionId"][0])

	for _, fileHeaders := range r.MultipartForm.File {
		for _, header := range fileHeaders {
			// open uploaded
			var inFile multipart.File
			if inFile, err = header.Open(); nil != err {
				status = http.StatusInternalServerError
				return
			}

			// open destination
			var outFile *os.File
			fileName := "./upload/" + header.Filename
			if outFile, err = os.Create(fileName); nil != err {
				status = http.StatusInternalServerError
				return
			}

			// 32K buffer copy
			if _, err = io.Copy(outFile, inFile); nil != err {
				status = http.StatusInternalServerError
				return
			}

			utils.ResizeImage(fileName)

			imageBytes := utils.ImageFileToByteArray(fileName)

			fileType := http.DetectContentType(imageBytes)

			imageAlias := models.SaveUpload(db, true, uploadResponse.SubjectId, uploadResponse.CollectionId, imageBytes, fileType)
			uploadResponse.Aliases = append(uploadResponse.Aliases, imageAlias)

			os.Remove(fileName)
		}
	}

	jsonResponse, err := json.Marshal(uploadResponse)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Length", strconv.Itoa(len(jsonResponse)))
	w.Write(jsonResponse)
}

func discardUploadImageHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	decoder := json.NewDecoder(r.Body)
	var discardRequest models.ImageDiscardRequest
	err := decoder.Decode(&discardRequest)
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	models.DiscardImage(db, discardRequest.SubjectId, discardRequest.CollectionId, discardRequest.ImageAlias)

	var jsonArray []string

	jsonArray = append(jsonArray, "swag")

	jsonResponse, err := json.Marshal(jsonArray)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Length", strconv.Itoa(len(jsonResponse)))
	w.Write(jsonResponse)
}

func uploadPreviewHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var imageBytes string
	var imageType string
	err := db.QueryRow("SELECT image, image_type FROM uploaded_images WHERE alias=$1", ps.ByName("alias")).Scan(&imageBytes, &imageType)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	buffer := bytes.NewBufferString(imageBytes)
	w.Header().Set("Content-Type", imageType)
	w.Header().Set("Content-Length", strconv.Itoa(len(buffer.Bytes())))
	if _, err := w.Write(buffer.Bytes()); err != nil {
		fmt.Println("unable to write image.")
	}
}

func saveImageHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	decoder := json.NewDecoder(r.Body)

	var saveRequest models.SaveImageRequest
	err := decoder.Decode(&saveRequest)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	alias := models.SaveImage(db, saveRequest.SubjectId, saveRequest.CollectionId, saveRequest.ImageAlias)

	var jsonArray []string

	jsonArray = append(jsonArray, alias)

	jsonResponse, err := json.Marshal(jsonArray)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Length", strconv.Itoa(len(jsonResponse)))
	w.Write(jsonResponse)
}

func getUserImagesHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	decoder := json.NewDecoder(r.Body)

	var passImageRequest models.UserPassImageRequest
	err := decoder.Decode(&passImageRequest)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	passImages := models.GetPassImages(db, passImageRequest.SubjectId, passImageRequest.CollectionId)

	jsonResponse, _ := json.Marshal(passImages)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Length", strconv.Itoa(len(jsonResponse)))
	w.Write(jsonResponse)
}

func getImageHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var imageBytes string
	var imageType string
	err := db.QueryRow("SELECT image, image_type FROM saved_images WHERE alias=$1", ps.ByName("alias")).Scan(&imageBytes, &imageType)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	buffer := bytes.NewBufferString(imageBytes)
	w.Header().Set("Content-Type", imageType)
	w.Header().Set("Content-Length", strconv.Itoa(len(buffer.Bytes())))
	if _, err := w.Write(buffer.Bytes()); err != nil {
		fmt.Println("unable to write image.")
	}
}

func getRandomImageHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var imageBytes string
	var imageType string
	err := db.QueryRow("SELECT image, image_type FROM random_stage_images WHERE alias=$1", ps.ByName("alias")).Scan(&imageBytes, &imageType)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	buffer := bytes.NewBufferString(imageBytes)
	w.Header().Set("Content-Type", imageType)
	w.Header().Set("Content-Length", strconv.Itoa(len(buffer.Bytes())))
	if _, err := w.Write(buffer.Bytes()); err != nil {
		fmt.Println("unable to write image.")
	}
}

func newSubjectHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	decoder := json.NewDecoder(r.Body)

	var newSubjectRequest models.NewSubjectRequest
	err := decoder.Decode(&newSubjectRequest)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	validationResults, birthday := newSubjectRequest.Validate()

	var jsonResponse []byte
	var jsonMap map[string]interface{}

	if len(validationResults) == 0 {
		newSubjectId := models.SaveNewSubject(db, newSubjectRequest, birthday)
		jsonMap = map[string]interface{}{"id": newSubjectId}
	} else {
		jsonMap = map[string]interface{}{"errors": validationResults}
	}

	jsonResponse, _ = json.Marshal(jsonMap)

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Length", strconv.Itoa(len(jsonResponse)))
	w.Write(jsonResponse)
}

func testHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// TODO
}

func errorHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// TODO
}

func getSubjectListHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	subjectList := models.GetSubjectList(db)

	jsonResponse, err := json.Marshal(subjectList)
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Length", strconv.Itoa(len(jsonResponse)))
	w.Write(jsonResponse)
}

func getCollectionListHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	collectionList := models.GetCollectionList(db)

	jsonResponse, err := json.Marshal(collectionList)
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Length", strconv.Itoa(len(jsonResponse)))
	w.Write(jsonResponse)
}

func getSubjectHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	subjectId, err := strconv.Atoi(ps.ByName("id"))

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	subjectProfile := models.GetSubjectProfileById(db, subjectId)

	jsonResponse, err := json.Marshal(subjectProfile)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Length", strconv.Itoa(len(jsonResponse)))
	w.Write(jsonResponse)
}

func newCollectionHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	decoder := json.NewDecoder(r.Body)

	var newCollectionRequest models.NewCollectionRequest
	err := decoder.Decode(&newCollectionRequest)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	validationResults := newCollectionRequest.Validate()

	var jsonResponse []byte
	var jsonMap map[string]interface{}

	if len(validationResults) == 0 {
		newCollectionId := newCollectionRequest.Save(db)
		jsonMap = map[string]interface{}{"id": newCollectionId}
	} else {
		jsonMap = map[string]interface{}{"errors": validationResults}
	}

	jsonResponse, _ = json.Marshal(jsonMap)

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Length", strconv.Itoa(len(jsonResponse)))
	w.Write(jsonResponse)
}

func saveSubjectPasswordHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	subjectId, err := strconv.Atoi(r.FormValue("subjectId"))
	if err != nil {
		fmt.Println(err)
	}

	password := r.FormValue("password")

	score, err := strconv.Atoi(r.FormValue("strength"))
	if err != nil {
		fmt.Println(err)
	}

	entropy, err := strconv.ParseFloat(r.FormValue("entropy"), 64)
	if err != nil {
		fmt.Println(err)
	}

	//if passes password validation
	models.SaveSubjectPassword(db, subjectId, password, score, entropy)

	jsonResponse, err := json.Marshal("hi")
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Length", strconv.Itoa(len(jsonResponse)))
	w.Write(jsonResponse)
}

func saveSubjectPinHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	subjectId, err := strconv.Atoi(r.FormValue("subjectId"))
	if err != nil {
		fmt.Println(err)
	}

	pinNumber := r.FormValue("pinNumber")

	//if passes pinNumber validation
	models.SaveSubjectPin(db, subjectId, pinNumber)

	jsonResponse, err := json.Marshal("hi")
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Length", strconv.Itoa(len(jsonResponse)))
	w.Write(jsonResponse)
}

func imgurHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	configId, _ := strconv.Atoi(r.FormValue("configId"))
	stages, _ := strconv.Atoi(r.FormValue("stages"))
	rows, _ := strconv.Atoi(r.FormValue("rows"))
	columns, _ := strconv.Atoi(r.FormValue("columns"))
	i := 1
	var stageMap = make(map[string]map[string]map[string]string)
	randomImages := *services.GetRandomImgurImages(rows * columns * stages)

	for i <= stages {
		stageString := strconv.Itoa(i)
		stageMap[stageString] = make(map[string]map[string]string)
		row := 1
		column := 1
		stageMap[stageString][strconv.Itoa(row)] = make(map[string]string)
		for _, image := range randomImages[((i - 1) * (rows * columns)):(i * rows * columns)] {
			alias := image.Save(db, configId, i, row, column)
			stageMap[stageString][strconv.Itoa(row)][strconv.Itoa(column)] = alias
			if column == columns {
				column = 1
				row++
				if row <= rows {
					stageMap[stageString][strconv.Itoa(row)] = make(map[string]string)
				}
			} else {
				column++
			}
		}
		i++
	}

	jsonResponse, err := json.Marshal(stageMap)
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Length", strconv.Itoa(len(jsonResponse)))
	w.Write(jsonResponse)
}

func main() {
	defer db.Close()

	router := httprouter.New()

	router.POST("/subject/new", newSubjectHandler)
	router.GET("/subject/profile/:id", getSubjectHandler)
	router.GET("/subject/list", getSubjectListHandler)
	router.POST("/subject/save/password", saveSubjectPasswordHandler)
	router.POST("/subject/save/pin", saveSubjectPinHandler)

	router.GET("/collections/list", getCollectionListHandler)
	router.POST("/collections/new", newCollectionHandler)

	router.POST("/upload", uploadImageHandler)
	router.POST("/upload/discard", discardUploadImageHandler)
	router.GET("/upload/preview/:alias", uploadPreviewHandler)

	router.POST("/save/image", saveImageHandler)
	router.GET("/image/:alias", getImageHandler)
	router.POST("/images", getUserImagesHandler)

	router.POST("/random/stages", imgurHandler)
	router.GET("/random/image/:alias", getRandomImageHandler)

	n := negroni.New(
		negroni.NewRecovery(),
		negroni.NewLogger(),
	)

	n.Use(negroni.NewStatic(http.Dir("./public")))

	// Add CORS support (Cross Origin Resource Sharing)
	handler := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedHeaders: []string{"Origin", "Accept", "Content-Type", "Authorization", "Access-Control-Allow-Origin"},
	}).Handler(router)

	n.UseHandler(handler)

	n.Run(":7000")
}

func setupDatabase() *sql.DB {
	db_url := os.Getenv("DATABASE_URL")
	if db_url == "" {
		db_url = "user=postgres password=password dbname=tupwresearch  sslmode=disable"
	}

	db, err := sql.Open("postgres", db_url)

	if err != nil {
		fmt.Println(err)
		panic(err)
	}

	return db
}
