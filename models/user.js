const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: false,
        default: 0
    },
    files:{
        type:Array,
        required:false,
        default:[]
    }
})

//encrypts user password so it is more secure
userSchema.pre("save", function(next){
    const user = this
    if(!user.isModified('password')) return next()
    bcrypt.hash(user.password, 10, function(err, hash){
        if(err)return next(err)
        user.password = hash
        next()
    })
})

//checks user password against decrypted password when they login
userSchema.methods.checkPassword = function(passwordAttempt, callback){
    const user = this
    bcrypt.compare(passwordAttempt, user.password, function(err, isMatch){
        if(err) return callback(err)
        callback(null, isMatch)
    })
}

// remove password before sending to client
userSchema.methods.withoutPassword = function(){
    const user = this.toObject()
    delete user.password
    return user
}


module.exports = mongoose.model('user', userSchema)

