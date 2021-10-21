const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require("body-parser")
const expressValidator = require("express-validator")
const mongoose = require('mongoose')
const fs = require('fs')
const cors = require('cors')
const dotenv = require('dotenv')
const mime = require('mime');
const Axios = require("axios")
const open = require("open")

dotenv.config()

const projectRouter = require('./routes/project');
const folderRouter = require('./routes/folder');
const rvtRouter = require('./routes/rvt');
const tourRouter = require('./routes/360tourFolder');
const modelRouter = require('./routes/modelFile')
const tourFileRouter = require('./routes/360tourFile');
const mirFolder = require('./routes/MirFolder');
const mirFile = require('./routes/MirFiles');
const mirSubFile = require('./routes/MirSubFile')
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const fileRouter = require('./routes/fileuploader');
const subContractorRouter = require('./routes/subContractor');
const clientRouter = require("./routes/client");
const memberRouter = require("./routes/teamMembers");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const tourlink = require("./routes/tourlink");
const comments = require("./routes/comments");
const downloadFile = require('./helpers/downloadFile');
const openPdf = require('./helpers/openPdf');
const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views/'));
app.set('view engine', 'jade');


app.get('/', (req, res) => {
  fs.readFile('docs/apiDocs.json', (err, data) => {
    if (err) {
      res.status(400).json({
        error: err
      })
    }
    const docs = JSON.parse(data)
    res.json(docs)
  })
})

///////////////////////
var FORGE_CLIENT_ID = process.env.FORGE_CLIENT_ID;
var FORGE_CLIENT_SECRET = process.env.FORGE_CLIENT_SECRET;
var access_token = '';
var scopes = 'data:read data:write data:create bucket:create bucket:read';
const querystring = require('querystring');

// // Route /api/forge/oauth
app.get('/api/forge/oauth', function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  Axios({
    method: 'POST',
    url: 'https://developer.api.autodesk.com/authentication/v1/authenticate',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data: querystring.stringify({
      client_id: FORGE_CLIENT_ID,
      client_secret: FORGE_CLIENT_SECRET,
      grant_type: 'client_credentials',
      scope: scopes
    })
  })
    .then(function (response) {
      // Success
      access_token = response.data.access_token;
      console.log(access_token);
      res.redirect('/api/forge/datamanagement/bucket/create');

    }).catch(function (error) {
      // Failed
      console.log(error);
      res.send('Failed to authenticate');
    });
});



app.get('/api/forge/oauth/public', function (req, res) {
  // Limit public token to Viewer read only
  Axios({
    method: 'POST',
    url: 'https://developer.api.autodesk.com/authentication/v1/authenticate',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data: querystring.stringify({
      client_id: FORGE_CLIENT_ID,
      client_secret: FORGE_CLIENT_SECRET,
      grant_type: 'client_credentials',
      scope: 'viewables:read'
    })
  })
    .then(function (response) {
      // Success
      console.log(response);
      res.json({ access_token: response.data.access_token, expires_in: response.data.expires_in });
    })
    .catch(function (error) {
      // Failed
      console.log(error);
      res.status(500).json(error);
    });
});
// Buckey key and Policy Key for OSS
const bucketKey = FORGE_CLIENT_ID.toLowerCase() + '_tutorial_bucket'; // Prefix with your ID so the bucket key is unique across all buckets on all other accounts
const policyKey = 'transient'; // Expires in 24hr

// Route /api/forge/datamanagement/bucket/create
app.get('/api/forge/datamanagement/bucket/create', function (req, res) {
  // Create an application shared bucket using access token from previous route
  // We will use this bucket for storing all files in this tutorial
  res.setHeader("Access-Control-Allow-Origin", "*")
  Axios({
    method: 'POST',
    url: 'https://developer.api.autodesk.com/oss/v2/buckets',
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer ' + access_token
    },
    data: JSON.stringify({
      'bucketKey': bucketKey,
      'policyKey': policyKey
    })
  })
    .then(function (response) {
      // Success
      console.log(response);
      res.redirect('/api/forge/datamanagement/bucket/detail');
    })
    .catch(function (error) {
      if (error.response && error.response.status == 409) {
        console.log('Bucket already exists, skip creation.');
        res.redirect('/api/forge/datamanagement/bucket/detail');
      }
      // Failed
      console.log(error);
      res.send('Failed to create a new bucket');
    });
});

