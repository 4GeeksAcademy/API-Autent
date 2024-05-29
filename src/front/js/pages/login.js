import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Login = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    async function sendData(e) {
        e.preventDefault();

        if (email.trim() === "" || password.trim() === "") {
            setErrorMessage("Email and password cannot be empty.");
            return;
        }

   

        setErrorMessage('');
        actions.login(email, password);
    }

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center gap-3 p-4">
            <div className="form-container">
                <p className="title">Empieza registrandote</p>
                <div className="error-message">{errorMessage || store.errorMessage}</div>
                <form className="form" onSubmit={sendData}>
                    <div className="input-group">
                        <label htmlFor="login-email" className="text-white">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            id="login-email" 
                            placeholder="" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="login-password" className="text-white">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            id="login-password" 
                            placeholder="" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="forgot">
                            <a rel="noopener noreferrer" href="#">Forgot Password ?</a>
                        </div>
                    </div>
                    <button type="submit" className="sign">Sign in</button>
                </form>
                <div className="social-message">
                    <div className="line"></div>
                    <p className="message">Don't have an account?</p>
                    <div className="line"></div>
                </div>
                <Link to="/signup">
                    <button className="btn btn-form ms-2" role="button">
                        Sign Up
                    </button>
                </Link>
            </div>
        </div>
    );
};

Login.propTypes = {
    match: PropTypes.object
};
