const express = require('express')
const cors = require("cors");
const app = express()
require('dotenv').config()

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `${process.env.MONGO_URI}`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        const courseCollection = client.db("Scholarix").collection("courses");

        // POST COURSE DETAILED DATA 
        app.post("/courses", async (req, res) => {
            let courseData = req.body;
            let result = await courseCollection.insertOne(courseData);
            res.send(result);
        })

        // GET COURSE DETAILS WITH PARALLEL FILTERING
        app.get("/courseDetails", async (req, res) => {
            let { tuitionMin, tuitionMax, countries, degree, scholarship, searchText } = req.query;
            let filter = {};

            if (tuitionMin && tuitionMax) {
                filter.tuition_fees = { $gte: parseFloat(tuitionMin), $lte: parseFloat(tuitionMax) };
            }

            if (countries && countries !== 'allCountry') {
                filter.country_name = countries;
            }

            if (degree && degree !== 'allDegree') {
                filter.field_name = degree;
            }

            if (scholarship && scholarship !== 'allScholarship') {
                filter.available_scholarship = scholarship;
            }

            if (searchText) {
                filter.$or = [
                    { course_name: { $regex: new RegExp(searchText, 'i') } },
                    { university_name: { $regex: new RegExp(searchText, 'i') } }
                ];
            }

            try {
                const result = await courseCollection.find(filter).toArray();
                res.send(result);
            } catch (error) {
                console.error("Error fetching course details:", error);
                res.status(500).send("Internal Server Error");
            }
        })

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Scholarix Server Running!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})