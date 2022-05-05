const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');


// Middleware
app.use(cors());
app.use(express.json());

// Database Driver Code
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tjy2f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

/* client.connect(err => {
    const collection = client.db("grocHouse").collection("items");

    console.log("Mongo")
    // perform actions on the collection object
    client.close();
}); */

async function run() {
    try {

        await client.connect();
        const itemsCollection = client.db('grocHouse').collection('items');

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