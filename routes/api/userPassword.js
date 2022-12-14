const express = require('express')

const router = express.Router();

const admin = require('firebase-admin');

const { getAuth } = require('firebase-admin/auth');

const db = admin.firestore();

router.put('/:id', (req, res)=>{

    const {password} = req.body;
    const uid = req.params.id;

    getAuth()
  .updateUser(uid, {
    password: password,
  })
  .then(async(userRecord) => {
    // console.log('Successfully updated user', userRecord.toJSON());
    return res.status(200).json({...userRecord})
  })
  .catch((error) => {
    return res.status(400).json({...error})
  });
})

module.exports = router;