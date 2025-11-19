import React from "react";
import Swal from "sweetalert2";

export default function Login() {

    const [username,setUsername]=React.useState("");
    const [password,setPassword]=React.useState("");

    function handleSubmit(){
        fetch("http://localhost:4000/user/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                username,
                password
            })
        })
        .then((response)=>response.json())
        .then((data)=>{
            console.log("Success:",data);

            if (data.message === "Login successfull") {
                const token = data.token;
                localStorage.setItem("itmtoken", token);

                Swal.fire({
                    title: data.message,
                    icon: 'success',
                    draggable: true,
                });

                setTimeout(() => {
                    window.location.href = "/userprofile";
                }, 2000);
            }
        })
        .catch((error)=>{
            console.log("Error:",error);
        })
    }

    return(
        <>
        <h1>Login</h1>

        Enter Username:- <input type="text" name="username" value={username} onChange={(e)=>{setUsername(e.target.value)}} /><br /><br />
        Enter Password:- <input type="password" name="password" value={password} onChange={(e)=>{setPassword(e.target.value)}} /><br /><br />
        <button onClick={handleSubmit()}>Submit</button>

        
        
        
        </>
    )
}