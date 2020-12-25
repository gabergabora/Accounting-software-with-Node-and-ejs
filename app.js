//  The Main Settings
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = 8080;
const app = express();
const path = require("path");
const db = mongoose.connection;
let db_url = 'mongodb+srv://ahmed_fouad:12345Aa@cluster0.tpy6v.mongodb.net/<dbname>?retryWrites=true&w=majority'

const flash = require("connect-flash");

const server = require("http").createServer(app);
var io = require('socket.io')(server);
const axios = require('axios');



app.set("port", process.env.PORT || port);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());
app.use(flash());


// Connect With MongoDB
mongoose.set('useCreateIndex', true);
mongoose.connect(db_url, {
    useNewUrlParser: true,
    useFindAndModify: false
});
mongoose.Promise = global.Promise;
db.on("error", console.error.bind(console, "MongoDB Error !!!"));



// app.use((error, req, res, next) => {
//     const status = error.statusCode || 500;
//     const message=error.message;
//     const data=error.data;
//     res.status(status).json({message:message,data:data});
// })


app.get('/', (req, res) => {
    // return res.send('HALL WORLD :) ')
   return res.render('index',{title:'الصفحة الرئيسية'})
})



app.get('/*',(req,res)=>{
    res.render('404',{title:'Not found',p:'This page not found!'})
})

server.listen(port, () => {
    console.log('Server is running on port  : ' + port);
})