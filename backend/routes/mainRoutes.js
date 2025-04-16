import express from "express"

//utilities
import {verifyToken} from "../middlewares/verifyToken.js"
import Notes from "../models/notes.js"

const router = express.Router();

router.get("/fetch", verifyToken, async(req, res)=>{
    try{
        const userId = req.user.userId;
        if(!userId) res.status(401).json({
            message: "No token provided. Sign In first!"
        })

        const notes = await Notes.find({user : userId});
        res.status(200).json(notes);
    } catch(e){
        res.status(500).json({
            message : "Error fetching notes"
        })
    }
})

router.get("/fetchNote", verifyToken, async(req, res)=>{
    try{
        const userId = req.user.userId;
        if(!userId) res.status(401).json({
            message : "No token provided. Sign In first!"
        })

        const id = req.query.id; // id of notes
        
        const note = await Notes.find({
            _id : id,
            user : userId
        });
        if(!note){
            return res.status(401).json({
                message : "Note doesn't Exist"
            })
        }

        res.status(200).json(note);
    } catch(e){
        res.status(500).json({
            message : "Error fetching note"
        })
    }
})

router.post("/create", verifyToken, async(req, res)=>{
    try{
        const userId = req.user.userId;
        if(!userId) res.status(401).json({
            message : "No token provided. Sign In first!"
        })

        const note = new Notes({
            user : userId,
            title : req.body.title,
            content :req.body.content
        });
        await note.save();

        res.status(200).json({
            message : "Note successfully created!"
        });
    } catch(e){
        res.status(500).json({
            message : "Error creating note"
        })
    }
})

router.delete("/delete", verifyToken, async(req, res)=>{
    try{
        const userId = req.user.userId;
        if(!userId) res.status(401).json({
            message : "No token provided. Sign In first!"
        })

        const id = req.query.id;
        if(!(await Notes.exists({
            _id : id,
            user : userId
        }))){
           return res.status(401).json({message : "Note doesn't Exist"});
        }

        const note = await Notes.findOneAndDelete({
            _id : id,
            user : userId
        });
        
        res.status(200).json({
            message : "Note deleted Successfully!"
        });
    } catch(e){
        res.status(500).json({
            message : "Error deleting note"
        })
    }
})

router.put("/update", verifyToken, async(req, res)=>{
    try{
        const userId = req.user.userId;
        if(!userId) res.status(401).json({
            message : "No token provided. Sign In first!"
        })

        const id = req.query.id;
        if(!(await Notes.exists({
            _id : id,
            user : userId
        }))){
            return res.status(401).json({message : "Note doesn't Exist"});
        }

        const {title, content} = req.body;
        const note = await Notes.findOneAndUpdate({
            _id : id,
            user : userId
        }, {
            title : title,
            content : content
        });

        res.status(200).json({
            message : "Successfully updated the note!"
        });
    } catch(e){
        res.status(500).json({
            message : "Error updating note"
        })
    }
})

export default router;