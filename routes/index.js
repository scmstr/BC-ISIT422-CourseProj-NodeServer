var express = require('express');
var router = express.Router();

// mongoose is a API wrapper overtop of mongodb, just like
// .ADO.Net is a wrapper over raw SQL server interface
const mongoose = require("mongoose");



const GameSchema = require("../GameSchemaFile");



const UserSchema = require("../UserSchemaFile");


// edited to include my non-admin, user level account and PW on mongo atlas
// and also to include the name of the mongo DB that the collection is in (TaskDB)
const dbURI =
 
  

  "mongodb+srv://bc422user:bc422proj@clusterbc422.exlyq.mongodb.net/GameReminderDB?retryWrites=true&w=majority";

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10
};

mongoose.connect(dbURI, options).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);


// for this version, we will keep data on server in an array
usersArray = [];
gamesArray = [];
notesArray = [];

function Game(pGameID, pDateTime){
  this.gameID = pGameID;
  this.dateTime = pDateTime;
}

function User(pUserID, pUsername, pGames) {
  this.userID = pUserID;
  this.username = pUsername;
  this.games = pGames;
}

function Note(pDateTime, pNoteContent, pUID, pGameID) {
  this.dateTime = pDateTime;
  this.noteContent = pNoteContent;
  this.UID = pUID;
  this.gameID = pGameID;
}

/* GET home page. */
// router.get('/', function(req, res) {
//   res.sendFile('respond with a resource');
 
// });


router.get('/games', function(req, res) {


    GameSchema.find({}, (err, AllGames) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      gamesArray = AllGames;
      console.log(gamesArray)
      res.status(200).json(gamesArray);
    })
});

router.get('/users', function(req, res) {


    UserSchema.find({}, (err, AllUsers) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      usersArray = AllUsers;
      console.log(usersArray)
      res.status(200).json(usersArray);
    })
});


//get myGames by UID
router.get('/myGames/:userID', function(req, res) {
  let found = false;
  UserSchema.find({}, (err, AllUsers) => {
    usersArray = AllUsers;
    for(var i=0; i < usersArray.length; i++)
    {
      if( usersArray[i].userID == req.params.userID)
      {
        console.log(usersArray[i]);
        found = true;
        res.status(200).json(usersArray[i].myGames);
      }
    }
    if(found === false){
      res.status(500).send("no such user");
    }
  })
}); 


/////////////////
//node stuff:

//need:
  //create new user method - generates unique UID!
  //checkAuth method
  //get all notes for a user
  //add note
  //???update a note?
  //add a game to a user
  //remove a game from a user
  //update a game for a user


//sync game schema to:
  //  gameID, dateTime, gameName

//sync user schema to: 
  //UID, username, password, myGames






module.exports = router;
