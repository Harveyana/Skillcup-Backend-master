const express = require('express')

const router = express.Router();

const paystack = require("paystack-api")("sk_test_5be29777739360681164248f17ab3374114303b6");

const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');

const db = admin.firestore();

router.get('/:id', async(req, res)=>{

    const uid = req.params.id;

    try {


        const userRef = db.collection('users')
       let user = await userRef.where('uid', '==', uid).get()
       var found;
       user.forEach((doc)=>{
        found = doc.data();
        })


        if(found && found.type == 'admin'){
            const userRef = db.collection('users')

                await userRef.get().then(snapshot => {
                    
                    let users = snapshot.docs.map(doc => {
                        return doc.data();
                     }); 

                    res.send(users);
                })
           
        }else{
            res.status(400).json({ 
                message: ' user not an Administrator'
            });
        }
        
                
    } catch (error) {
        res.status(400).json({ 
            message: ' operation failed'
        });  
    }

})
module.exports = router;