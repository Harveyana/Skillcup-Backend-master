const express = require('express')
const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
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
    const userId = req.body.uid

    /// validation for admins only(only admins can create a Course)
    try {



        const userRef = db.collection('users')
       let user = await userRef.where('uid', '==', uid).get()
       var found;
       user.forEach((doc)=>{
        found = doc.data();
        })

        if(found && found.type == 'admin'){
            // get course for deletion
            const userRef = db.collection('users')
            let user = await userRef.where('uid', '==', userId).get()
            
            var foundUser;

            user.forEach((doc)=>{
                foundUser = doc.data();
            })  
            if (foundUser) {
                await db.collection("users").doc(userId).delete().then(()=>{
                    getAuth()
                    .deleteUser(uid)
                    .then(() => {
                      res.status(200).json({ 
                        message: 'user deleted successfully'
                      });
                    }).catch((error)=>{
                       res.status(400).json({ 
                        message: 'operation not successful'
                       }); 
                   })
                })
            }else{
                res.status(400).json({ 
                    message: ' user not found'
                });  
            }
           
        }else{
            res.status(400).json({ 
                message: ' you are not an administrator'
            });  
        }



    } catch (error) {
        res.status(400).json({ 
            message: ' user not found'
        });  
    }
    





})

module.exports = router;