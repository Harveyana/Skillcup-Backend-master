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
app.use('/api/users', require('./routes/api/getUsers'))
app.use('/api/updateEmail', require('./routes/api/userMail'))
app.use('/api/updatePassword', require('./routes/api/userPassword'))
app.use('/api/updateUserName', require('./routes/api/userName'))
app.use('/api/updateUserType', require('./routes/api/userType'))
app.use('/api/deleteUser', require('./routes/api/deleteUser'))
app.use('/api/updateProfilePic', require('./routes/api/uploadProfilePic'))
app.use('/api/courses/', require('./routes/api/getCourses'))
app.use('/api/courses/addCourse', require('./routes/api/addCourse'))
app.use('/api/courses/addThumbnail', require('./routes/api/courseThumbnail'))
app.use('/api/courses/deleteCourse', require('./routes/api/deleteCourse'))
app.use('/api/courses/addCategory', require('./routes/api/addCategory'))
app.use('/api/payment/initialize', require('./routes/api/paymentInitialize'))
app.use('/api/payment/verify', require('./routes/api/paymentVerify'))
app.use('/api/payment/history', require('./routes/api/paymentHistory'))

app.get('/', (req, res)=>{
    res.send('Hello Harvey')
})

const port = process.env.PORT || 4000;

app.listen(port, ()=>{
    console.log(`listening on PORT ${port}`)
})