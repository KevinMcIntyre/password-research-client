package models
import (
  "database/sql"
  "fmt"
  "strconv"
)

type RandomImage struct {
  Alias  string
  Stage  int
  Row    int
  Column int
}

func getRandomImagesByConfigId(db *sql.DB, configId int) *[]*RandomImage {
  var randomImages []*RandomImage

  rows, err := db.Query("SELECT alias, stage_number, row_number, column_number FROM random_stage_images WHERE test_config_id = $1;", configId)
  if err != nil {
    fmt.Println(err)
    // handle error
  }
  for rows.Next() {
    randomImage := new(RandomImage)
    if err := rows.Scan(&randomImage.Alias, &randomImage.Stage, &randomImage.Row, &randomImage.Column); err != nil {
      fmt.Println(err)
      // handle error
    }
    randomImages = append(randomImages, randomImage)
  }

  if err := rows.Err(); err != nil {
    fmt.Println(err)
    // handle error
  }
  rows.Close()

  return &randomImages
}

func GetMatrixMap(db *sql.DB, configId int) *map[string]map[string]map[string]string {
  var matrixMap = make(map[string]map[string]map[string]string)

  randomImagePointers := *getRandomImagesByConfigId(db, configId)
  for _, imagePointer := range randomImagePointers {
    image := *imagePointer
    addToMatrixMap(matrixMap, strconv.Itoa(image.Stage), strconv.Itoa(image.Row), strconv.Itoa(image.Column), image.Alias)
  }

  return &matrixMap;
}

func addToMatrixMap(matrixMap map[string]map[string]map[string]string, stage, row, column, alias string) {
  stageMap, ok := matrixMap[stage]
  if !ok {
    stageMap = make(map[string]map[string]string)
    matrixMap[stage] = stageMap
  }

  rowMap, ok := matrixMap[stage][row]
  if !ok {
    rowMap = make(map[string]string)
    matrixMap[stage][row] = rowMap
  }

  matrixMap[stage][row][column] = alias;
}
