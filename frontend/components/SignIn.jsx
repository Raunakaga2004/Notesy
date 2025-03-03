import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import {btn, btn2} from "../styles_ui/btn.jsx"

import { notifyError, notifySuccess } from "../utils/toast";
import { form_style } from "../styles_ui/form_style";
import { ipt } from "../styles_ui/ipt.jsx";

export default function SignIn () {
    const navigate = useNavigate();

    //states
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    const handleSignIn = async (e /* stands for event */)=>{
        e.preventDefault(); // prevents the form to submit
        try{
            const body = {
                "email": email,
                "password": pass
            }

            await axios.post("http://localhost:5000/api/auth/signin", body, {withCredentials : true}) //"withCredentials" allows us to send or receive cookies
                .then(()=>{
                    notifySuccess("Signed In Successfully!");
                    console.log("User Logged In!");
                    navigate("/") // navigate to Home page
                }).catch(()=>{
                    notifyError("Invalid Credentials!")
                    console.log("Error Logging in!!");
                })

        } catch(err){
            console.log(err);
        }
    }

    return <div className="flex flex-row justify-center items-center h-screen w-screen gap-4">
        <div className="basis-1/2 flex flex-col justify-center items-center">
            <h2 className="text-2xl pb-10 font-semibold">Welcome Back!</h2>
            <form onSubmit={handleSignIn} className={form_style}>
                <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} className={ipt}></input>

                <input type="password" placeholder="Password" value={pass} onChange={(e)=>setPass(e.target.value)} className={ipt}></input>
                <a href="/forgotPassword" className="hover:text-[#d00000] underline place-self-start text-sm pb-4">Forgot Password?</a>

                <button type="submit" className={btn2}>Sign In</button>
            </form>
            
            <div className="pt-4">Don't have an account? <a href="/signup" className="hover:text-[#d00000] underline">Create an account!</a></div>
        </div>
        <div className="basis-1/2 bg-[url(/images/backgroungimg.jpg)] h-screen"></div>
    </div>
}