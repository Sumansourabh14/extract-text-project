const express = require("express");
const textract = require("textract");
const bodyParser = require("body-parser");
// const formidableMiddleware = require("express-formidable");
const formidable = require("formidable");
// const path = require("path");
const xmlrpc = require("davexmlrpc");
const fs = require("fs");
const contents = fs.readFileSync(
  "D:/textract-nodejs/uploads/3069.1.5-14 questions.docx"
);

const app = express();
const port = 3010;

// const urlEndpoint = "https://api.ithenticate.com/rpc";
// const verb = "login";
// const params = [
//   { username: "saurav.dam@ansrsource.com", password: "J42pPQna%" },
// ]; //an array containing one element, the number 5
// const format = "xml"; //could also be "json"

// xmlrpc.client(urlEndpoint, verb, params, format, function (err, data) {
//   if (err) {
//     console.log("err.message == " + err.message);
//   } else {
//     console.log(data);
//   }
// });
console.log(typeof contents);

// const urlEndpoint = "https://api.ithenticate.com/rpc";
// const verb = "document.add";
// const params = [
//   {
//     sid: "4fa2698d88bfa85ee6751f3c2382d37db297fc5e",
//     folder: 3153531,
//     submit_to: 3,
//     uploads: [
//       {
//         title: "New-Document",
//         author_first: "Suman",
//         author_last: "Sourabh",
//         filename: "Word-Doc",
//         upload: contents,
//       },
//     ],
//   },
// ]; //an array containing one element, the number 5
// const format = "xml"; //could also be "json"

const urlEndpoint = "https://api.ithenticate.com/rpc";
const verb = "report.get_document";
const params = [
  {
    id: 96144460,
    sid: "4fa2698d88bfa85ee6751f3c2382d37db297fc5e",
    exclude_biblio: true,
    exclude_quotes: true,
    exclude_small_matches: true,
  },
]; //an array containing one element, the number 5
const format = "xml"; //could also be "json"

xmlrpc.client(urlEndpoint, verb, params, format, function (err, data) {
  if (err) {
    console.log("err.message == " + err.message);
  } else {
    console.log(data);
  }
});

// const formidableOptions = {
//   uploadDir: "uploads/",
//   multiples: false,
//   keepExtensions: true,
// };
const formidableOptions = {
  keepExtensions: true,
};

// const form1 = formidable(formidableOptions);

// app.use(formidableMiddleware());

// app.post("/upload", (req, res) => {
//   formidableMiddleware(formidableOptions);

//   const doc = req.fields.files.doc;

//   console.log(req.fields);

//   const updateOptions = {};
//   if (doc) {
//     const uploadResult = upload(doc);
//     updateOptions.photo = uploadResult.Location;
//     unlinkFile(doc.path);
//   }

//   res.send("ok");
// });

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

// app.post("/", function (req, res) {
//   console.log(req.body);

//   textract.fromFileWithPath(req.body.doc, config, function (error, text) {
//     if (error) {
//       console.log(error);
//       res.status(400).send("Error");
//     } else {
//       console.log("The text from the doc is: " + text);
//       res.send(text);
//     }
//   });
// });

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
