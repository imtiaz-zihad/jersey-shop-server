const express = require("express");
const cors = require("cors");
require("dotenv").config(); // for password security
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x6gil.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();

    const jersyCollection = client.db("jersyDB").collection("jersy");

    app.get("/jersy", async (req, res) => {
      const cursor = jersyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/jersy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jersyCollection.findOne(query);
      res.send(result);
    });

    app.post("/jersy", async (req, res) => {
      const newJersy = req.body;
      console.log(newJersy);

      const result = await jersyCollection.insertOne(newJersy);
      res.send(result);
    });

    app.put("/jersy/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const options = {upsert: true}
        const updatedJersy = req.body;
        const jersy = {
            $set:{
                name: updatedJersy.name,
                 quantity: updatedJersy.quantity,
                 edition: updatedJersy.edition,
                 color: updatedJersy.color,
                 club: updatedJersy.club,
                 photo: updatedJersy.photo,
                details: updatedJersy.details,
            }
        }
        const result = await jersyCollection.updateOne(filter,jersy,options)
        res.send(result);
      });

    app.delete("/jersy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jersyCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// Checking is it work or not
app.get("/", (req, res) => {
  res.send("Added");
});

// Start the Express server
app.listen(port, () => {
  console.log(`Coffee Server is running on port ${port}`);
});
