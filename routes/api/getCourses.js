const express = require('express')

const router = express.Router();

const paystack = require("paystack-api")("sk_test_5be29777739360681164248f17ab3374114303b6");

const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');

const db = admin.firestore();

router.get('/', async(req, res)=>{

    const category = req.query.category;

    try {

        if(category){
            const courseRef = db.collection('courses')
                await courseRef.where('category', '==', category).get().then(snapshot => {
                    
                    let courses = snapshot.docs.map(doc => {
                        return doc.data();
                     }); 

                    res.send(courses);
                })
        }else{
            const courseRef = db.collection('courses')
        // let courses = []
                await courseRef.get().then(snapshot => {
                    
                    let courses = snapshot.docs.map(doc => {
                        return doc.data();
                     }); 

                    res.send(courses);
                })
           
        }
        
                
    } catch (error) {
        res.status(400).json({ 
            message: ' operation failed'
        });  
    }

})
module.exports = router;