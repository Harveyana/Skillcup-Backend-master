const express = require('express')

const admin = require('firebase-admin')
const serviceAccount = require('./config/serviceAccount.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'skillcup-1a955.appspot.com'
});

const app = express();
app.use(express.json())

// app.use(express.urlencoded({ extended: true }));
app.use('/api/register', require('./routes/api/register'))
app.use('/api/login', require('./routes/api/login'))
app.use('/api/updateEmail', require('./routes/api/userMail'))
app.use('/api/updatePassword', require('./routes/api/userPassword'))
app.use('/api/updateUserName', require('./routes/api/userName'))
app.use('/api/updateUserType', require('./routes/api/userType'))
app.use('/api/updateProfilePic', require('./routes/api/uploadProfilePic'))
app.use('/api/addCourse', require('./routes/api/addCourse'))
app.use('/api/addCourseThumbnail', require('./routes/api/courseThumbnail'))

app.get('/', (req, res)=>{
    res.send('Hello Harvey')
})

const port = process.env.PORT || 4000;

app.listen(port, ()=>{
    console.log(`listening on PORT ${port}`)
})