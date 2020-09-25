const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const Post = require('../models/Posts');

router.post('/validateUsers', (req, res) => {
    // console.log('here ', req.body.username, req.body.password);
    if (!req.body.username || !req.body.password) {
        return res.json({
            msg: 'data insufficient'
        });
    }
    // console.log('here');
    try {
        // console.log(Users)
        Users.find({
            username: req.body.username,
            password: req.body.password
        }, function (err, result) {
            if (err) {
                res.json({
                    msg: error
                })
            } else {
                // console.log('result', result);
                if(result.length > 0) {
                    // console.log('in if');
                    res.json({msg: 'valid user'});
                } else {
                    // console.log('in else');
                    res.json({msg: 'invalid user'});
                }
            }
        })

        // console.log(Users.find());

        // Users.find({username: req.body.username})
        // .then(result => {
        //     console.log('result', result);
        // })

        // const users = await Users.find();
        // console.log('users', users);
        // if(users.length > 0) {
        //     res.json({msg: 'valid user'});
        // } else {
        //     res.json({msg: 'invalid user'});
        // }

    } catch (error) {
        res.json({
            msg: error
        })
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