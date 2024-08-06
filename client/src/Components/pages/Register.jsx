import React, { useState } from "react";
import "./Form.css";
import { FaUser, FaLock } from "react-icons/fa";

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const userData = {
            firstName,
            lastName,
            username,
            password,
            email
        };

        try {
            const response = await fetch("http://localhost:5001/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error response:", errorData);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log("User registered successfully");
            window.location.href = "/login"; // Redirect after successful registration
        } catch (error) {
            console.error("Fetch error:", error);
            setError("Network error. Please try again.");
        }
    };

    return (
        <div className={"wrapper"}>
            <form onSubmit={handleSubmit}>
                <h1>Register</h1>
                {error && <div className="error">{error}</div>}
                <div className={"input-box"}>
                    <input
                        type={"text"}
                        placeholder={"First Name"}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <FaUser className={"icon"} />
                </div>
                <div className={"input-box"}>
                    <input
                        type={"text"}
                        placeholder={"Last Name"}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    <FaUser className={"icon"} />
                </div>
                <div className={"input-box"}>
                    <input
                        type={"text"}
                        placeholder={"Username"}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <FaUser className={"icon"} />
                </div>
                <div className={"input-box"}>
                    <input
                        type={"password"}
                        placeholder={"Password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <FaLock className={"icon"} />
                </div>
                <div className={"input-box"}>
                    <input
                        type={"password"}
                        placeholder={"Confirm Password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <FaLock className={"icon"} />
                </div>
                <div className={"input-box"}>
                    <input
                        type={"email"}
                        placeholder={"Email"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <FaUser className={"icon"} />
                </div>

                <button type={"submit"}>Submit</button>
            </form>
        </div>
    );
};

export default Register;
