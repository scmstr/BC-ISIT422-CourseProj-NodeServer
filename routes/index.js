
//////////any route will start with these two//////////
var express = require('express');
var router = express.Router();

// for this version, we will keep data on server in an array
// heroArray = [];
userArray = [];

// //constructor
// function Hero(pId, pName) {
//   this.id= pId;
//   this.name = pName;
// }

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
userArray.push( new User (2, 'Neo', [new Game(3, "aDateTime1"), new Game(4, "aDateTime2"), new Game(5, "aDateTime3")]  ) );
userArray.push( new User (4, 'MoRpHeUs', new Game(6, "aDateTime4")) );
userArray.push( new User (6, 'A.Smith', null) );


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
