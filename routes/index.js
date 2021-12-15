var express = require('express');
var router = express.Router();

// mongoose is a API wrapper overtop of mongodb, just like
// .ADO.Net is a wrapper over raw SQL server interface
const mongoose = require("mongoose");

/////////////
////schemas
/////////////
const GameSchema = require("../GameSchemaFile"); //i dont think we're using the gameschema, since we dont need to access the games collection (they're on the users as an array)
const NoteSchema = require('../NoteSchemaFile');
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
  this.gameName = pGameName;
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




// //GET home page. - don't think we need this for GamerHelperApp?
// router.get('/', function(req, res) {
//   res.sendFile('respond with a resource');
 
// });





// router.get('/games', function(req, res) {


//     GameSchema.find({}, (err, AllGames) => {
//       if (err) {
//         console.log(err);
//         res.status(500).send(err);
//       }
//       gamesArray = AllGames;
//       console.log(gamesArray)
//       res.status(200).json(gamesArray);
//     })
// });




// router.get('/users', function(req, res) {


//     UserSchema.find({}, (err, AllUsers) => {
//       if (err) {
//         console.log(err);
//         res.status(500).send(err);
//       }
//       usersArray = AllUsers;
//       console.log(usersArray)
//       res.status(200).json(usersArray);
//     })
// });





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
      res.status(200).send({message: "no such user"});
    }

    console.log("entire usersArray: ");
    console.log(usersArray);

  })
}); 


//check if this gameID is in this userID's myGames list - WORKS
router.get('/isGameInMyGames/:gameID/:userID', function(req, res) {

  let found = true;

  UserSchema.find({}, (err,AllUsers) => {

    //get the users table/collection
    usersArray = []; //clear it
    usersArray = AllUsers; //fill it with fresh data
    found = null;
    selectedUser = -1;

    //look through it for this userID
    for (let i = 0; i < usersArray.length; i++) { //go through every user...
      
      if (usersArray[i].userID == req.params.userID) { //finding a specific user...

        //once the desired user is found...
        console.log("user found!");
        selectedUser = i;

        if (usersArray[i].myGames.length > 0) {
          for (let j = 0; j < usersArray[i].myGames.length; j++) { //go through the "i" user's "myGames" list... "j" is the game.
          
            if (usersArray[i].myGames[j][0] == Number(req.params.gameID)) { //finding a specific game on the "i" user...
              found = true;
              console.log("game is found");
              break; //STOP LOOKING!!!
              
            }
            else
            {
              console.log("a different game was found...");
              found = false;
            }
            //looking through all the games
          }
        }


        

        if (found == null && selectedUser != -1) { //found user, but no games!
          console.log("user has no games!");
          found = false;
        }

        //once the user is found...
      }
    }


    

    console.log("isGameInMyGames finished running-------------------");
    res.status(200).send(found);
  })
})


//ADD GAME to a user's myGames list - NEEDS TIMESTAMP ON GAME CONSTRUCTOR - WORKS
router.get('/addGame/:userID/:gameID/:gameName', function(req, res) {
  console.log("addGame endpoint accessed.");
  

  UserSchema.find({}, (err, AllUsers) => {

    usersArray = AllUsers;
    let found = false;     //if true, gameID already exists
    let selectedUser = -1; //if i not -1, user is found
    let message = "";
    let mongoUserID;


    for (let i = 0; i < usersArray.length; i++) { //go through every user...
      
      if (usersArray[i].userID == req.params.userID) { //finding a specific user...
        selectedUser = i;
        mongoUserID = usersArray[i]._id;

        //once the desired user is found...

        for (let j = 0; j < usersArray[i].myGames.length; j++) { //go through the "i" user's "myGames" list... "j" is the game.
          
          if (usersArray[i].myGames[j][0] == Number(req.params.gameID)) { //finding a specific game on the "i" user...
            found = true;
            break; //STOP LOOKING!!!
            
          }
          else
          {
            found = false;
          }
          //looking through all the games
        }

        //user is FOUND, search for game is COMPLETE ...
      }

    }

    console.log("looked at users and games, proceeding to try to push a new game onto mongo");
    console.log("game trying to push up is: ");
    console.log(req.params.gameName);



    //////////////////////////////////////////////////////
    //// [new code] to decide to save the game or not ////
    //////////////////////////////////////////////////////
    if ((found == false) && (selectedUser != -1)) {
      //if gameID doesnt exist in a found user's list....
      message = "Success!"; 
      


      /////////////////////////////////////////////////////////////
      //// [new code] updates the user's myGames list !!!!!!!! ////
      /////////////////////////////////////////////////////////////
      usersArray[selectedUser].myGames.push(new Array((Number(req.params.gameID)), CreateTimestamp(), req.params.gameName));

      UserSchema.findByIdAndUpdate(mongoUserID, { myGames: usersArray[selectedUser].myGames },
        function (err, docs) {
          if (err){
            console.log(err)
          }
          else{
            console.log("Updated User : ", docs);
          }
        }
      );

    }
    else if ((found == true) && (selectedUser != -1)) {
      //if the game already exists in a found user's list...
      message = "Error, game already exists.";
    }
    else {
      //if no user is found...
      message = "User not found.";
    }

    console.log("addGame finished running-------------------------------");
    res.status(200).send(message);
    
  })
}); 


