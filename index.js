const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
// const { json } = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kzt0x.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());

const port = 5000;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

client.connect(err => {
    const bookingCollection = client.db("apartmentHunt").collection("booking");
    const housesCollection = client.db("apartmentHunt").collection("houses");
    // const reviewsCollection = client.db("apartmentHunt").collection("reviews");
    const usersCollection = client.db("apartmentHunt").collection("users");


    // Add a new User
    app.post('/addUser', (req, res) => {
        const admin = req.body;
        usersCollection.insertOne(admin)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    

    // Show all Reviews
    // app.get('/reviews', (req, res) => {
    //     reviewsCollection.find({})
    //         .toArray((err, documents) => {
    //             res.send(documents);
    //         })
    // })


    // Add a new Order
    // app.post('/addOrder', (req, res) => {
    //     const name = req.body.name;
    //     const email = req.body.email;
    //     const serviceName = req.body.serviceName;
    //     const description = req.body.description;
    //     const price = req.body.price;
    //     const status = req.body.status;

    //     if (req.files) {
    //         const file = req.files.file;
    //         const newImg = file.data;
    //         const encImg = newImg.toString('base64');

    //         var img = {
    //             contentType: req.files.file.mimetype,
    //             size: req.files.file.size,
    //             img: Buffer.from(encImg, 'base64')
    //         };
    //     }

    //     ordersCollection.insertOne({ name, email, serviceName, description, price, status, img })
    //         .then(result => {
    //             res.send(result.insertedCount > 0);
    //         })
    // });


    // Show all Orders
    // app.get('/allOrders', (req, res) => {
    //     ordersCollection.find({})
    //         .toArray((err, documents) => {
    //             res.send(documents);
    //         })
    // })

    // Update Order status
    // app.patch('/updateStatus/:id', (req, res) => {
    //     ordersCollection
    //         .updateOne(
    //             { _id: ObjectId(req.params.id) },

    //             {
    //                 $set: { status: req.body.status },
    //             }
    //         )
    //         .then((result) => {
    //             res.send(result.modifiedCount > 0);
    //         });
    // });


    // Add new House
    app.post('/addHouse', (req, res) => {
        console.log('Save House');
        const title = req.body.title;
        const price = req.body.price;
        const location = req.body.location;
        const bedRoom = req.body.bedRoom;
        const bathRoom = req.body.bathRoom;
        const email = req.body.email;

        if (req.files) {
            const file = req.files.file;

            const newImg = file.data;
            const encImg = newImg.toString('base64');

            var img = {
                contentType: req.files.file.mimetype,
                size: req.files.file.size,
                img: Buffer.from(encImg, 'base64')
            };
        }

        housesCollection.insertOne({ title, price, location, bedRoom, bathRoom, email, img })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    // Show specifiq user booking
    app.get('/bookingList/:email', (req, res) => {
        bookingCollection
            .find({ email: req.params.email })
            .toArray((err, documents) => {
                res.send(documents);
            });
    });


    // Show all Houses
    app.get('/houses', (req, res) => {
        housesCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    // Show specifiq house
    app.get('/house/:id', (req, res) => {
        const id = req.params.id;
        const o_id = new ObjectId(id);
        housesCollection.find({ _id: o_id }).toArray((err, documents) => {
        res.send(documents[0]);
        });
    });

});

    

// check it
app.get('/', (req, res) => {
    res.send("hello from Apartment Hunt Server");
});

app.listen(process.env.PORT || port);


