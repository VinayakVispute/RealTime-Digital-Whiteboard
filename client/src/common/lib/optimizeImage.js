import FileResizer from "react-image-file-resizer";

export const optimizeImage = (file, callback) => {
  FileResizer.imageFileResizer(
    file,
    300,
    300,
    "WEBP",
    100,
    0,
    (uri) => {
      callback(uri.toString());
    },
    "base64"
  );
};

//DONE
