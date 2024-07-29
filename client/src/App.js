import React, {useEffect, useState} from "react";
import "./App.css";
import { AppRoutes } from "./routes";

function App() {

    useEffect(() => {
        document.title = "Eco Journey"
    }, [])
    
    return (
        <div>
            <AppRoutes />
        </div>
    )
}

export default App

// const [backendUsers, setBackendUsers] = useState([{}])

// useEffect(() => {
//     Promise.all([
//         fetch('/api/users')
//             .then(res => res.json())
//             .then(data => setBackendUsers(data))
//     ]).catch(err => console.error("There was an error fetching the data: ", err))
// }, [])
//
// const renderUsers = () => {
//     return backendUsers.map((user, index) => {
//         return (
//             <div key={index}>
//                 <h3>{user.username}</h3>
//                 <p>{user.email}</p>
//             </div>
//         )
//     })
// }