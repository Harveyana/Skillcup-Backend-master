const express = require('express')

const router = express.Router();

const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');
const db = admin.firestore();

router.put('/:id', (req, res)=>{

  const {idToken, email} = req.body;
  const uid = req.params.id;

  getAuth()
.updateUser(uid, {
  email: email,
})
.then(async(userRecord) => {
    await db.collection('users').doc(uid).update({
      email: userRecord.email,
    });
    axios.post('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAebWXihdpH37PIfJOVWqvyi92mll9AFjk',
           { requestType: 'VERIFY_EMAIL', idToken: idToken }
           ).then(()=>{
            return res.status(200).json({...userRecord})
    })  
})
.catch((error) => {
  return res.status(400).json({...error})
});
})

module.exports = router;