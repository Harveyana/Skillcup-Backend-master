const express = require('express')

const admin = require('firebase-admin')
const serviceAccount = require('./config/serviceAccount.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(express.json())

app.use('/api/register', require('./routes/api/register'))
app.use('/api/login', require('./routes/api/login'))
app.use('/api/user/', require('./routes/api/user'))

app.get('/', (req, res)=>{
    res.send('Hello Harvey')
})

const port = process.env.PORT || 4000;

app.listen(port, ()=>{
    console.log(`listening on PORT ${port}`)
})