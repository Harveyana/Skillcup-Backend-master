const express = require('express')
const admin = require('firebase-admin');
const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");

const storage = new Storage({ keyFilename:'serviceAccount.json'});

const router = express.Router();

const bucket = getStorage().bucket();
const db = admin.firestore();

router.delete('/:id', async(req, res)=>{

    const uid = req.params.id;
    const courseId = req.body.courseId

    /// validation for admins only(only admins can create a Course)
    try {



        const userRef = db.collection('users')
       let user = await userRef.where('uid', '==', uid).get()
       var found;
       user.forEach((doc)=>{
        found = doc.data();
        })

        if(found.type == 'admin'){
            // get course for deletion
            const courseRef = db.collection('courses')
            let course = await courseRef.where('courseId', '==', courseId).get()
            
            var foundCourse;

            course.forEach(async(doc)=>{
                foundCourse = doc.data();
            })  
            if (foundCourse) {
                await bucket.file(foundCourse.filename).delete().then(async()=>{
                   await db.collection("courses").doc(courseId).delete().then(()=>{
                    res.status(200).json({ 
                        message: 'Course deleted successfully'
                      });
                   }).catch((error)=>{
                       res.status(400).json({ 
                        message: 'operation not successful'
                       }); 
                   })
                })
            }else{
                res.status(400).json({ 
                    message: ' Course not found'
                });  
            }
           
        }else{
            res.status(400).json({ 
                message: ' User not an administrator'
            });  
        }



    } catch (error) {
        res.status(400).json({ 
            message: ' operation not successful'
        });  
    }
    





})

module.exports = router;