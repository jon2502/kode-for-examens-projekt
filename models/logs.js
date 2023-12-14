const mongoose = require("mongoose");

const schema = mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    state:{
        type:Number,
        required: true
    },
    timestamp:{
        type:Date,
        required: true
    },
    forslagid:{
        type:String,
        required: true
    }
})
//mongoose.model("name of collection the model is for", the schema to use for the model);
module.exports = mongoose.model("logs", schema);