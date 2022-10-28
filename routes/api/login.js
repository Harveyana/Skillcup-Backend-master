const express = require('express')
const axios = require('axios')

const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const config = require('config');
// const {check, validationResult} = require('express-validator');
// const generatePassword = require('password-generator')

const admin = require('firebase-admin');
const db = admin.firestore();

router.post('/', (req, res) =>{

    const {email, password} = req.body;

    axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAebWXihdpH37PIfJOVWqvyi92mll9AFjk',
           { email: email, password: password, returnSecureToken:true }
           ).then(async(response)=>{
            // return res.status(200).send(response)
                const userRef = db.collection('users')
                let user = await userRef.where('email', '==', email).get()
           
                var found;
                user.forEach((doc)=>{
                found = doc.data();
                return res.status(200).json({...found,...response.data})
                })
        }).catch((error) => {
            return res.status(400).json({...error})
        });

});
module.exports = router;