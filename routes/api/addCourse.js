const express = require('express')
const admin = require('firebase-admin');

const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const { format } = require("util");
// const serviceAccount = require('config/serviceAccount.json')
const { Storage } = require("@google-cloud/storage");

const storage = new Storage({ keyFilename:'serviceAccount.json'});

// initializeApp({
//   credential: cert('serviceAccount.json'),
//   storageBucket: 'skillcup-1a955.appspot.com'
// });

const Multer = require('multer')

const router = express.Router();

const videoStorage = Multer.diskStorage({
  destination: 'videos', // Destination to store video 
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '_' + Date.now())
  }
});

// const maxSize = 2 * 1024 * 1024;
const maxSize = 100000000;
// const bucket = "https://skillcup-1a955.appspot.com";
// const bucket = storage.bucket('skillcup-1a955');

const processFile = Multer({
  limits: {
    fileSize: 400 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  }
}).single("file");

// const { getAuth } = require('firebase-admin/auth');
const bucket = getStorage().bucket();
const db = admin.firestore();

router.post('/:id', processFile, (req, res) => {

    // res.status(201).json(req.file)
    // const uid = req.params.id;
  // try {

  //   const blob = bucket.file(req.file.originalname);
  //     const blobStream = blob.createWriteStream({
  //       resumable: false,
  //     });

  //     blobStream.on("error", (err) => {
  //       res.status(500).send({ message: err.message });
  //     });



  //   blobStream.on("finish", async (data) => {
  //     // Create URL for directly file access via HTTP.
  //     const publicUrl = format(
  //       `https://storage.googleapis.com/${bucket.name}/${blob.name}`
  //     );

  //     try {

  //     // Make the file public

  //       await bucket.file(req.file.originalname).makePublic();
  //     } catch {
  //       return res.status(500).send({
  //         message:
  //           `Uploaded the file successfully: ${req.file.originalname}, but public access is denied!`,
  //         url: publicUrl,
  //       });
  //     }

  //     res.status(200).send({
  //       message: "Uploaded the file successfully: " + req.file.originalname,
  //       url: publicUrl,
  //     });

  //   });

  //   blobStream.end(req.file.buffer);
    
  // } catch (error) {
  //   res.status(500).send({
  //     message: `Could not upload the file: ${req.file.originalname}. ${error}`,
  //   });
  // }
      


  const newFile = bucket.file(req.file.originalname);

 const fileStream = newFile.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    },
    resumable: false,
    public: true
  });

  fileStream.write(req.file.buffer);

  fileStream.on('error', err => {
    console.error('error', err)
  });

  fileStream.on('finish', async() => {
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${req.file.originalname}`
      );
      console.log(publicUrl)
      // res.status(200).json({ 
      //   status: res.statusCode,
      //   message: publicUrl
      // });


   console.log(`gs://${bucket.name}/${req.file.originalname} is now public.`);
  
    console.log('finish!');
  });

  fileStream.end();

  // 7 response
  res.status(200).json({ 
    status: res.statusCode,
    message: 'Upload OK'
  });

      
    
  
})

module.exports = router;