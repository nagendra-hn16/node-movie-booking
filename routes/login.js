const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
// const Post = require('../models/Posts');

router.post('/validateUsers', async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.json({
            msg: 'data insufficient'
        });
    }
    // try {
    //     const locations = await Locations.find({});
    //     req.session.locations = locations;
    // } catch (error) {
    //     res.json({
    //         msg: error,
    //         extra: 'error while fetching locations'
    //     })
    // }
    try {
        const user = await Users.findOne({
            username: req.body.username,
            password: req.body.password
        });
        if(user.username === req.body.username) {
            req.session.userName = user.username;
            req.session.selectedLocation  = user.defaultLocation;
            res.json({msg: 'valid user'});
            // req.session.locations = locations;
        } else {
            res.json({msg: 'invalid user'});
        }
    } catch (error) {
        res.json({
            msg: error
        })
    }
})

// router.post('/addPost', (req, res) => {
//     console.log(req.body);
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