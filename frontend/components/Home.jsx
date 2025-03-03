import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"

import { notifyDefault } from "../utils/toast"
import { btn } from "../styles_ui/btn"

export default function Home(){
    const [user, setUser] = useState({}) //user details except password will be stored

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
    
    return <div className="flex flex-col justify-between h-screen w-screeen">
        {/* Header */}
        <div className="flex flex-row justify-between items-center bg-[#6c757d] h-20 pl-4 pr-4">
            <div className="font-semibold text-lg">DevPage</div>
            {Object.keys(user).length == 0 /*If object is Empty*/? <div className="flex flex-row gap-4">
                <button onClick={()=>navigate("/signin")} className={btn}>Sign In</button>
                <button onClick={()=>navigate("/signup")} className={btn}>Sign Up</button>
            </div> : 
            <div className="">
                <button onClick ={()=>handleSignOut()} className={btn}>Sign Out</button>
            </div>
            }
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center items-center h-full">
            <div className="flex flex-row gap-2">Hi <div className="font-semibold italic">{Object.keys(user).length == 0 /*If object is Empty*/ ? "Developer" : user.firstname}!</div></div>
            <div>Welcome to the DevPage</div>
        </div>
        
    </div>
}