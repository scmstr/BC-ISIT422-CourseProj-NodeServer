const mongoose = require("mongoose");

// here we define a schema for our document database
// mongo does not need this, but using mongoose and requiring a 
// schema will enforce consistency in all our documents (records)
const Schema = mongoose.Schema;

const GameSchema = new Schema({
    userID:{
        type: Number,
        required: true
    },
    gameID:{
        type: Number,
        required: true
    },
    noteContent:{
        type: String,
        required: true
    },
    noteDate:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Notes", GameSchema);