const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());


;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.edazl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('ceramic').collection('product');
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);

        });
        app.get('/product', async (req, res) => {
            const id = req.query.id
            console.log(id);
            const query = { _id: ObjectId(id) };
            const service = await productCollection.findOne(query);
            res.send(service);
        });

    }
    finally { }
}
run().catch(console.dir);

app.get('/', (req, res) => {

    res.send('site is raning')

});

app.listen(port, () => {
    console.log('Site is ranning on port');
})