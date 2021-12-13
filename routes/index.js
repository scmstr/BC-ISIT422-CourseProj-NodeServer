var express = require('express');
var router = express.Router();

// mongoose is a API wrapper overtop of mongodb, just like
// .ADO.Net is a wrapper over raw SQL server interface
const mongoose = require("mongoose");

/////////////
////schemas
/////////////
const GameSchema = require("../GameSchemaFile");
const NoteSchemaFile = require('../NoteSchemaFile');
const UserSchema = require("../UserSchemaFile");


// edited to include my non-admin, user level account and PW on mongo atlas
// and also to include the name of the mongo DB that the collection is in (TaskDB)
const dbURI =

  "mongodb+srv://bc422user:bc422proj@clusterbc422.exlyq.mongodb.net/GameReminderDB?retryWrites=true&w=majority";
//


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


function Game(pGameID, pDateTime, pGameName){
  this.gameID = pGameID;
  this.dateTime = pDateTime;
  this.gameName = pGameName;
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





// //GET home page. - don't think we need this for GamerHelperApp?
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





//get myGames by userID - WORKS
router.get('/getMyGames/:userID', function(req, res) {

  let found = false;

  
  UserSchema.find({}, (err, AllUsers) => { // "UserSchema" accesses the "users" collection because it's hardcoded to do so inside of the UserSchema.js file

    usersArray = AllUsers; // "AllUsers" must be the equivalent of the entire "users" collection?
    //                     // so that must mean that this line must download the entire collection into the "usersArray" var?                            
    //                     //     thus, usersArray probably follows the UserSchema object type Schema for every row/item. 


    for(var i=0; i < usersArray.length; i++)
    {
      if( usersArray[i].userID == req.params.userID) //this line's "req" is the data that is attatched to the endpoint when it's accessed (request)
      //                                             //the "params" looks in the endpoint for things that follow directly after a : colon
      //                                             //and then the "userID" refers to this endpoint's [/getMyGames/:userID] <----- where the userID is defined.
      {
        console.log(usersArray[i]);
        found = true;
        res.status(200).json(usersArray[i].myGames); // this line either sets or actually sends the response. 
        //                                           // it turns the "i" row's "myGames" (is actually a list in and of itself) into json, attatches that as (im assuming?) the body of the response.
        //                                           // this line also sets the response's status as a "200" which i think is "ok"
      }
    }


    if(found === false){
      res.status(500).send("no such user");
    }

  })
}); 



//check if this gameID is in this userID's myGames list - WORKS
router.get('/isGameInMyGames/:gameID/:userID', function(req, res) {

  let found = "no user found";

  UserSchema.find({}, (err,AllUsers) => {

    //get the users table/collection
    usersArray = []; //clear it
    usersArray = AllUsers; //fill it with fresh data

    //look through it for this userID
    for (let i = 0; i < usersArray.length; i++) { //go through every user...
      
      if (usersArray[i].userID == req.params.userID) { //finding a specific user...

        //once the desired user is found...

        for (let j = 0; j < usersArray[i].myGames.length; j++) { //go through the "i" user's "myGames" list... "j" is the game.
          
          if (usersArray[i].myGames[j][0] == Number(req.params.gameID)) { //finding a specific game on the "i" user...
            found = true;
            console.log("game is found");
            break; //STOP LOOKING!!!
            
          }
          else
          {
            console.log("game is NOT found");
            found = false;
          }
          //looking through all the games
        }
        //once the user is found...
      }
    }


    res.status(200).send(found);
  })
})




//lets make it so we can ADD a game to a user's game's list - will utilize 





//get a userID's username - WORKS
router.get('/getMyUsername/:userID', function(req, res) {

  let found = false;

  UserSchema.find({}, (err, AllUsers) => {

    usersArray = AllUsers;


    for(var i=0; i < usersArray.length; i++)
    {
      if( usersArray[i].userID == req.params.userID) 
      {
        found = true;
        res.status(200).json(usersArray[i].userName); 
      }
    }

    if(found === false){
      res.status(500).send("no such user");
    }

  })
}); 





//verify login
router.get('/verifyLogin/:username/:password', function(req, res){
  UserSchema.find({}, (err, AllUsers) =>{

  })
  var data = {
    "verifyLogin":{
      "2": req.params.username,
      "password1": req.params.password
    }
  };
  send.json(data);
});





//Update our notes
/* router.put('/notes/:gameID', function(req, res){
  var changedNote = req.body;

  NoteSchemaFile.findOneAndUpdate(
    {gameID: changedNote},
    changedNote,
    {new: false},
    (err, updatedNote) => {
      if(err){
        res.status(500).send(err);
      }
      res.status(200).json(updatedNote);
    }
  )

}); */







//delete a game from the user's list
router.delete('/deleteGame/:userID/:gameID', function (req, res){
GameSchema.deleteOne({id: req.params}, (err, note) =>{
  if(err){
    res.status(404).send(err);
  }
  res.status(200).json({message: "Game successfully deleted"});
});
});






//post a new note
router.post('/noteDetails/:note', function(req, res){
  var newNote = (req.body);
  insertNote = new NoteSchemaFile(newNote);
  console.log(insertNote);
  insertNote.save((err, note)=>{
    if(err){
      res.status(500).send(err);
    }
    else{
      res.status(201).json(note);
    }
  });
});





module.exports = router;




/////////////////
  //node stuff:

  //need:
    //create new user method - generates unique userID!
    //checkAuth method
    //get all notes for a user
    //add note
    //???update a note?
    //add a game to a user
    //remove a game from a user
    //update a game for a user
  //


  //sync game schema to:
    //  gameID, dateTime, gameName
  //

  //sync user schema to: 
    //UID, username, password, myGames
  //



