const serverless = require("serverless-http");
const express = require("express");
const multiparty = require('multiparty');
var fs = require('fs');
const ipfsClient = require("ipfs-http-client");
const app = express();

const ipfs = ipfsClient.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/hello", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.post('/addImage', (req, res, next) => {
  var form = new multiparty.Form();

  form.parse(req, async function(err, fields, files) {
    const data = fs.readFileSync(files.file[0].path)
    console.log("data", data)

    try {
      const added = await ipfs.add(data)
      console.log("added", added)
      // fs.unlinkSync(files.file[0].path);
      return res.status(200).send({ "ipfs success": added})
    } catch (err) {
      console.error(err)
      // fs.unlinkSync(files.file[0].path);
      return res.status(500).send({ "ipfs error": error})
    }
  })
})

app.post('/addFile', (req, res, next) => {
  var form = new multiparty.Form();

  form.parse(req, async function(err, fields, files) {
    const data = fs.readFileSync(Buffer.from(files.file[0].path))
    console.log("data", data)

    try {
      const added = await ipfs.add(data)
      console.log("added", added)
      // fs.unlinkSync(files.file[0].path);
      return res.status(200).send({ "ipfs success": added})
    } catch (err) {
      console.error(err)
      // fs.unlinkSync(files.file[0].path);
      return res.status(500).send({ "ipfs error": error})
    }    
  })
})

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);