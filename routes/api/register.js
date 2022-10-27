const express = require('express')
const axios = require('axios')
const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const config = require('config');
const {check, validationResult} = require('express-validator');
// const generatePassword = require('password-generator')

const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');

const db = admin.firestore();

router.get('/', (req, res)=>{
    res.send('REGISTER PAGE')
})
router.post('/',
// [
//     check('firstName', 'Name is required').not().isEmpty(),
//     check('lastName', 'Name is required').not().isEmpty(),
//     check('email', 'Email is not in the correct format').isEmail(),
//     // check('email', 'Email is not in the correct format').isEmail(),
//     check('password', 'password must be more than 5 characters').isLength({min: 5}),
// ], 
  (req, res)=>{
    // res.send('REGISTER PAGE')
    // const errors = validationResult(req)
    // if (!errors.isEmpty()){
    //     return res.status(400).json({errors: errors.array()})
    // }
    const {firstName, lastName, email, password} = req.body
    // try {
        // const userRef = db.collection('users');
        // let user = await userRef.where('email', '==', email).get()
        // console.log(user)

        // if(!user.empty){
        //     return res.status(400).json({errors: 'This email has already been used.'})
        // }

        getAuth()
        .createUser({
            email: email,
            emailVerified: false,
            password: password,
            displayName: `${firstName} ${lastName}`,
            photoURL: 'http://www.example.com/12345678/photo.png',
            disabled: false,
        })
        .then(async(userRecord) => {
            // See the UserRecord reference doc for the contents of userRecord.
            // console.log('Successfully created new user:', );
            // res.send(userRecord);
            await db.collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            Name:userRecord.displayName,
            type: 'user',
            phoneNumber: '',
            password: password,
            profilePic: userRecord.photoURL,
            email: userRecord.email,
            })
            // const user = getAuth().getUser(userRecord.uid);

            // send verification email

            axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAebWXihdpH37PIfJOVWqvyi92mll9AFjk',
           { email: email, password: password, returnSecureToken:true }
           ).then((response)=>{
            // return res.status(200).send(response)
            console.log(response);
                axios.post('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAebWXihdpH37PIfJOVWqvyi92mll9AFjk',
           { requestType: 'VERIFY_EMAIL', idToken: response.data.idToken }
           ).then(()=>{
            return res.status(200).json({...response.data
            })
           })
           })


        


            // const actionCodeSettings = {
            //     // URL you want to redirect back to. The domain (www.example.com) for
            //     // this URL must be whitelisted in the Firebase Console.
            //     url: 'https://www.google.com',
            //     // This must be true for email link sign-in.
            //     handleCodeInApp: true,
            //     // FDL custom domain.
            //     dynamicLinkDomain: 'coolapp.page.link',
            //   };
            // getAuth()
            // .generateEmailVerificationLink(userRecord.email, actionCodeSettings)
            // .then((link) => {
            //     // Construct password reset email template, embed the link and send
            //     // using custom SMTP server.
            //     sendCustomVerificationEmail(userRecord.email, 'getteep', link);
            //     return res.status(200).json({link})
            // })
            // .catch((error) => {
            //     // Some error occurred.
            // });
            
        })
        .catch((error) => {
            // return res.send('Error creating new user:', error)
            return res.status(400).json({...error})
            // console.log(error);
        });
        // const id = generatePassword(6, false);
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);
        
        // const payload = {
        //     user:{
        //         id,
        //         firstName,
        //         lastName,
        //         type: 'user',
        //         phoneNumber: '',
        //         profilePic: '',
        //         email
        //     }
        // }

        // jwt.sign(
        //     payload,
        //     config.get('jwtpass'),
        //     {expiresIn: 40000},
        //     (err, token)=>{
        //         if(err) throw err;
        //         res.json({token})
        //     }
        // )
    // } catch (error) {
    //     res.send(500).send('server error')
    // }
})

module.exports = router;