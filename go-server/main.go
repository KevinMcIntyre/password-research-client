package main

import (
	"./models"
	"./utils"
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/codegangsta/negroni"
	"github.com/disintegration/imaging"
	"github.com/julienschmidt/httprouter"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
	"github.com/vincent-petithory/dataurl"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
	"strings"
)

var db *sql.DB = setupDatabase()

func uploadImageHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	decoder := json.NewDecoder(r.Body)

	var imageUpload models.ImageUploadRequest

	err := decoder.Decode(&imageUpload)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	dataURL, err := dataurl.Decode(strings.NewReader(imageUpload.ImageUri))

	defer r.Body.Close()
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var fileName string
	if dataURL.ContentType() == "image/png" || dataURL.ContentType() == "image/jpg" || dataURL.ContentType() == "image/jpeg" {
		fileName = "uploaded-img-" + strconv.Itoa(imageUpload.UserId) + "." + strings.Split(dataURL.ContentType(), "/")[1]
	} else {
		fmt.Println()
		// handle error
	}

	ioutil.WriteFile(fileName, dataURL.Data, 0644)

	img, err := imaging.Open(fileName)
	croppedImg := imaging.CropCenter(imaging.Fit(img, 200, 200, imaging.Linear), 120, 120)
	err = imaging.Save(croppedImg, fileName)
	if err != nil {
		// handle error
	}

	imageAlias := models.SaveUpload(db, true, imageUpload.UserId, utils.ImageFileToByteArray(fileName), dataURL.ContentType())

	var jsonArray []string

	jsonArray = append(jsonArray, imageAlias)

	jsonResponse, err := json.Marshal(jsonArray)

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

  models.DiscardImage(db, discardRequest.UserId, discardRequest.ImageAlias);

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

  alias := models.SaveImage(db, saveRequest.UserId, saveRequest.ImageAlias);

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

  passImages := models.GetPassImages(db, passImageRequest.UserId);

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
