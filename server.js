let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mySql = require('mysql');
let path = require('path');

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// home page
app.get('/', (req, res) => {
    return res.send({
        error: false,
        message: 'Welcome to RESTful CRUD API with NOdeJS, Express, MYSQL',
        written_by: 'kanisorn',
        published_on: 'https://milerdev.dev'
    });
});

// connection to mysql database
let dbCon = mySql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'nodejs_api'
});
dbCon.connect();

// retrieve all product
app.get('/products', (req, res) => {
    dbCon.query('SELECT * FROM product', (error, results, fields) => {
        if (error) throw error;

        let message = "";
        if (results === undefined || results.length == 0) {
            message = "Product table is empty";
        } else {
            // Convert the image blob to Base64
            results = results.map(product => {
                if (product.image) {
                    product.image = Buffer.from(product.image).toString('base64');
                }
                return product;
            });
            message = "Successfully retrieve all Product";
        }
        // Render the HTML template and pass the data to it
        return res.render('product', { error: false, data: results, message: message });
    });
});

app.listen(3000, () => {
    console.log('Node App is running on port 3000');
});

module.exports = app;
