import React from "react";
import "./Form.css";
import { FaUser, FaLock } from "react-icons/fa";

const Register = () => {
    return (
        <div className={"wrapper"}>
            <form action="">
                <h1>Register</h1>
                <div className={"input-box"}>
                    <input type={"text"} placeholder={"First Name"} required/>
                    <FaUser className={"icon"}/>
                </div>
                <div className={"input-box"}>
                    <input type={"text"} placeholder={"Last Name"} required/>
                    <FaUser className={"icon"}/>
                </div>
                <div className={"input-box"}>
                    <input type={"text"} placeholder={"Username"} required/>
                    <FaUser className={"icon"}/>
                </div>
                <div className={"input-box"}>
                    <input type={"password"} placeholder={"Password"} required/>
                    <FaLock className={"icon"}/>
                </div>
                <div className={"input-box"}>
                    <input type={"password"} placeholder={"Confirm Password"} required/>
                    <FaLock className={"icon"}/>
                </div>
                <div className={"input-box"}>
                    <input type={"email"} placeholder={"Email"} required/>
                    <FaUser className={"icon"}/>
                </div>
                
                <button type={"submit"}>Submit</button>
            </form>
        </div>
    )
}

export default Register