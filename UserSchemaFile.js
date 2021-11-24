
const mongoose = require("mongoose");

// here we define a schema for our document database
// mongo does not need this, but using mongoose and requiring a 
// schema will enforce consistency in all our documents (records)
const Schema = mongoose.Schema;


// function Game(pGameID, pDateTime){            ////dont think we need the Game class constructor, but keep it here for now for easy access
//     this.gameID = pGameID;
//     this.dateTime = pDateTime;
// }


const UserSchema = new Schema({
    userID:{
        type: Number,
        required: true
    },
    userName:{
        type: String,
        required: true
    },
    myGames:
        [`{"gameID": Number},{"dateTime": String}`]  //need specific property names.   Trying literals with ` since apparently this makes them key:value pairs??? maybe we can try to do that in mongo later.

},
{ collection: 'users' }
);



module.exports = mongoose.model("UserSchema", UserSchema);


