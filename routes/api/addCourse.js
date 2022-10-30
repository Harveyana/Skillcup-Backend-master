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
    fileSize: 500 * 1024 * 1024 // no larger than 500mb, you can change as needed.
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "video/mp4" || file.mimetype == "video/mkv" || file.mimetype == "video/avi") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .mp4, .mkv and .avi format allowed!'));
    }
  }
}).single("file");

// const { getAuth } = require('firebase-admin/auth');
const bucket = getStorage().bucket();
const db = admin.firestore();

router.post('/:id', processFile, async(req, res) => {

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
      
  const uid = req.params.id;
  const { name, description, category, price, author, body } = req.body

  const newFile = bucket.file(req.file.originalname);

 const fileStream = newFile.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    },
    resumable: false,
    public: true
  });

  try {

    /// validation for admins only(only admins can create a Course)

       const userRef = db.collection('users')
       let user = await userRef.where('uid', '==', uid).get()
           
       var found;
        user.forEach((doc)=>{
        found = doc.data();
          
        if (found.type == 'admin') {

                      fileStream.write(req.file.buffer);

                      fileStream.on('error', err => {
                        console.error('error', err)
                        res.status(400).json({ 
                          message: err
                          });
                      });

                      fileStream.on('finish', async() => {
                          const publicUrl = format(
                            `https://storage.googleapis.com/${bucket.name}/${req.file.originalname}`
                          );
                          console.log(publicUrl)

                          // upload Course documents together with the video url 

                          courseId = `${name}${Date.now()}`
                          await db.collection('courses').doc(courseId).set({
                            courseId: courseId,
                            name:name,
                            videoUrl: publicUrl,
                            description: description,
                            category: category,
                            thumbnail: null,
                            price: price,
                            body: body,
                            author: author,
                            createdBy: uid,
                          })


                          res.status(200).json({ 
                            message: 'Course created successfully'
                          });


                      console.log(`gs://${bucket.name}/${req.file.originalname} is now public.`);
                      
                        console.log('finish!');
                      });

                      fileStream.end();

        } else {

          res.status(400).json({ 
          message: ' User not an administrator'
          });


        }



        })

    

  } catch (error) {
    res.status(400).json({ 
      message: err
    });
  }

  

  // 7 response
  

      
    
  
})

module.exports = router;