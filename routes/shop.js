const express = require('express');
const router = express.Router(); // creates an instance of express router to handle routes seperately 
const getDbClient = require('../util/database').getDbClient; // gets refrence to mongodb

let nextProductId = 0;

router.get('/products', (req, res, next) => { // retrieves all produts 
  const db = getDbClient();
  db.collection('products')
    .find()
    .toArray()
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.get('/getSpecificProduct', (req, res, next) => {
  res.send(`
    <div>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/addProduct">Add Product</a></li>
          <li><a href="/showProducts">Show Products</a></li>
        </ul>
      </nav>
      <form action="/getSpecificProduct" method="POST">
        <input type="text" name="title" placeholder="Enter Product Title">
        <button type="submit">Get Specific Product</button>
      </form>
    </div>
  `);
});

router.get('/addProduct', (req, res, next) => {
  res.send(`
    <div>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/showProducts">Show Products</a></li>
          <li><a href="/getSpecificProduct">Get Specific Product</a></li>
        </ul>
      </nav>
      <form action="/addTheProduct" method="POST">
        <input type="text" name="title" placeholder="Product title">
        <input type="text" name="price" placeholder="Product price">
        <button type="submit">Add Product</button>
      </form>
    </div>
  `);
});

router.post('/addTheProduct', (req, res, next) => {
  const db = getDbClient();
  db.collection('products')
    .insertOne({ ourId: '' + nextProductId, name: req.body.title, price: req.body.price })
    .then(() => {
      nextProductId++;
      res.redirect('/');
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.get('/updateProduct', (req, res, next) => {
  const db = getDbClient();
  db.collection('products')
    .updateOne({ ourId: '0' }, { $set: { price: '99.95' } })
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      res.send('Error: ' + err);
      res.redirect('/');
    });
});

router.get('/showProducts', (req, res, next) => {
  const db = getDbClient();
  db.collection('products')
    .find()
    .toArray()
    .then((products) => {
      let productList = '<ul>';
      products.forEach((product) => {
        productList += `<li>${product.name}: $${product.price}</li>`;
      });
      productList += '</ul>';
      res.send(`
        <div>
          <nav>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/addProduct">Add Product</a></li>
              <li><a href="/getSpecificProduct">Get Specific Product</a></li>
            </ul>
          </nav>
          ${productList}
        </div>
      `);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.get('/deleteProduct', (req, res, next) => {
  const db = getDbClient();
  db.collection('products')
    .deleteOne({ ourId: '0' })
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      res.send('Error: ' + err);
    });
});
router.post('/getSpecificProduct', (req, res, next) => {
  const title = req.body.title;

  const db = getDbClient();
  db.collection('products')
    .findOne({ name: title })
    .then((product) => {
      if (product) {
        res.json(product);
      } else {
        res.send('Product not found');
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

exports.routes = router;
