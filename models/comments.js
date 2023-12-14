const mongoose = require("mongoose");

const schema = mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    content:{
        type:String,
        required: true
    },
    forslagid:{
        type:String,
        required: true
    },
    timestamp:{
        type:Date,
        required: true
    }
})
//mongoose.model("name of collection the model is for", the schema to use for the model);
module.exports = mongoose.model("comment", schema);