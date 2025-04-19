import { useState } from "react";

export default function DisplayNotes(note){
    

    return <div key={note._id}>
        <br/>
        {note.title}<br/>
        {note.content}
        {/* not show full content at last use ... */}
        {/* by using text-overflow in tailwind */}
    </div>
}