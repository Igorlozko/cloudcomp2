const path = require('path'); // node.js module for handling file paths 
const mongoConnect = require('./util/database').mongoConnect // establishes connection to mongodb

const express = require('express');
const bodyParser = require('body-parser');// middleware to parse incoming requests

const app = express();

// const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/admin', adminData.routes);
app.use('/', shopRoutes.routes); //for forward slash or other possible routes us shoproute.routes

app.use((req, res, next) => {
    //  res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

mongoConnect(() => {
    app.listen(3000); // starts the server on port 3000
});
