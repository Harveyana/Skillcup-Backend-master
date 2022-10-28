const express = require('express')

const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const config = require('config');
// const {check, validationResult} = require('express-validator');
// const generatePassword = require('password-generator')

const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');

const db = admin.firestore();

router.post('/:id', (req, res)=>{

    const {firstName, lastName} = req.body;
    const uid = req.params.id;

    getAuth()
  .updateUser(uid, {
    displayName: `${firstName} ${lastName}`,
  })
  .then(async(userRecord) => {
      await db.collection('users').doc(uid).update({
        Name:userRecord.displayName
      });
    // console.log('Successfully updated user', userRecord.toJSON());
    return res.status(200).json({...userRecord})
  })
  .catch((error) => {
    return res.status(400).json({...error})
  });


    // getAuth()
    // .generateEmailVerificationLink(userEmail, actionCodeSettings)
    // .then((link) => {
    //   // Construct email verification template, embed the link and send
    //   // using custom SMTP server.
    //   return sendCustomVerificationEmail(useremail, displayName, link);
    // })
    // .catch((error) => {
    //   // Some error occurred.
    // });
    
    // return res.send(req.params.id)
})

module.exports = router;