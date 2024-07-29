import React, {useEffect, useState} from "react";
import "./App.css";
import LoginForm from "./Components/LoginForm/LoginForm";

function App() {

    const [backendUsers, setBackendUsers] = useState([{}])

    useEffect(() => {
        document.title = "Eco Journey"
    }, [])

    useEffect(() => {
        Promise.all([
            fetch('/api/users')
                .then(res => res.json())
                .then(data => setBackendUsers(data))
        ]).catch(err => console.error("There was an error fetching the data: ", err))
    }, [])

    const renderUsers = () => {
        return backendUsers.map((user, index) => {
            return (
                <div key={index}>
                    <h3>{user.username}</h3>
                    <p>{user.email}</p>
                </div>
            )
        })
    }

    const renderLoginPage = () => {
        return (
            <div className="center-container">
                <div className={"logo-container"}>
                    <img src="/ej_logo.png" alt={"Eco Journey Logo"} className={"logo"}/>
                </div>
                <div>
                    <LoginForm/>
                </div>
            </div>
        )
    }

    return (
        <div>
            {renderLoginPage()}
        </div>
    )
}

export default App