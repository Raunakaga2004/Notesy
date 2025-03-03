import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom";

import { notifyError, notifyInfo, notifySuccess } from "../utils/toast";
import { form_style } from "../styles_ui/form_style";
import { ipt } from "../styles_ui/ipt";
import { btn2 } from "../styles_ui/btn";

export default function SignUp () {
    const navigate = useNavigate();

    //states
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    const handleSignUp = async (e)=>{
        e.preventDefault(); // prevents form to submit
        try{
            const body = {
                "firstname": firstname,
                "lastname": lastname,
                "email": email,
                "password": pass
            }

            await axios.post("http://localhost:5000/api/auth/signup", body, {withCredentials : true}) //"withCredentials" allows us to send or receive cookies
                .then(()=>{
                    notifySuccess("Signed Up Successfully!");
                    console.log("User created");
                    navigate("/signin") // as user is registered navigate to Sign In page
                }).catch((e)=>{
                    notifyError(e.response.data.error)
                    console.log(e)
                })

        } catch(err){
            console.log(err);
        }
    }

    return <div className="flex flex-row justify-center items-center">
        
        <div className="basis-1/2 bg-[url(/images/backgroungimg.jpg)] h-screen"></div>
        
        <div className="basis-1/2 flex flex-col justify-center items-center gap-4">
            <h2 className="text-2xl pb-10 font-semibold">Create Account</h2>
            <form onSubmit={handleSignUp} className={form_style}>
                <input type="text" placeholder="First Name" value={firstname} onChange={(e)=>setFirstName(e.target.value)} className={ipt}></input>
                
                <input type="text" placeholder="Last Name" value={lastname} onChange={(e)=>setLastName(e.target.value)} className={ipt}></input>

                <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} className={ipt}></input>

                <input type="password" placeholder="Password" value={pass} onChange={(e)=>setPass(e.target.value)} className={ipt}></input>

                <button type="submit" className={btn2}>Sign Up</button>
            </form>
            <div className="pt-4">Already have an account? <a href="/signin" className="hover:text-[#d00000] underline">Sign In!</a></div>
        </div>
    </div>
}