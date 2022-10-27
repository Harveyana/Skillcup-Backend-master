const express = require('express')

const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const config = require('config');
// const {check, validationResult} = require('express-validator');
// const generatePassword = require('password-generator')

const admin = require('firebase-admin');
const db = admin.firestore();

router.put('/:id', (req, res)=>{

    const userEmail = req.body.email;
    getAuth()
    .generateEmailVerificationLink(userEmail, actionCodeSettings)
    .then((link) => {
      // Construct email verification template, embed the link and send
      // using custom SMTP server.
      return sendCustomVerificationEmail(useremail, displayName, link);
    })
    .catch((error) => {
      // Some error occurred.
    });
    
    return res.send(req.params.id)
})

module.exports = router;