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

const processFile = Multer({
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
}).single("file");

const { getAuth } = require('firebase-admin/auth');

const bucket = getStorage().bucket();
const db = admin.firestore();

router.post('/:id', processFile, (req, res) => {

  const uid = req.params.id;

  const newFile = bucket.file(req.file.originalname);

 const fileStream = newFile.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    },
    resumable: false,
    public: true
  });

  try {


      fileStream.write(req.file.buffer);

      fileStream.on('error', err => {
         res.status(400).json({ 
          message: err
         });
      });

    fileStream.on('finish', async() => {
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${req.file.originalname}`
      );

      const userRef = db.collection('users')
      let user = await userRef.where('uid', '==', uid).get()
           
      var found;
      user.forEach(async(doc)=>{
      found = doc.data();
        if (found.profilePic) {
           await bucket.file(found.profilePicName).delete()

              getAuth()
              .updateUser(uid, {
                photoURL: publicUrl,
              })
              await db.collection('users').doc(uid).set({
              profilePic: publicUrl,
              profilePicName: req.file.originalname
              },{ merge: true });

              res.status(200).json({ 
               status: res.statusCode,
               message: 'updated Successfully'
              });

        }
      })

      
  });

  fileStream.end();

  } catch (error) {
    res.status(400).json({ 
    message: error
  });
  }
  

  
    
  
})


module.exports = router;