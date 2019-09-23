const express = require('express')
const jwt = require('jsonwebtoken')
const authRouter = express.Router()
const User = require('../models/user')


authRouter.post('/signup', (req, res)=>{
    User.findOne({username: req.body.username}, (err, existingUser) => {
        if (err) return res.status(500).send({success: false, err})
        console.log(req.body)
        if(existingUser !== null){
            return res.status(400).send({success: false, err: 'That usename already exists!'})
        }

        const newUser = new User(req.body)
        newUser.save((err, user)=> {
            if(err){
                console.log(err)
                return res.status(500).send({success:false, err: 'Something went wrong!'})
            }

            const token = jwt.sign(user.toObject(), process.env.SECRET)
            return res.status(201).send({success:true, user: user.withoutPassword(), token})
        })
    })
})

authRouter.post('/login', (req, res)=>{
    User.findOne({username: req.body.username.toLowerCase()}, (err, user)=>{
        if(err) return res.status(500).send({success:false, err:"Username or password are incorrect"})

        console.log('there')
        if(!user){
            return res.status(403).send({success: false, err:"Username or password are incorrect"})
        }

        user.checkPassword(req.body.password, (err, isMatch) => {
            if(err) return res.status(500).send({success: false, err:"Username or password are incorrect"})
            if(!isMatch) res.status(401).send({ success: false, err: "Username or Password are incorrect"})

            //passwords match. send token and info to client
            const token = jwt.sign(user.toObject(), process.env.SECRET)
            return res.send({success:true, user: user.withoutPassword(), token})
        })
    })
})

module.exports = authRouter


