import React from "react";
import {FaUser} from "react-icons/fa";
import "../Styles/Form.css";

/**
 * Forgot Password page component. Contains a form to reset the user's password.
 */
const ForgotPassword = () => {
    return (
        <div className={"wrapper"}>
            <form action="">
                <h1>Forgot Password?</h1>
                <p className={"email-prompt"}>Please enter your email address to reset your password.</p>
                
                <div className={"input-box"}>
                    <input type={"email"} placeholder={"Email"} required/>
                    <FaUser className={"icon"}/>
                </div>

                <button type={"submit"}>Submit</button>
            </form>
        </div>
    )
}

export default ForgotPassword