///DELETE GAME - WORKS
router.get('/deleteGame/:userID/:gameID', function(req, res) {
  console.log("deleteGame endpoint accessed.");
  console.log("game trying to delete is: " + req.params.gameID);
  

  UserSchema.find({}, (err, AllUsers) => {

    usersArray = AllUsers;
    let found = false;     //if true, gameID already exists
    let selectedUser = -1; //if i not -1, user is found
    let selectedGame = -1;
    let message = "";
    let mongoUserID = -1;


    //////////////////////////////////////////////
    ///////////////this chunk is//////////////////
    ////stolen and edited from isGameInMyGames////
    //////////////////////////////////////////////
    for (let i = 0; i < usersArray.length; i++) { //go through every user...
      
      if (usersArray[i].userID == req.params.userID) { //finding a specific user...
        selectedUser = i;
        mongoUserID = usersArray[i]._id;

        //once the desired user is found...

        for (let j = 0; j < usersArray[i].myGames.length; j++) { //go through the "i" user's "myGames" list... "j" is the game.
          
          if (usersArray[i].myGames[j][0] == Number(req.params.gameID)) { //finding a specific game on the "i" user...
            found = true;
            selectedGame = j; //index of where found game is
            break; //STOP LOOKING!!!
          }
          else
          {
            found = false;
          }
          //looking through all the games
        }

        //user is FOUND, search for game is COMPLETE ...
      }

    }



    //////////////////////////////////////////////////////
    //// [new code] to decide to save the game or not ////
    //////////////////////////////////////////////////////
    if ((found == false) && (selectedUser != -1)) {
      //if gameID doesnt exist in a found user's list....
      message = "game not found..."; 


      /////////////////////////////////////////////////////////////
      //// [new code] updates the user's myGames list !!!!!!!! ////
      /////////////////////////////////////////////////////////////
      

    }
    else if ((found == true) && (selectedUser != -1)) {
      //if the game already exists in a found user's list...
      usersArray[selectedUser].myGames.splice(selectedGame,1);
      usersArray.myGames = [];
      UserSchema.findByIdAndUpdate(mongoUserID, { myGames: usersArray[selectedUser].myGames },
        function (err, docs) {
          if (err){
            console.log(err)
            message = err;
          }
          else{
            console.log("Updated User : ", docs)
            message = "game found and should be deleted";
          }
        }
      );

    }
    else {
      //if no user is found...
      message = "User not found.";
    }


    
    console.log("deleteGame finished running-------------------------------");
    res.status(200).send(message);

    
  })
}); 


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


//verifyLogin/Log In - WORKS
router.get('/verifyLogin/:username/:password', function(req, res){
  UserSchema.find({}, (err, AllUsers) =>{

    console.log("verifyLogin ran.");
    let foundUserID = -1;
    let validAuth = false;

    AllUsers.forEach(user => {
      if (user.userName == req.params.username) {
        if (user.password == req.params.password) {
          //auth is valid
          console.log("valid user, valid password");
          validAuth = true;
          foundUserID = user.userID;
        }
      }
    });

    res.status(200).json({
      isValid: validAuth,
      userID: foundUserID
    });
  })
});


//create new user - WORKS
router.get('/createNewUser/:userName/:password', function (req, res) {
  UserSchema.find({}, (err, AllUsers) => {
    usersArray = AllUsers;
    let found = false;
    let message = "no message";

    usersArray.forEach(element => {
      if (element.userName == req.params.userName) {
        found = true;
        console.log("mongo.username AND params.username are: ");
        console.log(element.userName);
        console.log(req.params.userName);
      }
    });


    if (found == true) {                    //USER ALREADY EXISTS
      message = "Error: User already exists...";
      console.log("user " + req.params.userName + " already exists");
      res.status(200).send({message: message});
    }
    else if (found == false) {              //CREATING THIS NEW USER!!!!
      message = "username is available"
       
      //create new user here and add it onto the local array and - SAVE IT!!
      UserSchema.create({
        userID: CreateUniqueUserID(usersArray),
        userName: req.params.userName,
        password: req.params.password,
        myGames: [ ]
      }, function (err, small) {
        // saved!
        if (err != null) {
          let message2 = "Error upon trying to make new user. Contact site admin.";
          console.log("got error upon trying to make new user");
          res.status(200).json({message: message2});
        }
        else
        {
          let message3 = "Successfully created new user!";
          console.log("err was null, should have created " + req.params.userName + " user...");
          res.status(200).json({message: message3});
        }

      });

    }
  })
});





