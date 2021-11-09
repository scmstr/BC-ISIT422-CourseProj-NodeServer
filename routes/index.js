var express = require('express');
var router = express.Router();

// for this version, we will keep data on server in an array
gameArray = [];

//constructor
function Game(pId, pName) {
  this.id= pId;
  this.name = pName;
  }

  // pre-populate with some data
gameArray.push( new Game (1, 'Game1') );
gameArray.push( new Game (2, 'Game2') );
gameArray.push( new Game (3, 'Game3') );
gameArray.push( new Game (4, 'Game4') );
gameArray.push( new Game (5, 'Game5') );



router.get('/games', function(req, res) {
  res.status(200).json(gameArray);
    console.log(gameArray);
});

router.get('/games/:id', function(req, res) {
  let found = false;
    for(var i=0; i < gameArray.length; i++)
    {
      if( gameArray[i].id == req.params.id)
      {
        console.log(gameArray[i]);
        found = true
        res.status(200).json(gameArray[i]);
      }
    }
    if(found === false){
      res.status(500).send("no such hero");
      }

  });



  router.put('/games/:id', function(req, res) {
    var changedGame = req.body; 
   for(var i=0; i < gameArray.length; i++)
   {
     if( gameArray[i].id == req.params.id)
     {
       gameArray[i].name = changedGame.name;
       console.log(gameArray[i]);
       found = true
       res.status(200).json(gameArray[i]);
     }
   }
   if(found === false){
     res.status(500).send(err);
   }
 });



// delete is used to delete existing object
router.delete('/games/:id', function(req, res) {
  for(var i=0; i < gameArray.length; i++)
  {
    if( gameArray[i].id == req.params.id)
    {
      gameArray.splice(i,1);
      found = true
      res.status(200).json('deleted hero');
    }
  }
  if(found === false){
    res.status(500).send(err);
  }
});



router.post("/games", function(req, res) {

   // sort by id (need to create a new, unique id)
   gameArray.sort(function(a, b) {
    return (a.id) - (b.id);
   });
   var newID = (gameArray[gameArray.length-1].id) +1;
   var newHero = new Game(newID, req.body.name);  // need to fix !!!!!
   gameArray.push(newHero);
   res.status(200).json(newHero);  // returns the new hero which the observable 
  // uses to update the client side array so the display looks correct.
});


// router.post("/games", function(req, res) {

//   // sort by id (need to create a new, unique id)
//   gameArray.sort(function(a, b) {
//    return (a.id) - (b.id);
//   });
//  var newID = (gameArray[gameArray.length-1].id) +1;

//  var newHero = req.body;
//  newHero.id = newID;
//  gameArray.push(newHero);
//  res.status(200).json(newHero);  // returns the new hero which the observable 
//  // uses to update the client side array so the display looks correct.
// });

module.exports = router;
