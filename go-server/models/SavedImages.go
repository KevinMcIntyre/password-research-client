package models
import (
  "database/sql"
  "fmt"
)

type UserPassImageRequest struct {
  UserId    int
}

type SaveImageRequest struct {
  UserId    int
  ImageAlias  string
}

type PassImage struct {
  ImageType   string
  Alias       string
}

func GetPassImages(db *sql.DB, subjectId int) (*[]*PassImage){
  var passImages []*PassImage
  rows, err := db.Query("SELECT image_type, alias FROM saved_images WHERE subject_id = $1 ORDER BY creation_date ASC", subjectId)
  if err != nil {
    fmt.Println(err)
    // handle error
  }
  for rows.Next() {
    passImage := new(PassImage)
    if err := rows.Scan(&passImage.ImageType, &passImage.Alias); err != nil {
      fmt.Println(err)
      // handle error
    }

    passImages = append(passImages, passImage)
  }

  if err := rows.Err(); err != nil {
    fmt.Println(err)
    // handle error
  }
  rows.Close()

  return &passImages
}

func SaveImage(db *sql.DB, subjectId int, imageAlias string) string {
  var alias string
  err := db.QueryRow("INSERT INTO saved_images (subject_id, image, image_type, alias, creation_date) SELECT subject_id, image, image_type, replace(md5(random()::text || clock_timestamp()::text), '-'::text, ''::text)::varchar(60), creation_date FROM uploaded_images WHERE subject_id = $1 AND alias = $2 returning alias;", subjectId, imageAlias).Scan(&alias)
  if err != nil {
    fmt.Println(err)
    // handle error
  }
  return alias
}
