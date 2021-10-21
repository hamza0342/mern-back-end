const express = require("express")
const router = express.Router()
const mime = require('mime');
const path = require('path');
const fs = require('fs')


router.get('/readFile/uploads/:filename', function (req, res) {
    console.log("inside Download")
    console.log(req.params.filename)
    const file = `./uploads/${req.params.filename}`;
    const filename = path.basename(file);
    const mimetype = mime.lookup(file);
    res.setHeader("Access-Control-Allow-Origin", "*", 'Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);
    const filestream = fs.createReadStream(file);
    filestream.pipe(res);
    });


    module.exports = router