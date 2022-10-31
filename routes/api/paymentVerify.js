const express = require('express')

const router = express.Router();

const paystack = require("paystack-api")("sk_test_5be29777739360681164248f17ab3374114303b6");

const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');

const db = admin.firestore();

router.post('/:reference', async(req, res)=>{

    const reference = req.params.reference;

    try {


        paystack.transaction
        .verify({reference: reference})
        .then(async function(body) {
            if (body.data.status === 'success'){

                const { userId, courseId }= body.data.metadata

                await db.collection('users').doc(userId).update({
                    courses: admin.firestore.FieldValue.arrayUnion(courseId)
                  });

                  return res.send(body.data)

            }else{

                return res.send(body.data)
            }
        })
        .catch(function(error) {
            res.send(error);
        });
            
    

        

    } catch (error) {
        res.status(400).json({ 
            message: ' verification failed'
        });  
    }

})
module.exports = router;