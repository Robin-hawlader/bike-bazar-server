const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const { query } = require('express');
const port = process.env.PORT || 5000;


// midle ware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.corkt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('modernBikes');
        const bikesCollection = database.collection('bikes');
        const reviewCollection = database.collection('review')
        const usersCollection = database.collection('users')
        const orderCollection = database.collection('orders')
        const uploadCollection = database.collection('upload')


        // orders start
        app.post('/orders', async (req, res) => {
            const orders = req.body;
            const result = await orderCollection.insertOne(orders);
            res.json(result);
        })
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const filter = { email: email };
            const result = await orderCollection.find(filter);
            const orders = await result.toArray()
            res.json(orders);
        })
        app.get('/allorders', async (req, res) => {
            const cursor = orderCollection.find({});
            const order = await cursor.toArray();
            res.send(order);
        })
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        })
        //orders end

        app.post('/upload', async (req, res) => {
            const orders = req.body;
            const result = await uploadCollection.insertOne(orders);
            res.json(result);
        })
        app.get('/upload/', async (req, res) => {
            const cursor = uploadCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/upload/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await uploadCollection.findOne(query)
            res.json(result);
        });


        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result);
        })

        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        })




        app.get('/bikes', async (req, res) => {
            const cursor = bikesCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bikesCollection.findOne(query)
            res.json(result);
        });
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({})
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result)
            res.json(result);
        })
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        })
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
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