// Route /api/forge/datamanagement/bucket/detail
app.get('/api/forge/datamanagement/bucket/detail', function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  Axios({
    method: 'GET',
    url: 'https://developer.api.autodesk.com/oss/v2/buckets/' + encodeURIComponent(bucketKey) + '/details',
    headers: {
      Authorization: 'Bearer ' + access_token
    }
  })
    .then(function (response) {
      // Success
      console.log(response);
      // res.redirect('/upload.html');
      return res.status(200).json(access_token)
    })
    .catch(function (error) {
      // Failed
      console.log(error);
      res.send('Failed to verify the new bucket');
    });
});




var Buffer = require('buffer').Buffer;
// String.prototype.toBase64 = function () {
//     // Buffer is part of Node.js to enable interaction with octet streams in TCP streams, 
//     // file system operations, and other contexts.
//     new Buffer.from(unencoded_urn, 'ascii');
//     return new Buffer(this).toString('base64');
// };
function blabla(unencoded_urn) {
  var buf = new Buffer.from(unencoded_urn, 'ascii');
  var plain_buf = buf.toString('base64');
  return plain_buf
}


app.post('/api/forge/datamanagement/bucket/upload/uploads/:name', function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  console.log(req.params.name)
  var fs = require('fs'); // Node.js File system for reading files
  fs.readFile(`./uploads/${req.params.name}`, function (err, filecontent) {
    console.log(filecontent)
    Axios({
      method: 'PUT',
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      url: 'https://developer.api.autodesk.com/oss/v2/buckets/' + encodeURIComponent(bucketKey) + '/objects/' + encodeURIComponent(req.params.name),
      headers: {
        Authorization: 'Bearer ' + access_token,
        'Content-Disposition': req.params.name,
        'Content-Length': filecontent.length
      },
      data: filecontent
    })
      .then(function (response) {
        // Success
        console.log(response);
        var urn = blabla(response.data.objectId);
        //var urn = response.data.objectId.toBase64();
        res.redirect('/api/forge/modelderivative/' + urn);
        // res.send("heloooooooo")
      })
      .catch(function (error) {
        // Failed
        console.log(error);
        res.send('Failed to create a new object in the bucket');
      });
  });
});



app.get('/api/forge/modelderivative/:urn', function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  var urn = req.params.urn;
  var format_type = 'svf';
  var format_views = ['2d', '3d'];
  Axios({
    method: 'POST',
    url: 'https://developer.api.autodesk.com/modelderivative/v2/designdata/job',
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer ' + access_token
    },
    data: JSON.stringify({
      'input': {
        'urn': urn
      },
      'output': {
        'formats': [
          {
            'type': format_type,
            'views': format_views
          }
        ]
      }
    })
  })
    .then(function (response) {
      // Success
      console.log(response);
      open("http://localhost:8080/viewer.html?urn=" + urn);
      // res.redirect("/blabla")

    })
    .catch(function (error) {
      // Failed
      console.log(error);
      res.send('Error at Model Derivative job.');
    });
});




/////////////////////////
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(cors())
app.use(expressValidator())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static('uploads'));

app.use('/', projectRouter);
app.use('/', folderRouter);
app.use('/', rvtRouter);
app.use('/', tourRouter);
app.use('/', mirFolder);
app.use('/', mirFile)
app.use('/', mirSubFile)
app.use('/', modelRouter);
app.use('/', tourFileRouter);
app.use('/', authRouter)
app.use('/', adminRouter)
app.use('/', fileRouter)
app.use('/', subContractorRouter)
app.use('/', clientRouter)
app.use('/', memberRouter)
app.use('/', tourlink)
app.use('/', comments)
app.use('/', downloadFile)
app.use('/', openPdf)
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      error: "Unauthorized!!"
    })
  }
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//db

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }).then(() => console.log("DB connected"))

mongoose.connection.on("error", err => {
  console.log(`DB connection error : ${err.message}`)
})


const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`A node js API is listening on port : ${port}`)
})

module.exports = app;
