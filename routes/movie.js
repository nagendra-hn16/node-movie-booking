const express = require('express');
const router = express.Router();

const Users = require('../models/Users');
const Movies = require('../models/Movies');
const Theaters = require('../models/Theaters');

router.post('/moviesList', async (req, res) => {
    try {
        const sortBy = req.body.sortBy || 'name';
        const order = req.body.sortBy ? -1 : 1;
        if (!req.body.location) {
            return res.json({
                msg: 'data insufficient'
            });
        } else {
            req.session.selectedLocation = req.body.location;
        }
        const movies = await Movies.find({
            locations: req.body.location
        }).sort({[sortBy]: order});

        res.json({
            header: {
                userName: req.session.userName,
                locations: req.session.locations,
                selectedLocation: req.session.selectedLocation
            },
            moviesList: movies
        })
    } catch (error) {
        res.json({
            msg: "in catch block",
            error
        })
    }
})

router.post('/select', async (req, res) => {
    try {
        req.session.movieName = req.body.movieName;
        req.session.language = req.body.language;
        req.session.rating = req.body.rating;
        req.session.screenType = req.body.screenType;
        res.json({
            msg: `movie selected  : ${req.body.movieName}`
        })
    } catch (error) {
        res.json({
            msg: "in catch block",
            error
        })
    }
})

router.get('/movieDetails', async (req, res) => {
    try {
        let resultList = [];
        const theaters = await Theaters.find({
            city: req.session.selectedLocation
        });
        theaters.map(theater => {
            theater.movieDetails.map(movie => {
                if(movie.movieName === req.session.movieName) {
                    movie.theaterName = theater.name;
                    resultList.push(movie)
                }
            })
        })
        res.json({
            header: {
                userName: req.session.userName,
                locations: req.session.locations,
                selectedLocation: req.session.selectedLocation
            },
            selectedMovieDetails: {
                movieName: req.session.movieName,
                language: req.session.language,
                rating: req.session.rating,
                screenType: req.session.screenType
            },
            theatersList: resultList
        });
    } catch (error) {
        res.sendStatus(403);
    }
})

router.post('/selectShow', async (req, res) => {
    try {
        req.session.showDate = req.body.showDate;
        req.session.showTime = req.body.showTime;
        req.session.seats = req.body.seats;
        req.session.selectedTheater = req.body.selectedTheater;
        req.session.price = req.body.price;
        
        res.json({
            msg: 'show selected'
        });
    } catch (error) {
        res.sendStatus(403);
    }
})

router.get('/bookingSummary', async (req, res) => {
    try {
        res.json({
            header: {
                userName: req.session.userName,
                locations: req.session.locations,
                selectedLocation: req.session.selectedLocation
            },
            bookingSummary: {
                test: 'test',
                movieName: req.session.movieName,
                selectedTheater: req.session.selectedTheater,
                selectedLocation: req.session.selectedLocation,
                seats: req.session.seats,
                price: req.session.price,
                showDate: req.session.showDate,
                showTime: req.session.showTime
            }
        });
    } catch (error) {
        res.sendStatus(403);
    }
})

router.post('/confirmBooking', async (req, res) => {
    try {
        const newReservation = {
            "movieName": req.session.movieName,
            "selectedTheater": req.session.selectedTheater,
            "location": req.session.selectedLocation,
            "noOfSeats": req.session.seats,
            "price": req.session.price,
            "showDate": req.session.showDate,
            "showTime": req.session.showTime
        };
        const updatedList = await Users.updateOne({username: req.session.userName},
            {$push: {reservations: newReservation}}, {
                new: true,
                runValidators: true,
                upsert: true
            })
        res.json({
            header: {
                userName: req.session.userName,
                locations: req.session.locations
            },
            msg: "booking confirmed!",
            price: req.session.price
        });
    } catch (error) {
        console.log('bookingError: ', error);
    }
})

router.get('/bookingConfirmation', async (req, res) => {
    try {
        res.json({
            header: {
                userName: req.session.userName,
                locations: req.session.locations,
                selectedLocation: req.session.selectedLocation
            },
            bookingConfirmation: {
                price: req.session.price
            }
        });
    } catch (error) {
        res.sendStatus(403);
    }
})

module.exports = router;