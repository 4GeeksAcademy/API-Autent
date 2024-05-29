import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-dark bg-dark">
			<div className="container">
								<Link to="/">
                <span className="btn btn-success" href="#" role="button">
                    Back home
                </span>
            </Link>
			</div>
		</nav>
	);
};
