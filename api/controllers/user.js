const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


module.exports.user_post_signup = (req, res, next) => {
    User.find({email: req.body.email}).then(user => {
        if(user.length >= 1){
            res.status(409).json({
                message: 'Mail exists'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    console.log(err);
                    return res.status(500).json({error: err});
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    console.log(user);
                    user.save().then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User created'
                        });
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({error: err});
                    });
                }
            });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

module.exports.user_post_login = (req, res, next) => {
    User.find({ email: req.body.email }).then(user => {
        if(user.length < 1){
            return res.status(404).json({
                message: 'Auth failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, same) => {
            if(err || !same){
                return res.status(404).json({
                    message: 'Auth failed'
                }); 
            }
            const token = jwt.sign(
                {
                    email: user[0].email,
                    userId: user[0]._id
                }, process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                }
            );
            res.status(200).json({
                message: 'Auth succesful',
                token: token
            });
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

module.exports.user_delete = (req, res, next) => {
    User.find({_id: req.params.userId}).then(user => {
        if(user.length == 0){
            res.status(409).json({
                message: "User doesn't exist"
            });
        } else {
            User.remove({_id: req.params.userId}).then(result => {
                res.status(200).json({
                    message: 'User deleted'
                });
            }).catch(err => {
                console.log(err);
                res.status(500).json({error: err});
            })
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    })
}