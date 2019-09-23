var express = require('express')
var allRouter = express.Router()
const User = require('../models/user')



allRouter.route('/')
    .get((req, res)=>{
        //returns all
        User.find({},(err,users)=>{
            if(err) return res.status(500).send(err)
            return res.status(200).send(users.map((a,i,arr)=>{
                return {username: a.username, bank: a.bank}
            }))
        })
    })


module.exports = allRouter
