const mongoose = require("mongoose");

const schema = mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    color:{
        type:String,
        required: true
    },
    likesdislikes:{
        type:String,
        required: true
    }
})

module.exports = mongoose.model("options", schema);