import { useNavigate } from "react-router-dom"
import { useState, useEffect, use } from "react"
import axios from "axios"

import { notifyDefault, notifyError, notifySuccess } from "../utils/toast"
import { btn, btn2 } from "../styles_ui/btn"
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
                setNotes([]) // set notes as empty
                
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

        SetshowInfo(!showInfo);
    }

    return <div className="flex flex-col h-screen w-screeen">
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
        
        <div className="flex justify-center m-4">
            {/* to add note =>  open the note window*/}
            <button onClick={()=>setNoteWindow(true)} className={btn2}>ADD NOTE</button>
        </div>
        {noteWindow ? <div className="fixed inset-0 flex justify-center items-center">
                <form onSubmit={(e) => addNote(e)} className="relative p-8 flex flex-col border rounded-lg bg-gray-200 h-100 w-full">
                    <button onClick={()=>setNoteWindow(false)} className="absolute right-2 top-2 pl-1 pr-1 rounded-lg hover:bg-red-400 hover:border">X</button>

                    <input type="text" placeholder="Title" onChange={(e)=>setTitle(e.target.value)}></input>
                    <hr></hr>
                    <textarea type="text" placeholder="Content" onChange={(e)=>setContent(e.target.value)} className="h-full"></textarea>
                    <button type="submit" className="absolute bottom-2 right-1/2 pl-1 pr-1 rounded-lg hover:bg-blue-400 hover:border">Save</button>
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

                return <div key={note._id} onClick={()=>noteClick(note)} className="border p-2 flex flex-col justify-center m-2 rounded-sm cursor-pointer">
                    {note.title}
                    <hr></hr>
                    {note.content}
                    {/* not show full content at last use ... */}
                    {/* by using text-overflow in tailwind */}
                </div>
            })}

            {editWindow == null ? <></> : <div className="fixed inset-0 flex justify-center items-center">
                <div className="relative p-8 flex flex-col border rounded-lg bg-gray-200 h-100 w-full">

                    <div className="absolute right-2 top-2 flex gap-2">
                        <button onClick={(e)=>onInfo(e)} className="pl-3 pr-3 rounded-full hover:bg-blue-100 border">i</button>
                        <button onClick={()=>setEditWindow(null)} className="pl-1 pr-1 rounded-lg hover:bg-red-400 hover:border border-1">X</button>
                    </div>
                    
                    {/* Info Box */}
                    {showInfo ? <div onClick={()=>SetshowInfo(false)} className="fixed bg-gray-400 border rounded-lg p-2">
                        <p>Information</p>
                        <hr></hr>
                        <p>Created at: {editWindow.createdAt}</p>
                        <p>Updated at: {editWindow.updatedAt}</p>
                    </div> : <></>}
                    
                    <input defaultValue={editWindow.title} onChange={(e)=>setTitle(e.target.value)}></input>
                    <hr></hr>
                    <textarea defaultValue={editWindow.content} onChange={(e)=>setContent(e.target.value)} className="h-full"></textarea>
                    
                    <div className="absolute bottom-2 right-2 flex justify-center items-center gap-2">
                        <button onClick={(e)=>onEdit(e)} className="rounded-lg hover:bg-blue-400 hover:border pl-1 pr-1">Save</button>
                        <button onClick={(e)=>onDelete(e)} className="rounded-lg hover:bg-red-400 hover:border pl-1 pr-1">Delete</button>
                    </div>
                </div>
            </div>}
        </div>
    </div>
}