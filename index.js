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
    // const usersCollection = client.db("apartmentHunt").collection("users");


    // Add a new User
    // app.post('/addUser', (req, res) => {
    //     const admin = req.body;
    //     usersCollection.insertOne(admin)
    //         .then(result => {
    //             res.send(result.insertedCount > 0)
    //         })
    // });



    // Booking Request
    app.post('/bookingRequest', (req, res) => {
        const name = req.body.name;
        const customerEmail = req.body.customerEmail;
        const phone = req.body.phone;
        const message = req.body.message;
        const ownerEmail = req.body.ownerEmail;
        const status = req.body.status;
        const houseName = req.body.houseName;
        const price = req.body.price;
        
        bookingCollection.insertOne({ name, customerEmail, phone, message, ownerEmail, status, houseName, price })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    });


    // Show my house booking list booking by others users
    app.get('/bookingList/:email', (req, res) => {
        console.log('bookingLists')
        bookingCollection
            .find({ ownerEmail: req.params.email })
            .toArray((err, documents) => {
                res.send(documents);
            });
    });


    // Show my booking list which I booked
    app.get('/myRent/:email', (req, res) => {
        bookingCollection
            .find({ customerEmail: req.params.email })
            .toArray((err, documents) => {
                res.send(documents);
            });
    });

    

    // Update Booking status
    app.patch('/updateStatus/:id', (req, res) => {
        bookingCollection
            .updateOne(
                { _id: ObjectId(req.params.id) },

                {
                    $set: { status: req.body.status },
                }
            )
            .then((result) => {
                res.send(result.modifiedCount > 0);
            });
    });


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


