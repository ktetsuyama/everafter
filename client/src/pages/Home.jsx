import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import Auth from "../utils/auth";
import ExpandableNav from "../components/ExpandableNav";

const Home = () => {
	const logout = (event) => {
		event.preventDefault();
		Auth.logout();
	};

	if (loading) {
		return <div className="w-100 text-center">Loading...</div>;
	}

	return (
		<>
			<div className="nav-btns">
				{Auth.loggedIn() ? (
					<>
						<Link
							className="btn mobile btn-md btn-light m-2 nav-btn-home nav-btn "
							to="/me"
						>
							My profile
						</Link>
						<button
							className="btn btn-md btn-light m-2 mobile  nav-btn-home nav-btn"
							onClick={logout}
						>
							Logout
						</button>
					</>
				) : (
					<div className="nav-btns">
						<Link
							className=" btn mobile nav-btn-home m-2 nav-btn"
							to="/login"
						>
							Login
						</Link>
						<Link
							className="nav-btn-home mobile btn m-2 nav-btn"
							to="/signup"
						>
							Signup
						</Link>
					</div>
				)}
			</div>
			<div className="col-12 col-lg-10">
				<div className="card bg-white mt-2">
					<h4 className="card-header bg-primary text-primary p-2 pl-3">
						Welcome!
					</h4>
					<div className="card-body mx-3">
						<p>[Description]</p>
					</div>
				</div>
			</div>
			<div className="col-12 col-lg-10">
				<div className="card bg-white mt-2">
					<h4 className="card-header bg-primary text-primary p-2 pl-3">
						Our story:
					</h4>
					<div className="card-main card-mobile px-2">
						[component]
					</div>
				</div>
			</div>
			{/* ExpandableNav for mobile */}
			<ExpandableNav />
		</>
	);
};

export default Home;
