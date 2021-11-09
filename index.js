const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;


// midle ware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.corkt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const databse = client.db('modernBikes');
        const bikesCollection = databse.collection('bikes');


        app.get('/bikes', async (req, res) => {
            const cursor = bikesCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
    }
    finally {
        // await client.close()
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Modern bikes server Running')
});

app.listen(port, () => {
    console.log('Server Running port', port)
})