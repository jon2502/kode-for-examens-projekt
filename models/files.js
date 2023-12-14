const mongoose = require("mongoose");

const schema = mongoose.Schema({
    link:{
        type:String,
        required: true
    },
    public_id:{
        type:String,
        required: true
    },
    extension:{
        type:String,
        required: true
    },
    forslagid:{
        type:String,
        required: true
    },
    uploader:{
        type:String,
        required: true
    }
})
//mongoose.model("name of collection the model is for", the schema to use for the model);
module.exports = mongoose.model("file", schema);