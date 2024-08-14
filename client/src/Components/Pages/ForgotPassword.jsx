import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import "../Styles/Form.css";

/**
 * Forgot Password page component. Contains a form to reset the user's password.
 */
const ForgotPassword = () => {
    const [petName, setPetName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [step, setStep] = useState(1); // Track the current step

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setMessage("");
        setError("");

        if (step === 1) {
            // Step 1: Verify pet name
            if (!petName) {
                setError("Please enter the name of your childhood pet.");
                return;
            }

            try {
                const response = await fetch("/api/verify-pet-name", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ petName }),
                });

                if (!response.ok) {
                    throw new Error("Invalid pet name.");
                }

                const data = await response.json();
                setMessage(data.message || "Pet name verified! Please enter your new password.");
                setStep(2); // Move to step 2 to enter the new password
            } catch (err) {
                setError(err.message || "An unexpected error occurred.");
            }
        } else if (step === 2) {
            // Step 2: Change password
            if (!newPassword || !confirmPassword) {
                setError("Both password fields are required.");
                return;
            }
            if (newPassword !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }

            try {
                const response = await fetch("/api/change-password", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ petName, newPassword }),
                });

                if (!response.ok) {
                    throw new Error("Failed to change password.");
                }

                const data = await response.json();
                setMessage(data.message || "Password has been changed successfully!");
                // Reset fields after successful password change
                setPetName("");
                setNewPassword("");
                setConfirmPassword("");
                setStep(1); // Reset to step 1 for another attempt if needed
            } catch (err) {
                setError(err.message || "An unexpected error occurred.");
            }
        }
    };

    return (
        <div className={"wrapper"}>
            <form onSubmit={handleSubmit}>
                <h1>Forgot Password?</h1>
                {step === 1 && (
                    <>
                        <p className={"email-prompt"}>What was the name of your childhood pet?</p>
                        <div className={"input-box"}>
                            <input
                                type={"text"}
                                placeholder={"Pet Name"}
                                required
                                value={petName}
                                onChange={(e) => setPetName(e.target.value)}
                            />
                            <FaUser className={"icon"} />
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <p className={"email-prompt"}>Enter your new password:</p>
                        <div className={"input-box"}>
                            <input
                                type={"password"}
                                placeholder={"New Password"}
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className={"input-box"}>
                            <input
                                type={"password"}
                                placeholder={"Confirm Password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </>
                )}

                {error && <p className={"error-message"}>{error}</p>}
                {message && <p className={"success-message"}>{message}</p>}

                <button type={"submit"}>{step === 1 ? "Submit" : "Change Password"}</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
