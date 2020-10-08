const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const Movies = require('../models/Movies');
const Theaters = require('../models/Theaters');
const jwt = require('jsonwebtoken');
// const Post = require('../models/Posts');

const extractToken = (req, res, next) => {
    // console.log(req.headers.autorization);
    const bearerHeader = req.headers.autorization;
    if(typeof bearerHeader !== undefined) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403).json({
            msg: 'no token'
        });
    }
};

router.post('/validateUsers', (req, res) => {   
    if (!req.body.username || !req.body.password) {
        return res.json({
            msg: 'data insufficient'
        });
    }
    try {
        Users.find({
            username: req.body.username,
            password: req.body.password
        }, function (err, result) {
            if (err) {
                res.json({
                    msg: error
                })
            } else {
                if(result.length > 0) {
                    jwt.sign({
                        userName: result.username,
                        userRole: result.userRole
                    }, process.env.JWT_SECRET, {
                        expiresIn: 600
                    }, (err, token) => {
                        if(err) {
                            res.sendStatus(403);
                        } else {
                            res.set({'Access-Control-Allow-Origin': '*'}).json({
                                msg: 'valid user',
                                token
                            });
                        }
                    })
                    
                } else {
                    res.json({msg: 'invalid user'});
                }
            }
        })
    } catch (error) {
        res.json({
            msg: error
        })
    }
})

router.post('/moviesList', extractToken, (req, res) => {
    try {
        jwt.verify(req.token, process.env.JWT_SECRET, (err, verified) => {
            if(err) {
                res.sendStatus(403);
            } else {
                const decoded = jwt.decode(req.token, {complete: true});
                console.log('payload', decoded.payload);
                const sortBy = req.body.sortBy || 'name';
                const order = req.body.sortBy ? -1 : 1;
                if (!req.body.location) {
                    return res.json({
                        msg: 'data insufficient'
                    });
                }
                Movies.find({locations: req.body.location})
                .sort({[sortBy]: order}).then(
                    result => {
                        res.json({
                            userInfo: verified,
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
        res.set({'Access-Control-Allow-Origin': '*'}).json({
            msg: "in catch block",
            error
        })
    }
})

router.get('/theatersList', extractToken, (req, res) => {
    jwt.verify(req.token, process.env.JWT_SECRET, (err, verified) => {
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
                res.set({'Access-Control-Allow-Origin': '*'}).json({
                    userInfo: verified,
                    result: resultList
                });
            })
        }
    })
})

router.post('/confirmBooking', extractToken, (req, res) => {
    try {
        jwt.verify(req.token, process.env.JWT_SECRET, async (err, verified) => {
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
                const updatedList = await Users.updateOne({username: req.body.userName},
                    {$push: {reservations: newReservation}}, {
                        new: true,
                        runValidators: true,
                        upsert: true
                    })
                res.set({'Access-Control-Allow-Origin': '*'}).json({
                    userInfo: verified,
                    msg: "booking confirmed!",
                    price: req.body.price
                });
            }
        })
    } catch (error) {
        console.log('bookingError: ', error);
    }
})

// router.post('/addPost', (req, res) => {
//     // console.log(req.body);
//     if (!req.body.title || !req.body.description || !req.body.author) {
//         return res.json({
//             msg: 'data insufficient'
//         });
//     }
//     const post = new Post({
//         title: req.body.title,
//         description: req.body.description,
//         author: req.body.author
//     })

//     post.save()
//         .then(result => {
//                 res.json(result)
//             },
//             error => {
//                 res.json({
//                     msg: error
//                 })
//             })
// })

// router.get('/validateUser', (req, res) => {
//     res.send('user Authentication');
// })

module.exports = router;