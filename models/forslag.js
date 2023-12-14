const mongoose = require("mongoose");

const schema = mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    kategori:{
        type:String,
        required: true
    },
    comments:{
        type:String,
        required: true
    },
    state :{
        type:Number,
        required: true,
        default: 0
    },
    like :{
        type:Number,
        required: true,
        default: 0
    },
    dislike :{
        type:Number,
        required: true,
        default: 0
    },
    Dateadded:{
        type:Date,
        required: true,
        default: Date.now()
    },
    updatedate:{
        type:Date,
        required: true,
        default: Date.now()
    }
})
//mongoose.model("name of collection the model is for", the schema to use for the model);
module.exports = mongoose.model("Forslag", schema);