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
   "mongodb+srv://user_Khalid:<password>@khalidcluster.9zcle.mongodb.net/Game?retryWrites=true&w=majority";
   //"mongodb+srv://user_Khalid:<password>@khalidcluster.9zcle.mongodb.net/User?retryWrites=true&w=majority";

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
userArray = [];
gameArray = [];

function Game(pGameID, pDateTime){
  this.gameID = pGameID;
  this.dateTime = pDateTime;
}

function User(pUID, pUsername, pGames) {
  this.UID = pUID;
  this.username = pUsername;
  this.games = pGames;
}

//prepop for userArray
/* userArray.push( new User (2, 'Neo', [new Game(3, "aDateTime1"), new Game(4, "aDateTime2"), new Game(5, "aDateTime3")]  ) );
userArray.push( new User (4, 'MoRpHeUs', new Game(6, "aDateTime4")) );
userArray.push( new User (6, 'A.Smith', null) );
 */

router.get('/games', function(req, res) {
  // res.status(200).json(gameArray);
  //   console.log(gameArray);
    GameSchema.find({}, (err, AllGames) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      gameArray = AllGames;
      console.log(gameArray)
      res.status(200).json(gameArray);
    })
});

router.get('/users', function(req, res) {
  // res.status(200).json(userArray);
  //   console.log(userArray);
    UserSchema.find({}, (err, AllUsers) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      userArray = AllUsers;
      console.log(userArray)
      res.status(200).json(userArray);
    })
});


//get myGames by UID
router.get('/myGames/:UID', function(req, res) {
  let found = false;
    for(var i=0; i < userArray.length; i++)
    {
      if( userArray[i].UID == req.params.UID)
      {
        console.log(userArray[i]);
        found = true
        res.status(200).json(userArray[i].games);
      }
    }
    if(found === false){
      res.status(500).send("no such user");
      }

}); 





// // pre-populate with some data
// heroArray.push( new Hero (11, 'Dr Nice') );
// heroArray.push( new Hero (12, 'Narco') );
// heroArray.push( new Hero (13, 'Bombasto') );
// heroArray.push( new Hero (14, 'Celeritas') );
// heroArray.push( new Hero (15, 'Magneta') );
// heroArray.push( new Hero (16, 'RubberMan') );
// heroArray.push( new Hero (17, 'Dynama') );
// heroArray.push( new Hero (18, 'Dr Kurt') );
// heroArray.push( new Hero (19, 'Magma') );
// heroArray.push( new Hero (20, 'Tornado') );


// router.get('/heroes', function(req, res) {
//   res.status(200).json(heroArray);
//     console.log(heroArray);
// });

// router.get('/heroes/:id', function(req, res) {
//   let found = false;
//     for(var i=0; i < heroArray.length; i++)
//     {
//       if( heroArray[i].id == req.params.id)
//       {
//         console.log(heroArray[i]);
//         found = true
//         res.status(200).json(heroArray[i]);
//       }
//     }
//     if(found === false){
//       res.status(500).send("no such hero");
//       }

// });



// router.put('/heroes/:id', function(req, res) {
//     var changedHero = req.body; 
//    for(var i=0; i < heroArray.length; i++)
//    {
//      if( heroArray[i].id == req.params.id)
//      {
//        heroArray[i].name = changedHero.name;
//        console.log(heroArray[i]);
//        found = true
//        res.status(200).json(heroArray[i]);
//      }
//    }
//    if(found === false){
//      res.status(500).send(err);
//    }
// });



// // delete is used to delete existing object
// router.delete('/heroes/:id', function(req, res) {
//   for(var i=0; i < heroArray.length; i++)
//   {
//     if( heroArray[i].id == req.params.id)
//     {
//       heroArray.splice(i,1);
//       found = true
//       res.status(200).json('deleted hero');
//     }
//   }
//   if(found === false){
//     res.status(500).send(err);
//   }
// });



// router.post("/heroes", function(req, res) {

//    // sort by id (need to create a new, unique id)
//    heroArray.sort(function(a, b) {
//     return (a.id) - (b.id);
//    });
//    var newID = (heroArray[heroArray.length-1].id) +1;
//    var newHero = new Hero(newID, req.body.name);  // need to fix !!!!!
//    heroArray.push(newHero);
//    res.status(200).json(newHero);  // returns the new hero which the observable 
//   // uses to update the client side array so the display looks correct.
// });


// // router.post("/heroes", function(req, res) {

// //   // sort by id (need to create a new, unique id)
// //   heroArray.sort(function(a, b) {
// //    return (a.id) - (b.id);
// //   });
// //  var newID = (heroArray[heroArray.length-1].id) +1;

// //  var newHero = req.body;
// //  newHero.id = newID;
// //  heroArray.push(newHero);
// //  res.status(200).json(newHero);  // returns the new hero which the observable 
// //  // uses to update the client side array so the display looks correct.
// // });

module.exports = router;
