const mongoose = require("mongoose");

// here we define a schema for our document database
// mongo does not need this, but using mongoose and requiring a 
// schema will enforce consistency in all our documents (records)
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userID:{
        type: Number,
        required: true
    },
    userName:{
        type: String,
        required: true
    },
    myGames:{
        type:[Number],
        required: true
    }
},
{ collection: 'UserCollection' }
);

module.exports = mongoose.model("UserSchema", UserSchema);
