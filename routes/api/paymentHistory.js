const express = require('express')

const router = express.Router();

const paystack = require("paystack-api")("sk_test_5be29777739360681164248f17ab3374114303b6");

const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');

const db = admin.firestore();

router.get('/', async(req, res)=>{

    const userId = req.query.id;

    try {

        if(userId){

                    const userRef = db.collection('users')
            let user = await userRef.where('uid', '==', userId).get()
            var found;
            user.forEach((doc)=>{
                found = doc.data();
                })


                if(found){

                    paystack.transaction
                    .list({customer: found.paystackId})
                    .then(function(body) {
                        res.send(body);
                    })
                    .catch(function(error) {
                        res.send(error);
                    });
                    // const userRef = db.collection('users')

                    //     await userRef.get().then(snapshot => {
                            
                    //         let users = snapshot.docs.map(doc => {
                    //             return doc.data();
                    //          }); 

                    //         res.send(users);
                    //     })
                
                }else{
                    res.status(400).json({ 
                        message: ' user not found'
                    });
                }


        }else{

                    paystack.transaction
                    .list()
                    .then(function(body) {
                        res.send(body);
                    })
                    .catch(function(error) {
                        res.send(error);
                    });

        }
        
        
                
    } catch (error) {
        res.status(400).json({ 
            message: ' operation failed'
        });  
    }

})
module.exports = router;