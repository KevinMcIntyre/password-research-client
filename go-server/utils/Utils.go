package utils
import (
  "os"
  "fmt"
  "bufio"
)

func ImageFileToByteArray(fileName string) []byte {
  file, err := os.Open(fileName)

  if err != nil {
    fmt.Println(err)
    // handle error
  }

  defer file.Close()

  fileInfo, _ := file.Stat()
  var size int64 = fileInfo.Size()
  bytes := make([]byte, size)

  buffer := bufio.NewReader(file)
  _, err = buffer.Read(bytes)

  return bytes
}
