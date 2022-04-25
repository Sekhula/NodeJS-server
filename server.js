// Constants
const express = require('express');
const cors = require('cors');
const userRoute = require('./Routes/user');
const authRoute = require('./Routes/auth');
const upload = require('./Routes/upload')
const subjectRoute = require('./Routes/subject');
const auth = require('./Authentication/authentication');
const assignedSubject = require('./Routes/assignedSubject');
const messagingRoute = require('./Routes/messaging');
const bookingRoute = require('./Routes/booking');

const cloudinary = require('./Cloudinary/cloudinary');
const multer = require('multer');
const fs = require('fs');

const app = express();
const HOST = "0.0.0.0"
const PORT = process.env.PORT || 4310; 

const corsOptions = {origin: '*'}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded());
app.use( cors({origin: true, credentials: true}) )

const uploader = multer({ dest:`qualification/`})

app.get('/', (req,res)=>{
    res.send("Edu app backend running");
})
app.use('/user', userRoute);
app.use('/auth', authRoute);
app.use('/subject', subjectRoute);
app.use('/assignedSubject', assignedSubject);
app.use('/upload',uploader.single("file") ,upload);
app.use('/messaging', messagingRoute);
app.use('/booking', bookingRoute);

app.use((err,req,res)=>{
    console.log(err);
})

app.listen(PORT, HOST, ()=>{
    console.log('server is listening to port ', PORT);
})