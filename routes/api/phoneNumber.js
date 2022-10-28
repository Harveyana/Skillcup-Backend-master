const express = require('express')

const router = express.Router();

const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');

const db = admin.firestore();

router.post('/:id', (req, res)=>{

    const {phoneNumber} = req.body;
    const uid = req.params.id;

    getAuth()
  .updateUser(uid, {
    phoneNumber: phoneNumber,
  })
  .then(async(userRecord) => {
      await db.collection('users').doc(uid).update({
        phoneNumber:userRecord.phoneNumber
      });
    return res.status(200).json({...userRecord})
  })
  .catch((error) => {
    return res.status(400).json({...error})
  });

})

module.exports = router;