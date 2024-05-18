const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT;
const mongoose = require('mongoose');
const cors = require('cors');

// Configure CORS
app.use(cors({
    origin: 'http://localhost:3000', // Adjust this to your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true // Allow cookies to be sent with requests
}));
app.use(express.json());
app.use(express.static('uploads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODBCONNECTIONSTRING).then(() => {
    console.log("mongodb is connected");
}).catch((error) => {
    console.log("error", error);
});

app.use('/request',require('./apis/requestToPay.api'));
app.use('/users',require('./apis/user.api'));
app.use('/permissions',require('./apis/permission.api'));
app.use('/organizations',require('./apis/organization.api'));
app.use('/ocr',require('./apis/ocr.api'));
app.use('/ocr',require('./apis/payment.api'));



// Start the server
let server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});


app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
