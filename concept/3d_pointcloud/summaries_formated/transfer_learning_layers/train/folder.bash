for FILE in events.*
do
  # remove the last dot and subsequent chars, then add new ext
  DIR="${FILE:42}"
  mkdir "$DIR"
  mv "$FILE" "$DIR"
done
