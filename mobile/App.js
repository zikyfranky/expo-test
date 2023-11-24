import axios from "axios";
import { useState } from "react";
import { Button, Image, StyleSheet, View } from "react-native";
import useGallery from "./useImage";

export default function App() {
  const { openGallery, openCamera, error, getUploadable, setError } =
    useGallery();
  const [image, setImage] = useState();

  const handleSubmit = () => {
    let formdata = new FormData();
    formdata.append("username", "");
    formdata.append("address", "");

    formdata.append(`dp`, {
      uri: image.uri,
      name: (image.fileName || "imaginate")?.toLowerCase(),
      type: image.mime,
    });

    axios
      .patch("http://localhost:9007/test", formdata, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => alert(response.data))
      .catch((error) => console.log(error.toString()));
  };

  const handleGallery = () => {
    openGallery(
      (result) => {
        if (result.length > 0) {
          setImage(result[0]);
        }
      },
      { allowsMultipleSelection: false, allowsEditing: false }
    );
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Pick an image from camera roll" onPress={handleGallery} />
      {image && (
        <Image
          source={{ uri: image.uri }}
          style={{ width: "100%", height: 400 }}
        />
      )}
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
