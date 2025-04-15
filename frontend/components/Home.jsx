import { useNavigate } from "react-router-dom"
import { useState, useEffect, use } from "react"
import axios from "axios"

import { notifyDefault } from "../utils/toast"
import { btn } from "../styles_ui/btn"

export default function Home(){
    const [user, setUser] = useState({}) //user details except password will be stored

    const [noteWindow, setNoteWindow] = useState(false); // note window to edit or add note // a form to submit

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [notes, setNotes] = useState([]);

    useEffect(()=>{
        async function fetch(){
            await axios.get("http://localhost:5000/api/auth/profile",{withCredentials : true}) //"withCredentials" allows us to send or receive cookies
            .then((res)=>{ //res is the object which stores the response from above get request
                setUser(res.data); 
            }).catch(()=>{
                console.log("Couldn't fetch user details!");
            })
        }
        
        fetch();
    }, [])

    const navigate = useNavigate();

    const handleSignOut = async ()=>{
        await axios.post("http://localhost:5000/api/auth/signout", {}, {withCredentials : true}) //"withCredentials" allows us to send or receive cookies
            .then(()=>{
                
                notifyDefault("Signed Out Successfully!");

                console.log("Signed Out Successfully!")
                setUser({}) // as the user signs out reset user variable to empty object and reload this component
            }).catch((e)=>{
                console.log(e);
            })
    }
    
    async function addNote(e){
        e.preventDefault();

        await axios.post("http://localhost:5000/api/main/create", {
            title : title,
            content : content
        }, {withCredentials : true})
            .then(()=>{
                setNoteWindow(false);
                notifyDefault("Note Added!");
            }).catch((e)=>{
                console.log(e);
            })
    }

    // to get all the notes from database 
    useEffect(()=>{
        async function fetch(){
            await axios.get("http://localhost:5000/api/main/fetch",{
                withCredentials : true
            }).then((res)=>{
                setNotes(res.data);
                console.log("Notes fetched!");
            }).catch((e)=>{
                console.log(e);
            })
        }
        fetch();
    }, [])

    return <div className="flex flex-col justify-between h-screen w-screeen">
        {/* Header */}
        <div className="flex flex-row justify-between items-center bg-[#6c757d] h-20 pl-4 pr-4">
            <div className="font-semibold text-lg">Notesy</div>
            {Object.keys(user).length == 0 /*If object is Empty*/? <div className="flex flex-row gap-4">
                <button onClick={()=>navigate("/signin")} className={btn}>Sign In</button>
                <button onClick={()=>navigate("/signup")} className={btn}>Sign Up</button>
            </div> : 
            <div className="">
                <button onClick ={()=>handleSignOut()} className={btn}>Sign Out</button>
            </div>
            }
        </div>
        
        <div>
            {/* to add note =>  open the note window*/}
            <button onClick={()=>setNoteWindow(true)}>+</button>
        </div>
        {noteWindow ? <div>
                <form onSubmit={(e) => addNote(e)}>
                    <input type="text" placeholder="Title" onChange={(e)=>setTitle(e.target.value)}></input>
                    <input type="text" placeholder="Content" onChange={(e)=>setContent(e.target.value)}></input>
                    <button type="submit">Add Note</button>
                </form>
            </div> : <></>
        }

        {/* Display all notes */}
        <div>
            {notes.map((note)=>{
                //to edit note
                async function editNote(id){
                    setEditWindow(true);
                }

                return <div key={note._id} onClick={()=>editNote(note._id)}>
                    {note.title}<br/><br/>
                    {note.content}
                </div>
            })}
        </div>
    </div>
}