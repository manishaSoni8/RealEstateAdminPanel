require('dotenv').config();
const express = require('express');

// Add flash import
const flash = require('connect-flash');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const isAuth = require('./middleware/is-auth')
const adminRoutes = require('./routes/admin');

const authConfig = require('./config/auth.config');
const Admin = require('./models/admin');

const http = require('http');
const fs = require('fs');
const multer = require('multer');

const bodyParser=require('body-parser');

const cors =require('cors');



const app = express();
const server = http.createServer(app);
// Create server and socket.io instance


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Flash messages after passport
app.use(flash());

// Update the session check middleware
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    res.locals.currentUser = req.session.user || null;

    // Add this: Set userId in session if user exists
    if (req.session.user) {
        req.session.userId = req.session.user._id;
    }

    next();
});

const crypto = require('crypto');

app.use(flash());


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Specific package routes
app.use('/slick', express.static(path.join(__dirname, 'node_modules/slick-carousel/slick')));
app.use('/lightbox', express.static(path.join(__dirname, 'node_modules/lightbox2/dist')));
app.use('/jquery-ui', express.static(path.join(__dirname, 'node_modules/jquery-ui/dist')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));
app.use('/font-awesome', express.static(path.join(__dirname, 'node_modules/font-awesome'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/font-awesome', express.static(path.join(__dirname, 'node_modules/font-awesome')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect('mongodb+srv://balajipathak:pUo5vnHtW84bZTej@cluster0.himqpss.mongodb.net/realEstate', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})



//body-parser
app.use(cors());



app.use(adminRoutes);


const authenticateToken = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return next();
    }

    jwt.verify(token, 'your-jwt-secret', (err, admin) => {
        if (err) {
            return next();
        }
        req.admin = admin;
        next();
    });
};

app.use(authenticateToken);

console.log("vaerified");
//socket 





server.listen(process.env.PORT || 3005, () => {
    console.log(`Server running on port ${process.env.PORT || 3005}`);
});

