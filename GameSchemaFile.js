const mongoose = require("mongoose");

// here we define a schema for our document database
// mongo does not need this, but using mongoose and requiring a 
// schema will enforce consistency in all our documents (records)
const Schema = mongoose.Schema;

const GameSchema = new Schema({


    gameID:{
        type: Number,
        required: true
    },
    gameName:{
        type: String,
        required: true
    },
    coverArt:{
        type: String,
        required: true
    },
    releaseDate:{
        type: String,
        required: true
    },
    communityRating:{
        type: String,
        required: true
    },
    summary:{
        type: String,
        required: true
    }
},
{ collection: 'games' }
);

module.exports = mongoose.model("GameSchema", GameSchema);
