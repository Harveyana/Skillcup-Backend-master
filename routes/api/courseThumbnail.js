const express = require('express')
const admin = require('firebase-admin');
const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const { format } = require("util");
// const serviceAccount = require('config/serviceAccount.json')
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

const { getAuth } = require('firebase-admin/auth');

const bucket = getStorage().bucket();
const db = admin.firestore();

router.post('/:id', processFile, async(req, res) => {

  const uid = req.params.id;

  const courseId = req.body.courseId


  const newFile = bucket.file(req.file.originalname);

 const fileStream = newFile.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    },
    resumable: false,
    public: true
    });

    try {


       // validate admin
       const userRef = db.collection('users')
       let user = await userRef.where('uid', '==', uid).get()
        
       var found;
       user.forEach(async(doc)=>{
            found = doc.data();
        })
            const courseRef = db.collection('courses')
            let course = await courseRef.where('courseId', '==', courseId).get()
            
            var foundCourse;

            course.forEach(async(doc)=>{
                foundCourse = doc.data();

            })  

            if (found.type == 'admin' && foundCourse) {

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
                

                            await db.collection('courses').doc(courseId).set({
                            thumbnail: publicUrl
                           },{ merge: true });

                           res.status(200).json({ 
                           status: res.statusCode,
                           message: 'updated Successfully'
                           });
                           
                    
            

        
                });

                fileStream.end();


            } else {
             res.status(400).json({ 
              message: ' please provide the correct information to update'
               });  
            }

      
        
 
 
 
    } catch (error) {
       res.status(400).json({ 
       message: 'update not successful'
      });
    }
  

  
})


module.exports = router;