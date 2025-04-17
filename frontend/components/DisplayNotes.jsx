import { useState } from "react";

export default function DisplayNotes(note){
    const [editWindow, setEditWindow] = useState(false); // note window for specific note to edit or view that note fully

    //to edit note
    async function editNote(id){
        setEditWindow(true);
    }

    async function deleteNote(id){
        await axios.delete("http://localhost:5000/api/main/delete?id=" + id, {
            withCredentials : true
        }).then(()=>{
            setEditWindow(false);
            notifyDefault("Note Deleted Successfully!");
        })
    }

    return <div key={note._id} onClick={()=>editNote(note._id)}>
        <br/>
        {note.title}<br/>
        {note.content}
        {/* not show full content at last use ... */}
        {/* by using text-overflow in tailwind */}

        {/* edit window for this note */}
        {editWindow ? <div>
            <input value={note.title}></input> {/* check how to edit while showing content and also find alternative to input box*/}
            {/* using key for editing state and null for off */}
            <input value={note.content}></input>

            {/* to delete Note */}
            <button onClick={()=>deleteNote(note._id)}>-</button>
            </div>:<></>
        }
    </div>
}