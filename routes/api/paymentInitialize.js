const express = require('express')

const router = express.Router();

const paystack = require("paystack-api")("sk_test_5be29777739360681164248f17ab3374114303b6");

const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');

const db = admin.firestore();

router.post('/:id', async(req, res)=>{

    const { courseId } = req.body;
    const userId = req.params.id;

    try {


        const courseRef = db.collection('courses')
       let course = await courseRef.where('courseId', '==', courseId).get()
       var foundCourse;
       course.forEach((doc)=>{
        foundCourse = doc.data();
        })
        price = foundCourse.price

        if (foundCourse) {
            
            const userRef = db.collection('users')
            let user = await userRef.where('uid', '==', userId).get()
           
            var foundUser;
            user.forEach((doc)=>{
            foundUser = doc.data();
            })

            if (foundUser) {
                
                let koboPrice = price * 100

                if (foundUser.paystackId) {

                
                // initialize payments
                paystack.transaction
                .initialize({
                  email:foundUser.email,
                  amount:koboPrice,
                  metadata:{
                    courseId: foundCourse.courseId,
                    userId: userId
                  }
                })
                .then(function(body) {
                  return res.send(body);
                })
                .catch(function(error) {
                    res.status(400).json({ 
                        message: error
                    });  
                });

                    
                }else{
                        
                  paystack.customer
                  .create({
                  email: foundUser.email,
                  metadata:{
                  userId: foundUser.uid,
                  name: foundUser.Name
                  }
                  }).then(async function(body) {
                    console.log(body)
                        try {

                           await db.collection('users').doc(userId).update({
                               paystackCode: body.data.customer_code,
                               paystackId: body.data.id
                            })
                            // initialize payments
                            paystack.transaction
                            .initialize({
                                email:foundUser.email,
                                amount:koboPrice,
                                metadata:{
                                    courseId: foundCourse.courseId,
                                    userId: userId
                                }
                            }).then((body)=>{
                                return res.send(body);
                            }).catch((error)=>{
                                console.log(error)
                            })
                            
                            
                        } catch (error) {
                          res.send(error)
                        }
                        

                        
                    })
                }
                





            }else{ 

                res.status(400).json({ 
                    message: ' user not found'
                });  

            }
        
        
        }else{
            res.status(400).json({ 
                message: ' course not found'
            });  
        }



    } catch (error) {
        res.status(400).json({ 
            message: ' payment failed'
        });  
    }

})
module.exports = router;