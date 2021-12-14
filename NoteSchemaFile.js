const mongoose = require("mongoose");
const { schema } = require("./GameSchemaFile");

// here we define a schema for our document database
// mongo does not need this, but using mongoose and requiring a 
// schema will enforce consistency in all our documents (records)
const Schema = mongoose.Schema;

const NoteSchema = new Schema(
    {
        noteID:{
            type: Number,
            required: true
        },
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
    },
    { 
        collection: 'notes' 
    }
);
module.exports = mongoose.model("NoteSchema", NoteSchema);