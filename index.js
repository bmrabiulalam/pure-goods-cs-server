const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

// console.log(process.env.DB_USER)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.boucr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventsCollection = client.db(process.env.DB_NAME).collection("events");
  console.log('Database Connected Successfully!')

  app.get('/events', (req, res) => {
    eventsCollection.find({})
    .toArray((err, documents) => {
        res.send(documents);
    })
  })
  
  app.post('/addEvent', (req, res) => {
      const newEvent = req.body;
      
      eventsCollection.insertOne(newEvent)
      .then(result => {
          console.log('event inserted ', result.insertedCount);
          res.send(result.insertedCount > 0)
      })
  })
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})