import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function Register() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleRegister() {
        fetch("http://localhost:4000/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                username,
                email,
                password
            })

        })

            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data.message);
                if (data.message === "User Created Successfully") {
                    Swal.fire({
                        title: "User Created Successfully!",
                        icon: 'success',
                        draggable: true,

                    })
                }
                else {
                    Swal.fire({
                        title: data.message,
                        icon: 'error',
                        draggable: true,
                    });

                }

            })
        .catch ((error) => {
        console.log("Error:", error);
        Swal.fire({
            title: error.message,
            icon: 'error',
            draggable: true,
        });
    })
}


return (
    <>
        <h1>Register</h1>

        Enter Name :- <input type="text" name="name" value={name} onChange={(e) => { setName(e.target.value) }} /><br /><br />
        Enter Username :- <input type="text" name="username" value={username} onChange={(e) => { setUsername(e.target.value) }} /><br /><br />
        Enter Email :- <input type="email" name="email" value={email} onChange={(e) => { setEmail(e.target.value) }} /><br /><br />
        Enter Password :- <input type="password" name="password" value={password} onChange={(e) => { setPassword(e.target.value) }} /><br /><br />

        <button onClick={handleRegister}>Register</button>

    </>
)
}