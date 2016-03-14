package models
import (
  "fmt"
  "database/sql"
  "time"
  "../utils"
)

type NewSubjectRequest struct {
  FirstName string
  LastName string
  Email string
  Birthday string
}

func (request NewSubjectRequest) Validate() ([]string, time.Time) {
  errorFields := make([]string ,0)
  var birthday time.Time
  var err error
  if (utils.IsEmptyString(request.FirstName)) {
    errorFields = append(errorFields, "firstName")
  }

  if (utils.IsEmptyString(request.LastName)) {
    errorFields = append(errorFields, "lastName")
  }

  if (utils.IsEmptyString(request.Email) || !utils.IsValidEmail(request.Email)) {
    errorFields = append(errorFields, "email")
  }

  if (utils.IsEmptyString(request.Birthday)) {
    errorFields = append(errorFields, "birthday")
  } else {
    layout := "1/2/2006"
    birthday, err = time.Parse(layout, request.Birthday)

    if err != nil {
      errorFields = append(errorFields, "birthday")
    }
  }

  return errorFields, birthday
}

func SaveNewSubject(db *sql.DB, profile NewSubjectRequest, birthday time.Time) (int) {
  var newSubjectId int
  err := db.QueryRow("INSERT INTO subjects(email, first_name, last_name, birth_date, creation_date) VALUES($1, $2, $3, $4, $5) returning id", profile.Email, profile.FirstName, profile.LastName, birthday, time.Now()).Scan(&newSubjectId)
  if err != nil {
    fmt.Println(err)
    // handle error
  }
  return newSubjectId
}
