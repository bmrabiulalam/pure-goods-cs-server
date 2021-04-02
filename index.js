const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

// console.log(process.env.DB_USER)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.boucr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

  const productsCollection = client.db(process.env.DB_NAME).collection("products");
  const ordersCollection = client.db(process.env.DB_NAME).collection("orders");
  console.log('Database Connected Successfully!')

  app.get('/products', (req, res) => {
    productsCollection.find({})
    .toArray((err, documents) => {
        res.send(documents);
    })
  })
  
  app.post('/orders', (req, res) => {
      const clientEmail = req.body.email;
      
      ordersCollection.find({ email: clientEmail})
      .toArray((err, documents) => {
          res.status(200).send(documents);
      })
  })
  
  app.post('/addProduct', (req, res) => {
      const newProduct = req.body;
      
      productsCollection.insertOne(newProduct)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })
  
  app.post('/checkout', (req, res) => {
      const newOrder = req.body;
      console.log('server side: ', newOrder);
      
      ordersCollection.insertOne(newOrder)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })

  app.delete('/deleteProduct/:id', (req, res) => {
      const id = ObjectID(req.params.id);

      productsCollection.deleteOne({ _id: id})
      .then(result => res.send(result.deletedCount > 0))
  })

});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})