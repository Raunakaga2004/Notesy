import { useNavigate } from "react-router-dom"
import { useState, useEffect, use } from "react"
import axios from "axios"

import { notifyDefault, notifyError, notifySuccess } from "../utils/toast"
import { btn } from "../styles_ui/btn"
import DisplayNotes from "./DisplayNotes"

export default function Home(){
    const [user, setUser] = useState({}) //user details except password will be stored

    const [noteWindow, setNoteWindow] = useState(false); // note window to edit or add note // a form to submit

    const [editWindow, setEditWindow] = useState(null); // note window for specific note to edit or view that note fully

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
                notifyError("Sign In/Sign Up to use Notesy")
                setNoteWindow(false);
                console.log(e);
            })

        setTitle("");
        setContent("");
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
    }, [noteWindow, editWindow])

    async function onEdit(e){
        e.preventDefault();

        await axios.put("http://localhost:5000/api/main/update?id=" + editWindow._id,{
            title : title == "" ? editWindow.title : title,
            content : content == "" ? editWindow.content : content
        }, {
            withCredentials : true
        }).then(()=>{
            notifySuccess("Editted Successfully!")
            setTitle("");
            setContent("");
            setEditWindow(null); 
        }).catch((e)=>{
            console.log(e)
        })
    }

    async function onDelete(e){
        e.preventDefault();

        await axios.delete("http://localhost:5000/api/main/delete?id=" + editWindow._id, {
            withCredentials : true
        }).then((e)=>{
            notifySuccess("Deleted Successfully!")
            setEditWindow(null);
        }).catch((e)=>{
            console.log(e);
        })
    }

    const [showInfo, SetshowInfo] = useState(false);

    async function onInfo(e){
        e.preventDefault();

        SetshowInfo(true);
    }

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
                    <textarea type="text" placeholder="Content" onChange={(e)=>setContent(e.target.value)}></textarea>
                    <button type="submit">Add Note</button>
                </form>
            </div> : <></>
            // use textarea for 'content' instead of input box
        }

        {/* Display all notes */}
        <div>
            {notes.map((note)=>{

                async function noteClick(note){
                    setEditWindow(note);
                }

                return <div key={note._id} onClick={()=>noteClick(note)}>
                    <br/>
                    {note.title}<br/>
                    {note.content}
                    {/* not show full content at last use ... */}
                    {/* by using text-overflow in tailwind */}
                </div>
            })}

            {editWindow == null ? <></> : <div>
                <input defaultValue={editWindow.title} onChange={(e)=>setTitle(e.target.value)}></input>

                {/* Info Box */}
                {showInfo ? <div onClick={()=>SetshowInfo(false)}>
                    <p>Information</p>
                    <p>Created at: {editWindow.createdAt}</p>
                    <p>Updated at: {editWindow.updatedAt}</p>
                </div> : <></>}

                <textarea defaultValue={editWindow.content} onChange={(e)=>setContent(e.target.value)}></textarea>
                <button onClick={(e)=>onInfo(e)}>i</button>
                <button onClick={(e)=>onDelete(e)}>-</button>
                <button onClick={(e)=>onEdit(e)}>save</button>
            </div>}
        </div>
    </div>
}