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

    
    return res.send(req.params.id)
})

module.exports = router;