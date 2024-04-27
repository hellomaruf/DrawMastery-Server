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
