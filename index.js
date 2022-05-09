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

            const query = { _id: ObjectId(id) };
            const service = await productCollection.findOne(query);
            res.send(service);
        });
        app.put('/add-product/:id', async (req, res) => {

            const id = req.params.id


            const query = { _id: ObjectId(id) }
            let result = await productCollection.findOne(query);

            const options = { upsert: true };
            //---------------------------------------------------//
            const add = parseInt(req.query.add)
            const deleted = parseInt(req.query.deleted)
            const addQuantity = parseInt(result?.quantity) + add;
            const deleteQuantity = parseInt(result?.quantity) - deleted;

            try {

                if (add && !deleted) {

                    if (result.quantity) {

                        updateQuantity = await productCollection.updateOne(query, { $set: { quantity: addQuantity } }, options)
                    } else {

                        updateQuantity = await productCollection.updateOne(query, { $set: { quantity: add } }, options)
                    }

                    res.send(result)

                } else {

                    if (result.quantity) {
                        updateQuantity = await productCollection.updateOne(query, { $set: { quantity: deleteQuantity } }, options)

                    }

                    else {
                        res.send({ error: 'Error updating quantity' })
                    }
                    res.send(result)
                }
            }
            catch (error) {
                console.log(error)

            }

        })

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