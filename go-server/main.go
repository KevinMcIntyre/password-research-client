package main

import (
	"./models"
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

  uploadResponse.UserId, err = strconv.Atoi(r.MultipartForm.Value["userId"][0])

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

			imageAlias := models.SaveUpload(db, true, uploadResponse.UserId, imageBytes, fileType)
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
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	models.DiscardImage(db, discardRequest.UserId, discardRequest.ImageAlias)

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

	alias := models.SaveImage(db, saveRequest.UserId, saveRequest.ImageAlias)

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

	passImages := models.GetPassImages(db, passImageRequest.UserId)

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

func testHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// TODO
}

func errorHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// TODO
}

func main() {
	defer db.Close()

	router := httprouter.New()

	router.POST("/upload", uploadImageHandler)
	router.POST("/upload/discard", discardUploadImageHandler)
	router.GET("/upload/preview/:alias", uploadPreviewHandler)

	router.POST("/save/image", saveImageHandler)
	router.GET("/image/:alias", getImageHandler)
	router.POST("/images", getUserImagesHandler)

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
