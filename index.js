const express = require("express");
const textract = require("textract");
const bodyParser = require("body-parser");
const formidable = require("formidable");

const fs = require("fs");
const contents = fs.readFileSync(
  "D:/textract-nodejs/uploads/3069.1.5-14 questions.docx"
);

const app = express();
const port = 3010;

const formidableOptions = {
  keepExtensions: true,
};

// configuration options to passed into textract
const config = {
  preserveLineBreaks: true,
};

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  //capture form and store reference inside "form"
  const form = new formidable.IncomingForm();
  form.parse(req);

  form.on("fileBegin", function (name, file) {
    file.filepath = __dirname + "/uploads/" + file.originalFilename;
    console.log(file.filepath);
  });

  //Display uploaded message to console
  form.on("file", function (name, file) {
    console.log("Uploaded file: " + file.originalFilename);

    // read text from document
    textract.fromFileWithPath(file.filepath, config, function (error, text) {
      if (error) {
        console.log(error);
        res.status(400).send("Error");
      } else {
        console.log("The text from the doc is: " + text);
        res.send(text);
      }
    });
  });

  //   res.send("File uploaded!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
