const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();

// Middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.0o9qayn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const ArtCollections = client.db("artDB").collection("Arts");
    const ArtCatetoryCollection = client
      .db("ArtCategoryDB")
      .collection("ArtCategory");

    // create a post
    app.post("/art", async (req, res) => {
      const art = req.body;
      const result = await ArtCollections.insertOne(art);
      res.send(result);
    });

    // Read data
    app.get("/art", async (req, res) => {
      const cursor = ArtCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/art/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await ArtCollections.findOne(filter);
      res.send(result);
    });

    app.get("/myArt/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { userEmail: email };
      const result = await ArtCollections.find(filter).toArray();
      res.send(result);
    });

    app.get("/updateArts/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await ArtCollections.findOne(filter);
      res.send(result);
    });

    // update arts
    app.put("/updateArts/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const art = req.body;
      const updateArt = {
        $set: {
          itemName: art.itemName,
          subcategory: art.subcategory,
          price: art.price,
          rating: art.rating,
          time: art.time,
          photo: art.photo,
          description: art.description,
          customization: art.customization,
          stock: art.stock,
        },
      };
      const result = await ArtCollections.updateOne(filter, updateArt, options);
      res.send(result);
    });

    // Delete oparetion
    app.delete("/updateArts/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await ArtCollections.deleteOne(filter);
      res.send(result);
    });

    // Manage data for art category**************

    app.get("/artCategory", async (req, res) => {
      const cursor = ArtCatetoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/artCategory/:name", async (req, res) => {
      const name = req.params.name;
      const filter = { item_name: name };
      const result = await ArtCatetoryCollection.find(filter).toArray();
      res.send(result);
    });

    app.get("/");
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("DrawMastery Server is running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
