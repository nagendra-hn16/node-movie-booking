const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const Post = require('../models/Posts');
const Movies = require('../models/Movies');
const Theaters = require('../models/Theaters');

router.post('/validateUsers', (req, res) => {
    // console.log('here ', req.body.username, req.body.password);
    if (!req.body.username || !req.body.password) {
        return res.json({
            msg: 'data insufficient'
        });
    }
    try {
        // console.log(Users)
        Users.find({
            username: req.body.username,
            password: req.body.password
        }, function (err, result) {
            // console.log('here');
            if (err) {
                res.json({
                    msg: error
                })
            } else {
                // console.log('result', result);
                if(result.length > 0) {
                    req.session.userName = req.body.username;
                    // console.log('in if');
                    // res.set({'Access-Control-Allow-Origin': '*'}).redirect(`${req.headers.referer}list`);
                    res.set({'Access-Control-Allow-Origin': '*'}).json({msg: 'valid user'});
                } else {
                    // console.log('in else');
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

router.post('/moviesList', (req, res) => {
    const sortBy = req.body.sortBy || 'name';
    const order = req.body.sortBy ? -1 : 1;
    if (!req.body.location) {
        return res.json({
            msg: 'data insufficient'
        });
    }
    
    try {
        Movies.find({locations: req.body.location}).sort({[sortBy]: order}).then(
            result => {
                // console.log(req.session.userName);
                res.json(result)
            },
            error => {
                res.json({
                    msg: "error while fetching data"
                })
            }
        )
    } catch (error) {
        res.json({
            msg: "in catch block"
        })
    }
})

router.get('/theatersList', (req, res) => {
    Theaters.find({
        city: req.query.city
    }, function(err, theaters) {
        // console.log(movies)
        let resultList = [];
        theaters.map(theater => {
            theater.movieDetails.map(movie => {
                // console.log('movieDetails : ',req.query.name)
                if(movie.movieName === req.query.name) {
                    movie.theaterName = theater.name;
                    resultList.push(movie)
                }
            })
        })
        // console.log('resultList : ',resultList)
        res.json(resultList);
    })
})

router.post('/confirmBooking', async (req, res) => {
    try {
        const newReservation = {
            "movieName": req.body.movieName,
            "selectedTheater": req.body.selectedTheater,
            "location": req.body.location,
            "noOfSeats": req.body.noOfSeats,
            "price": req.body.price,
            "showDate": req.body.showDate,
            "showTime": req.body.showTime
        };
        console.log("newReservation: ", newReservation);
        const updatedList = await Users.updateOne({username: req.body.userName},
            {$push: {reservations: newReservation}}, {
                new: true,
                runValidators: true
            })
        console.log("updatedList: ", updatedList);
        res.json(updatedList)
    } catch (error) {
        console.log('bookingError: ', error);
    }
})

router.post('/addPost', (req, res) => {
    // console.log(req.body);
    if (!req.body.title || !req.body.description || !req.body.author) {
        return res.json({
            msg: 'data insufficient'
        });
    }
    const post = new Post({
        title: req.body.title,
        description: req.body.description,
        author: req.body.author
    })

    post.save()
        .then(result => {
                res.json(result)
            },
            error => {
                res.json({
                    msg: error
                })
            })
})

// router.get('/validateUser', (req, res) => {
//     res.send('user Authentication');
// })

module.exports = router;