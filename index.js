const express = require('express')
const cors = require("cors");
const app = express()
require('dotenv').config()

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        // DATABASE COLLECTIONS 
        const courseCollection = client.db("Scholarix").collection("courses");
        const countryCollection = client.db("Scholarix").collection("countryDetails");

        // POST COURSE DETAILED DATA 
        app.post("/courses", async (req, res) => {
            let courseData = req.body;
            let result = await courseCollection.insertOne(courseData);
            res.send(result);
        })

        // GET COURSE DETAILS WITH PARALLEL FILTERING 
        app.get("/courseDetails", async (req, res) => {
            try {
                let { tuitionMin, tuitionMax, countries, field, scholarship, searchText, degrees } = req.query;
                let filter = {};

                let pageQuery = parseInt(req.query.page);
                let pageNumber = pageQuery;
                let perPageData = 6;
                let skip = pageNumber * perPageData;

                if (tuitionMin && tuitionMax) {
                    filter.tuition_fees = { $gte: parseFloat(tuitionMin), $lte: parseFloat(tuitionMax) };
                }

                if (countries && countries !== 'allCountry') {
                    filter.country_name = countries;
                }

                if (degrees && degrees !== 'allDegrees') {
                    filter.degree_name = degrees;
                }

                if (field && field !== 'allField') {
                    filter.field_name = field;
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

                const result = await courseCollection.find(filter).skip(skip).limit(perPageData).toArray();
                const count = await courseCollection.countDocuments(filter);

                res.send({ result, count });
            } catch (error) {
                console.error("Error fetching course details:", error);
                res.status(500).send("Internal Server Error");
            }
        });

        // GET COURSE DETAILS BY SPECIFIC COURSE ID
        app.get("/courseDetails/:id", async (req, res) => {
            let id = req.params.id;
            let query = { _id: new ObjectId(id) };
            let result = await courseCollection.findOne(query);
            res.send(result);
        })

        // API TO GET ALL COURSES 
        app.get("/allCourses", async (req, res) => {
            let result = await courseCollection.find().toArray();
            res.send(result);
        })

        // API TO DELETE COURSE 
        app.delete("/deleteCourse/:id", async (req, res) => {
            let id = req.params.id;
            let query = { _id: new ObjectId(id) };
            let result = await courseCollection.deleteOne(query);
            res.send(result);
        })

        app.patch("/updateCourse/:id", async (req, res) => {
            const id = req.params.id;
            const course = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedCourse = {
                $set: {
                    course_name: course.course_name,
                    university_name: course.university_name,
                    degree_name: course.degree_name,
                    field_name: course.field_name,
                    country_name: course.country_name,
                    city_name: course.city_name,
                    tuition_fees: course.tuition_fees,
                    available_scholarship: course.available_scholarship,
                    scholarship_amount: course.scholarship_amount,
                    intake_time: course.intake_time,
                    application_deadline: course.application_deadline,
                    posted_time: course.posted_time
                },
            };
            const result = await courseCollection.updateOne(
                filter,
                updatedCourse,
                options
            );
            res.send(result);
        });


        // GET ALL COUNTRY DETAILS
        app.get("/countryDetails", async (req, res) => {
            let result = await countryCollection.find().toArray();
            res.send(result);
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