import { useState } from "react";
import React, { useEffect } from "react";

export default function UserProfile() {
    const token = localStorage.getItem("itmtoken");
    console.log("Token from local storage", token);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');



    if (!token) {
        window.location.href = "/";
    }

    useEffect(() => {
        fetch("http://localhost:4000/auth/profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'token': token
            }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("User Profile Data:", data);
                
                setName(data.user.name);
                setUsername(data.user.username);
                setEmail(data.user.email);

            })
            .catch((error) => {
                console.log("Error:", error);

            });
    }, []);

    return(
        <>
        <h1>User Profile Page</h1>
        {
            name && username && email &&
            <>
            <p><strong>Name</strong>{name}</p>
            <p><strong>Username</strong>{username}</p>
            <p><strong>Email</strong>{email}</p>
            </>
        }
        </>
    )
}