const express = require('express')
const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");

const storage = new Storage({ keyFilename:'serviceAccount.json'});
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

const bucket = getStorage().bucket();
const db = admin.firestore();

router.post('/:id', processFile, async(req, res)=>{

    const uid = req.params.id;
    const name = req.body.name

    /// validation for admins only(only admins can create a Course)
    try {

        const newFile = bucket.file(req.file.originalname);

        const fileStream = newFile.createWriteStream({
          metadata: {
          contentType: req.file.mimetype
          },
          resumable: false,
          public: true
        });

        const userRef = db.collection('users')
       let user = await userRef.where('uid', '==', uid).get()
       var found;
       user.forEach((doc)=>{
        found = doc.data();
        })

        if(found && found.type == 'admin'){

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
                         const catId = `${req.body.name} ${Date.now()}`

                            await db.collection('categories').doc(catId).set({
                            name: name,
                            photoUrl: publicUrl,
                            courses:[]
                           });

                           res.status(200).json({ 
                           status: res.statusCode,
                           message: `${req.body.name} category created Successfully`
                           });
                           
                });

                fileStream.end();

           
        }else{
            res.status(400).json({ 
                message: ' you are not an administrator'
            });  
        }



    } catch (error) {
        res.status(400).json({ 
            message: ' operation not successful'
        });  
    }
    





})

module.exports = router;