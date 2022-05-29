require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session')

const path = require('path');
const mongoose = require('mongoose');
const { dirname } = require('path');
const fs = require('fs');
const multer = require('multer');

const posted = require('./model/post')
const Account = require('./model/account')

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.static(__dirname + '/partials/settingsFolder'))

// Define session objects
app.use(session({
    secret: process.env.KEY,
    // Forces the session to be saved back to the session store
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

const MONGO_URL = 'mongodb://localhost:27017/instaCloneDB';

mongoose.connect(MONGO_URL, () =>{
    console.log('Database is connnected');
});

passport.use(Account.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Get the route of where the image is located

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        // Get the destination
        // null because it doesn't matter where user has its image
        //  V
        cb(null, path.join(__dirname, '/images'))
    },
    filename: (req, file, cb) => {
        console.log(req.file);
        // Get the specified file name
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// The Gets
app.get('/', (req, res) => {
    // Find account
    if(req.isAuthenticated()){
        posted.find({}, (err, posts) => {
            res.render('index', {posts: posts})
            // console.log(loginInput);
        })

    } else {
        res.redirect('/login')
        console.log('Problem!')
    }
})

app.get('/account', (req, res) => {
    if(req.isAuthenticated()){
        posted.find({}, (err, posts) => {
            Account.findOne({username: "com@fam.com"}, (err, foundUser) => {
                if(!err && foundUser){
                    res.render('account', {posts: posts, account: foundUser});
                } else {
                    // foundAccount is null (fix it)
                    console.log(err);
                }
            })
        })
    }
})


// Logout
app.route('/logout')
    .get((req, res) =>{
        res.redirect('login')
    })
    .post((req, res) =>{
        req.logout();
        res.redirect('/login');
    });


// Posts

app.get('/post', (req, res) => {
    res.render('post')
})
app.post('/post', upload.single('fileType'), (req, res) => {
    console.log(req.file);
    const post = new posted({
        title: req.body.title,
        photo: {
            data: fs.readFileSync(path.join(__dirname + "/images/" + req.file.filename)),
            contentType: req.file.filename
        },
        content: req.body.content
    })
    post.save(function(err){
        if(!err){
            console.log("Success");
            res.redirect('/')                    
        } return err
    })
});


// Register
app.route('/register')
    .get((req, res) => {
        res.render('register');
    })
    .post((req, res) => {
        Account.register({username: req.body.username}, req.body.password, (err, result) => {
            if(err) {
                console.log("Can't register this user" + err);
                res.redirect('/register')
            } else {
                passport.authenticate('local')(req, res, function(){
                    res.redirect('/')
                });
            }    
        })
    });


// Login 
// lmao I'm lazy to add a route
app.get('/login', (req, res) => {
    res.render('login')
})
app.post('/login', (req, res) => {
    // Find username and password and store inside database
    const user = new Account({
        username: req.body.username, 
        password: req.body.password
    })
    
    // Login user
    req.login(user, (err) =>{
        if(err){
            console.log(err)
        } else {
            passport.authenticate('local')(req, res, function(){
                if(!req.body.password){
                    res.redirect('/login')
                    console.log("Please insert a password");         
                }
                res.redirect('/')
            });
        }
    })
})



app.get('partials/../settings', (req, res) =>{
    res.render('settings');
})




app.listen(3000, function() {
    console.log("Server running on port 3000!");
})




/* -------------------------IDEAS----------------------*/
// Limit posts to 10
        // if(posts >= 10){
            // Post.findOneAndDelete({}, (err, foundPost) => {
                // if(!err && foundPost){
                    // console.log("Deleted Post");
                // }
            // })
        // }