import React, {useState} from "react";
import {FaLock, FaUser} from "react-icons/fa";
import "../Styles/Form.css";
import {Navigate} from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        if (isFormValid()) {
            try {
                const response = await fetch("http://localhost:5000/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem("token", data.token);
                    window.location.href = "/question-form";
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || "Invalid username or password.");
                }
            } catch (error) {
                alert("Network error. Please try again.");
            }
        } else {
            alert("Please fill out all fields");
        }
    };
    
    const isFormValid = () => {
        return formData.username && formData.password
    }

    return (
        <div className="center-container">
            <div className={"logo-container"}>
                <img src="/ej_logo.png" alt={"Eco Journey Logo"} className={"logo"}/>
            </div>
            <div className={"wrapper"}>
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <div className={"input-box"}>
                        <input 
                            type={"text"} 
                            name={"username"}
                            placeholder={"Username"}
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                        <FaUser className={"icon"} />
                    </div>
                    
                    <div className={"input-box"}>
                        <input 
                            type={"password"} 
                            name={"password"}
                            placeholder={"Password"} 
                            value={formData.password}
                            onChange={handleInputChange}
                            required/>
                        <FaLock className={"icon"}/>
                    </div>

                    <div className={"remember-forgot"}>
                        <label><input type={"checkbox"}/>Remember me</label>
                        <a href="./forgot-password">Forgot password?</a>
                    </div>

                    <button type={"submit"}>Login</button>

                    <div className={"register-link"}>
                        <p>Don't have an account? <a href="./register">Register</a></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login