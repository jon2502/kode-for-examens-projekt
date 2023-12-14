const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')

const userschema = mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    status:{
        type:String,
        required: true,
        default: 'notactive'
    },
    clerance:{
        type:String,
        required: true,
        default: 'user'
    },
    creationdate:{
        type:Date,
        required: true,
        default: Date.now()
    }
})

// taget fra (kunuutkaali and jon2502.c 2023)
userschema.pre('save', async function(next){
    try {
        const hashedpassword = await bcrypt.hash(this.password, 10)
        this.password = hashedpassword;
        next()
    } catch (error) {
        next(error)
    }
})

//mongoose.model("name of collection the model is for", the schema to use for the model);
module.exports = mongoose.model("User", userschema);