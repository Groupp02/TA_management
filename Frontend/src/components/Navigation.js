import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navigation.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Logout } from "@mui/icons-material";
import NotificationComponent from "./Notifications";

const Navigation = ({ user, setUser }) => {
	const navigate = useNavigate();
	const handleLogout = async () => {
		try {
			await axios.post("/api/logout");
			setUser(null);

			navigate("/");
		} catch (error) {
			console.error("Logout failed", error);
		}
	};

	if (!user) {
		return;
	}

	return (
		<AppBar position="static" className={"navBar mb-3"}>
			<Toolbar>
				{user && (
					<NotificationComponent user={user} />
				)}
				{user && user.role === "TA Committee Member" && (
					<>
						<Typography variant="h6" className={"title text-center"}>
							<NavLink
								to="/feedbacks"
								className={({ isActive }) =>
									isActive ? "link activeNav" : "link"
								}
								style={{ color: "white" }}
							>
								Feedbacks
							</NavLink>
						</Typography>
						<Typography variant="h6" className={"title text-center"}>
							<NavLink
								to="/"
								className={({ isActive }) =>
									isActive ? "link activeNav" : "link"
								}
								style={{ color: "white" }}
							>
								TA Application
							</NavLink>
						</Typography>
					</>
				)}
				{user && user.role === "Instructor" && (
					<>
						<Typography variant="h6" className={"title text-center"}>
							<NavLink
								to="/"
								className={({ isActive }) =>
									isActive ? "link activeNav" : "link"
								}
								style={{ color: "white" }}
							>
								All Feedbacks
							</NavLink>
						</Typography>
						<Typography variant="h6" className={"title text-center"}>
							<NavLink
								to="/feedback"
								className={({ isActive }) =>
									isActive ? "link activeNav" : "link"
								}
								style={{ color: "white" }}
							>
								Fill Feedback
							</NavLink>
						</Typography>
					</>
				)}
				{user && user.role === "Student" && (
					<>
						<Typography variant="h6" className={"title text-center"}>
							<NavLink
								to="/"
								className={({ isActive }) =>
									isActive ? "link activeNav" : "link"
								}
								style={{ color: "white" }}
							>
								Applications
							</NavLink>
						</Typography>
						<Typography variant="h6" className={"title text-center"}>
							<NavLink
								to="/applications"
								className={({ isActive }) =>
									isActive ? "link activeNav" : "link"
								}
								style={{ color: "white" }}
							>
								TA Application Form
							</NavLink>
						</Typography>
						<Typography variant="h6" className={"title text-center"}>
							<NavLink
								to="/feedbacks"
								className={({ isActive }) =>
									isActive ? "link activeNav" : "link"
								}
								style={{ color: "white" }}
							>
								Feedbacks
							</NavLink>
						</Typography>
					</>
				)}
				{user && user.role === "Department Staff" && (
					<>
						<Typography variant="h6" className={"title text-center"}>
							<NavLink
								to="/"
								className={({ isActive }) =>
									isActive ? "link activeNav" : "link"
								}
								style={{ color: "white" }}
							>
								TA Applications
							</NavLink>
						</Typography>
						<Typography variant="h6" className={"title text-center"}>
							<NavLink
								to="/feedbacks"
								className={({ isActive }) =>
									isActive ? "link activeNav" : "link"
								}
								style={{ color: "white" }}
							>
								Feedbacks
							</NavLink>
						</Typography>
						<Typography variant="h6" className={"title text-center"}>
							<NavLink
								to="/input-new-course"
								className={({ isActive }) =>
									isActive ? "link activeNav" : "link"
								}
								style={{ color: "white" }}
							>
								Input TA Requirement
							</NavLink>
						</Typography>
					</>
				)}
				{user && (
					<Typography variant="h6" className={"title text-center"}>
						<Button
							onClick={handleLogout}
							variant="contained"
							className="fw-bold float-end fs-6 logoutBtn"
						>
							<Logout />
							Logout
						</Button>
					</Typography>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default Navigation;
