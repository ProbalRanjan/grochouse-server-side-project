const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());

// Database Driver Code
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tjy2f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// Database CRUD Operations
async function run() {
    try {

        await client.connect();
        const itemsCollection = client.db('grocHouse').collection('items');

        // Get all Data from database
        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = itemsCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })

        // Get Single data from database by id
        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await itemsCollection.findOne(query);
            res.send(item)
        })

        // Put method to deliver inventory
        app.put('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const newQuantity = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: newQuantity.quantity
                },
            };
            const result = await itemsCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })

        // Restock the Quantity of inventory
        app.post('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const restockQuantity = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: restockQuantity
                },
            };
            const result = await itemsCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        // GET method to get inventory in specific user
        app.get('/myinventory', async (req, res) => {
            const email = req.query.email;
            console.log(email);
            const query = { email: email };
            const cursor = itemsCollection.find(query);
            const myInventory = await cursor.toArray();
            res.send(myInventory);
        })

        // POST method to add Data to Database
        app.post('/inventory', async (req, res) => {
            const newInventory = req.body;
            const result = await itemsCollection.insertOne(newInventory);
            res.send(result);
        })

        // DELETE Data from Database
        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemsCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {
        // await client.close();
    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('The GrocHouse is running')
});

app.listen(port, () => {
    console.log("Site is running", port)
});