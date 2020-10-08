const express = require('express');
const Users = require('../models/Users');
const Movies = require('../models/Movies');
const Theaters = require('../models/Theaters');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/moviesList', extractToken, (req, res) => {
    try {
        jwt.verify(req.token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) {
                res.sendStatus(403);
            } else {
                const sortBy = req.body.sortBy || 'name';
                const order = req.body.sortBy ? -1 : 1;
                if (!req.body.location) {
                    return res.json({
                        msg: 'data insufficient'
                    });
                }
                Movies.find({locations: req.body.location}).sort({[sortBy]: order}).then(
                    result => {
                        res.json({
                            userInfo: decoded,
                            result
                        })
                    },
                    error => {
                        res.json({
                            msg: "error while fetching data",
                            error
                        })
                    }
                )
            }
        })
    } catch (error) {
        res.json({
            msg: "in catch block",
            error
        })
    }
})

router.get('/theatersList', extractToken, (req, res) => {
    jwt.verify(req.token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) {
            res.sendStatus(403);
        } else {
            Theaters.find({
                city: req.query.city
            }, function(err, theaters) {
                if(err) {
                    res.sendStatus(403);
                }
                let resultList = [];
                theaters.map(theater => {
                    theater.movieDetails.map(movie => {
                        if(movie.movieName === req.query.name) {
                            movie.theaterName = theater.name;
                            resultList.push(movie)
                        }
                    })
                })
                res.json({
                    userInfo: decoded,
                    result: resultList
                });
            })
        }
    })
})

router.post('/confirmBooking', extractToken, async (req, res) => {
    try {
        jwt.verify(req.token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) {
                res.sendStatus(403);
            } else {
                const newReservation = {
                    "movieName": req.body.movieName,
                    "selectedTheater": req.body.selectedTheater,
                    "location": req.body.location,
                    "noOfSeats": req.body.noOfSeats,
                    "price": req.body.price,
                    "showDate": req.body.showDate,
                    "showTime": req.body.showTime
                };
                await Users.updateOne({username: req.body.userName},
                    {$push: {reservations: newReservation}}, {
                        new: true,
                        runValidators: true,
                        upsert: true
                    })
                res.json({
                    userInfo: decoded,
                    msg: "booking confirmed!",
                    price: req.body.price
                });
            }
        })
    } catch (error) {
        console.log('bookingError: ', error);
    }
})

const extractToken = (req, res, next) => {
    const bearerHeader = req.headers('autorization');
    if(typeof bearerHeader !== undefined) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
};

module.exports = router;