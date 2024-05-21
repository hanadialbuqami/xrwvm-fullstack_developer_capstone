const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3030;

// Setup middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Read JSON data from local files
const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

// Connect to MongoDB
mongoose.connect("mongodb://mongo_db:27017/", { 'dbName': 'dealershipsDB' });

// MongoDB models
const Reviews = require('./review');
const Dealerships = require('./dealership');

// Populate the database with initial data
try {
    Reviews.deleteMany({}).then(() => {
        Reviews.insertMany(reviews_data['reviews']);
    });
    Dealerships.deleteMany({}).then(() => {
        Dealerships.insertMany(dealerships_data['dealerships']);
    });

} catch (error) {
    console.error('Error populating database', error);
}

// Express route to home
app.get('/', async (req, res) => {
    res.send("Welcome to the Mongoose API");
});

// Fetch all reviews
app.get('/fetchReviews', async (req, res) => {
    try {
        const documents = await Reviews.find();
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching documents' });
    }
});

// Fetch reviews by dealership ID
app.get('/fetchReviews/dealer/:id', async (req, res) => {
    try {
        const documents = await Reviews.find({ dealership: req.params.id });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching documents' });
    }
});

// Fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
    try {
        const dealerships = await Dealerships.find();
        res.json(dealerships);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealerships' });
    }
});

// Fetch dealerships by state
app.get('/fetchDealers/:state', async (req, res) => {
    try {
        const state = req.params.state;
        const dealerships = await Dealerships.find({ state: state });
        res.json(dealerships);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealerships by state' });
    }
});

app.get('/fetchDealer/:id', async (req, res) => {
    try {
        const documents = await Reviews.find({ id: req.params.id });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching documents' });
    }
});
// Insert a new review
app.post('/insert_review', async (req, res) => {
    const data = req.body;
    const documents = await Reviews.find().sort({ id: -1 });
    let new_id = documents.length > 0 ? documents[0]['id'] + 1 : 1;

    const review = new Reviews({
        id: new_id,
        name: data['name'],
        dealership: data['dealership'],
        review: data['review'],
        purchase: data['purchase'],
        purchase_date: data['purchase_date'],
        car_make: data['car_make'],
        car_model: data['car_model'],
        car_year: data['car_year'],
    });

    try {
        const savedReview = await review.save();
        res.json(savedReview);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error inserting review' });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});