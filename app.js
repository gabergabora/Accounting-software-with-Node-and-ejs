//  The Main Settings
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser") 
const port = 8080 ;
const app = express();
const path = require("path");
const db = mongoose.connection;
// let db_url = 'mongodb://127.0.0.1:27017/Accounting';
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

app.use(cookieParser())

// Connect With MongoDB
mongoose.set('useCreateIndex', true);
mongoose.connect(db_url, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true 
});
mongoose.Promise = global.Promise;
db.on("error", console.error.bind(console, "MongoDB Error !!!"));

const puplic_route = require('./routes/puplic.route');
const accounting_route = require('./routes/accounting.router');
const accounting_guide = require('./routes/accounting_guide.router');
const dailyAgenda      = require('./routes/dailyAgenda.router');

app.use('/',puplic_route)
app.use('/accounting/accounting_guide',accounting_guide)
app.use('/accounting/dailyAgenda',dailyAgenda)
app.use('/accounting',accounting_route)





app.get('/*',(req,res)=>{
    res.render('404',{title:'Not found',p:'This page not found!'})
})
let hostname = 'localhost' ||'192.168.1.6'

server.listen(port,hostname ,()=>{
    console.log('Server is running on port  : ' + port);
})