//create note - WORKS
router.get('/createNote/:gameID/:userID/:noteContent', function (req, res) {
  let tempNotesArray;
  NoteSchema.find({}, (err, AllNotes) => {
    tempNotesArray = AllNotes;


    NoteSchema.create({
      noteID: GenerateUniqueNoteID(tempNotesArray),
      userID: req.params.userID,
      gameID: req.params.gameID,
      noteContent: req.params.noteContent,
      noteDate: CreateTimestamp(),
    }, function(err,result) {
      // saved!
      if (err != null) {
      let message2 = "Error upon trying to make new note. Contact site admin.";
      console.log("got error upon trying to make new note");
      res.status(200).json({message: message2});
      }
      else
      {
        let message3 = "Successfully created new note!";
        console.log("err was null, should have created " + req.params.userName + " user...");
        res.status(200).json({message: message3});
      }
    })

  })

});



//get ALL notes for THIS GAME and USER - WORKS
router.get('/getNotesForThisGameAndUser/:gameID/:userID', function(req, res) {
  console.log("notesForThisGameAndUser accessed");
  let outputArray = [];

  NoteSchema.find({}, (err, AllNotes) => {

    tempNotesArray = AllNotes;
    console.log("userSchema.find ran.");

    for(var i=0; i < tempNotesArray.length; i++)
    {
      console.log("searching for relevant notes... for inputUserID: [" + req.params.userID + "] and inputGameID:[" + req.params.gameID + "].");
      if( (tempNotesArray[i].userID == req.params.userID)  && (tempNotesArray[i].gameID == req.params.gameID)) 
      {
        outputArray.push(tempNotesArray[i]);
        console.log("found a note! Added to output!");
      }
    }

    console.log("ending notesForThisGameAndUser...");
    res.status(200).send(outputArray);
 

  })
}); 


//Get the last 3 notes for a user - WORKS
router.get('/getLastThreeNotesForUser/:userID', function(req,res) {

  console.log("getLastThreeNotesForUser endpoint accessed.")
  let tempNotesArray = [];

  NoteSchema.find({}, (err, AllNotes) => {

    allNotes = AllNotes;

    //req.params.userID


    allNotes.forEach(aNote => {
      if (aNote.userID == req.params.userID) {
        tempNotesArray.push(aNote);
      }
    });

    tempNotesArray.sort(NoteSorter);

    tempNotesArray.splice(0,2);
    console.log("tempNotesArray content: ");
    console.log(tempNotesArray);

    console.log("ending getLastThreeNotesForUser...");
    res.status(200).send(tempNotesArray);


  })


})






module.exports = router;











//generate timstamp - WORKS
function CreateTimestamp() {
  let output = Date;
  let timestamp = Date.now();
  console.log("timestamp output: ");
  console.log(timestamp);
  return timestamp;
}



//generate unique userID - WORKS
function CreateUniqueUserID(pExistingUsersArray) {

  let found = true;
  let testingID = -1;

  while (found == true) {
    found = false;
    testingID = Math.floor(Math.random() * 10000000);
    
    for (let i = 0; i < pExistingUsersArray.length; i++) {
      if (testingID == pExistingUsersArray[i].userID) {
        found = true;
      }
    }
  }

  console.log("looked for a unique userID between 1 and 10,000,000 and found this: ");
  console.log(testingID);

  return testingID;
}


function GenerateUniqueNoteID(pExistingNotesArray) {

  let found = true;
  let testingID = -1;

  while (found == true) {
    found = false;
    testingID = Math.floor(Math.random() * 10000000);

    for (let i = 0; i < pExistingNotesArray.length; i++) {
      if (testingID == pExistingNotesArray[i].noteID) {
        found = true;
      }
    }
  }

  console.log("looked for a unique userID between 1 and 10,000,000 and found this: ");
  console.log(testingID);

  return testingID;
}




//to sort notes chronologically - WORKS
function NoteSorter( a, b ) {
  if ( a.noteDate < b.noteDate ){
    return 1;
  }
  if ( a.noteDate > b.noteDate ){
    return -1;
  }
  return 0;
}




