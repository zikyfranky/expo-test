const compression = require("compression");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const dpUpload = require("./dpUpload");

dotenv.config();
const app = express();
const port = process.env.PORT || 9007;

app.enable("trust proxy");
// Implement CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.patch("/test", dpUpload.single("dp"), async (req, res, next) => {
  const { body, file } = req;
  console.log("BODY", body);
  console.log("FILE", file);

  const imageInBody = body.dp;
  console.log("Is image in body?: ", !!imageInBody);
  if (imageInBody) {
    console.log("Content of image in body: ", imageInBody);
  }

  res.status(201).json("Yay");
});

app.listen(port, function () {
  console.log(`Server started on :${port}...`);
});
