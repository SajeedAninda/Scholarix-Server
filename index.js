const express = require('express')
const cors = require("cors");
const SSLCommerzPayment = require('sslcommerz-lts')
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

const store_id = `${process.env.STORE_ID}`
const store_passwd = `${process.env.STORE_PASS}`
const is_live = false //true for live, false for sandbox

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });

        // DATABASE COLLECTIONS 
        const courseCollection = client.db("Scholarix").collection("courses");
        const countryCollection = client.db("Scholarix").collection("countryDetails");
        const consultantCollection = client.db("Scholarix").collection("consultants");
        const bookmarksCollection = client.db("Scholarix").collection("bookmarks");
        const bookingCollection = client.db("Scholarix").collection("bookings");
        const userCollection = client.db("Scholarix").collection("users");

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

        // GET SINGLE COUNTRY BY ID
        app.get("/detailedCountry/:id", async (req, res) => {
            let id = req.params.id;
            let query = { _id: new ObjectId(id) };
            let result = await countryCollection.findOne(query);
            res.send(result);
        })

        // GET LATEST COURSES BY ADDED TIME
        app.get("/latestCourses", async (req, res) => {
            let result = await courseCollection.find().sort({ posted_time: -1 }).limit(6).toArray();
            res.send(result);
        })

        // POST CONSULTANT DATA TO COLLECTION 
        app.post("/consultant", async (req, res) => {
            let consultantData = req.body;
            let result = await consultantCollection.insertOne(consultantData);
            res.send(result);
        })

        // API TO GET CONSULTANTS DETAILS 
        app.get("/getConsultants", async (req, res) => {
            let result = await consultantCollection.find().toArray();
            res.send(result);
        })

        // GET SINGLE CONSULTANT DATA BY ID
        app.get("/consultantDetails/:id", async (req, res) => {
            let id = req.params.id;
            let query = { _id: new ObjectId(id) };
            let result = await consultantCollection.findOne(query);
            res.send(result);
        })

        // API TO DELETE A CONSULTANT 
        app.delete("/deleteConsultant/:id", async (req, res) => {
            let id = req.params.id;
            let query = { _id: new ObjectId(id) };
            let result = await consultantCollection.deleteOne(query);
            res.send(result);
        })

        // API TO UPDATE CONSULTANT DATA 
        app.patch("/updateConsultant/:id", async (req, res) => {
            const id = req.params.id;
            const consultantData = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedCourse = {
                $set: {
                    fullName: consultantData.fullName,
                    qualification: consultantData.qualification,
                    expertise: consultantData.expertise,
                    experience: consultantData.experience,
                    email: consultantData.email,
                    phoneNumber: consultantData.phoneNumber,
                    bio: consultantData.bio,
                    charge: consultantData.charge,
                    availability: consultantData.availability,
                    specialization: consultantData.specialization
                },
            };
            const result = await consultantCollection.updateOne(
                filter,
                updatedCourse,
                options
            );
            res.send(result);
        });

        // API TO ADD TO BOOKMARK 
        app.post("/bookmarks", async (req, res) => {
            let bookmarkData = req.body;
            let existingBookmark = await bookmarksCollection.findOne({
                courseId: bookmarkData.courseId,
                currentUserEmail: bookmarkData.currentUserEmail
            });

            if (existingBookmark) {
                return res.status(400).send({ error: "Bookmark already exists." });
            }
            let result = await bookmarksCollection.insertOne(bookmarkData);
            res.send(result);
        });

        // API TO GET BOOKMARKED COURSES FOR PARTICULAR USER 
        app.get("/getBookmarkedCourses/:userEmail", async (req, res) => {
            let email = req.params.userEmail
            let query = { currentUserEmail: email };
            let result = await bookmarksCollection.find(query).toArray();
            res.send(result);
        })

        // API TO DELETE BOOKMARK 
        app.delete("/deleteBookmark/:id", async (req, res) => {
            let id = req.params.id;
            let query = { _id: new ObjectId(id) };
            let result = await bookmarksCollection.deleteOne(query);
            res.send(result);
        })

        let trxId = new ObjectId().toString();
        // API TO BOOK CONSULTANT 
        app.post('/addBooking', async (req, res) => {
            let bookingDetails = req.body;
            let existingBooking = await bookingCollection.findOne({
                "bookingDetails.consultantId": bookingDetails.consultantId,
                "bookingDetails.selectedDate": bookingDetails.selectedDate,
                "bookingDetails.bookingUserEmail": bookingDetails.bookingUserEmail,
                paidStatus: true,
            });

            if (existingBooking) {
                return res.status(400).json({ error: 'Consultant is already booked on this date' });
            }

            let consultant = await consultantCollection.findOne({ _id: new ObjectId(bookingDetails.consultantId) });

            const data = {
                total_amount: consultant.charge,
                currency: 'USD',
                tran_id: trxId, // use unique tran_id for each api call
                success_url: `https://scholarix-server.vercel.app/payment/success/${trxId}`,
                fail_url: `https://scholarix-server.vercel.app/payment/failed/${trxId}`,
                cancel_url: 'http://localhost:3030/cancel',
                ipn_url: 'http://localhost:3030/ipn',
                shipping_method: consultant.availability,
                product_name: consultant.fullName,
                product_category: 'Consultant',
                product_profile: consultant.expertise,
                cus_name: 'Customer Name',
                cus_email: bookingDetails.bookingUserEmail,
                cus_add1: 'Dhaka',
                cus_add2: 'Dhaka',
                cus_city: 'Dhaka',
                cus_state: 'Dhaka',
                cus_postcode: '1000',
                cus_country: 'Bangladesh',
                cus_phone: '01711111111',
                cus_fax: '01711111111',
                ship_name: 'Customer Name',
                ship_add1: 'Dhaka',
                ship_add2: 'Dhaka',
                ship_city: 'Dhaka',
                ship_state: 'Dhaka',
                ship_postcode: 1000,
                ship_country: 'Bangladesh',
            };
            const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
            sslcz.init(data).then(apiResponse => {
                // Redirect the user to payment gateway
                let GatewayPageURL = apiResponse.GatewayPageURL
                res.send({ url: GatewayPageURL })

                let finalPayment = {
                    bookingDetails, paidStatus: false, transaction_id: trxId
                }

                let result = bookingCollection.insertOne(finalPayment);

                console.log('Redirecting to: ', GatewayPageURL)
            });

            app.post("/payment/success/:tranId", async (req, res) => {
                let result = await bookingCollection.updateOne({ transaction_id: req.params.tranId }, {
                    $set: {
                        paidStatus: true
                    }
                })
                if (result.modifiedCount > 0) {
                    res.redirect(`https://scholarix.netlify.app/payment/success/${req.params.tranId}`)
                }
            })

            app.post("/payment/failed/:tranId", async (req, res) => {
                let result = await bookingCollection.deleteOne({ transaction_id: req.params.tranId });
                if (result.deletedCount) {
                    res.redirect(`https://scholarix.netlify.app/payment/failed/${req.params.tranId}`)
                }
            })
        });


        // GET USER SPECIFIC BOOKINGS 
        app.get("/userAppointments/:currentUserEmail", async (req, res) => {
            const currentUserEmail = req.params.currentUserEmail;
            let result = await bookingCollection.find({
                "bookingDetails.bookingUserEmail": currentUserEmail,
                "paidStatus": true
            }).toArray();

            res.send(result);
        });

        // POST USER DATA TO DATABASE WHILE REGISTER 
        app.post("/userRegister", async (req, res) => {
            let user = req.body;
            let result = await userCollection.insertOne(user);
            res.send(result);
        })

        // POST USER DATA WITH GOOGLE LOGIN 
        app.post("/userGoogleRegister", async (req, res) => {
            const userDetails = req.body;
            let checkEmail = userDetails.email;
            const existingUser = await userCollection.findOne({ email: checkEmail });

            if (existingUser) {
                return res.status(409).json({ error: 'Email already exists' });
            }

            let result = await userCollection.insertOne(userDetails);
            res.send(result);
        });

        // API TO GET CURRENT USER DATA 
        app.get("/userData/:email", async (req, res) => {
            const email = req.params.email;
            const query = {
                email: email,
            };
            const result = await userCollection.findOne(query);
            res.send(result);
        });





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