const express = require('express')

const router = express.Router();

const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');

const db = admin.firestore();

router.post('/:id', async(req, res)=>{

    const {type} = req.body;
    const uid = req.params.id;

    await db.collection('users').doc(uid).update({
        type:type
      })
  .then(async(userRecord) => {
    return res.status(200).json({type: type})
  })
  .catch((error) => {
    return res.status(400).json({...error})
  });
})

module.exports = router;