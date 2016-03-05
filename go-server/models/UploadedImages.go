package models
import (
  "fmt"
  "database/sql"
  "time"
)

type ImageUploadRequest struct {
  UserId    int
  ImageUri  string
}

type ImageDiscardRequest struct {
  UserId    int
  ImageAlias  string
}

func DiscardImage(db *sql.DB, subjectId int, imageAlias string) {
  _, err := db.Exec("DELETE FROM uploaded_images WHERE subject_id = $1 AND alias = $2", subjectId, imageAlias)
  if err != nil {
    fmt.Println(err)
    // handle error
  }
}

func SaveUpload(db *sql.DB, uploaded bool, subjectId int, imageBytes []byte, imageType string) string {
  var alias string
  err := db.QueryRow("INSERT INTO uploaded_images (subject_id, image, image_type, alias, creation_date) VALUES($1, $2, $3, replace(md5(random()::text || clock_timestamp()::text), '-'::text, ''::text)::varchar(60), $4) returning alias;", subjectId, imageBytes, imageType, time.Now()).Scan(&alias)
  if err != nil {
    fmt.Println(err)
    // handle error
  }
  return alias
}
