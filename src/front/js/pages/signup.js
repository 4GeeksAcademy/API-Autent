import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const SignUp = props => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email.trim() === "" || password.trim() === "") {
            setErrorMessage("Email and password cannot be empty.");
            return;
        }

        setErrorMessage("");
        actions.signUp(email, password);

        setEmail("");
        setPassword("");
    };

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center gap-3 p-4">
            <h1 className="title text-white">Not member yet?</h1>
            <div className="form-container">
                <p className="title">Sign Up</p>
                <div className="error-message">{errorMessage || store.errorMessage}</div>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="text" 
                            name="email" 
                            id="email" 
                            placeholder="" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            id="password" 
                            placeholder="" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="sign mt-4">Sign up</button>
                </form>
                <div className="social-message">
                    <div className="line"></div>
                    <p className="message">Already member?</p>
                    <div className="line"></div>
                </div>
                <div className="social-message d-flex justify-content-center align-items-center">
                    <Link to="/">
                        <button className="btn btn-form" href="#" role="button"> 
                            Login
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

SignUp.propTypes = {
    match: PropTypes.object
};
