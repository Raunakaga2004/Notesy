import mongoose from 'mongoose'

const NotesSchema = new mongoose.Schema({
    user : {
        type : String,
        required : true
    },
    title: String,
    content: String
}, {timestamps : true})

const Notes = mongoose.model("Notes", NotesSchema);
export default Notes;