import React, { useState } from "react";
import { TextField, Button, Typography, Paper, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

const LoginForm = ({ setUser }) => {
	const [loginData, setLoginData] = useState({
		username: "",
		password: "",
	});

	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();
		console.log(
			"Username:",
			loginData.username,
			"Password:",
			loginData.password
		);

		try {
			const response = await axios.post("/api/login", {
				username: loginData.username,
				password: loginData.password,
			});
			console.log(response.data);
			setUser({ username: response.data.username, role: response.data.role });
		} catch (error) {
			console.error("Error during login:", error.response.data);
			alert("Invalid credentials");
		}
	};

	const handleSignUp = () => {
		navigate("/signup");
	};

	return (
		<Box className="login-container">
			<Paper elevation={3} className="p-4">
				<Typography variant="h4" className="mb-3">
					Login
				</Typography>
				<form onSubmit={handleSubmit}>
					<TextField
						label="Username"
						fullWidth
						margin="normal"
						variant="outlined"
						value={loginData.username}
						onChange={(e) =>
							setLoginData({ ...loginData, username: e.target.value })
						}
					/>
					<TextField
						label="Password"
						fullWidth
						margin="normal"
						type="password"
						variant="outlined"
						value={loginData.password}
						onChange={(e) =>
							setLoginData({ ...loginData, password: e.target.value })
						}
					/>
					<Box display="flex" justifyContent="space-between" mt={3}>
						<Button type="submit" variant="contained" color="primary">
							Sign In
						</Button>
						<Button
							variant="contained"
							color="secondary"
							onClick={handleSignUp}
						>
							Sign Up
						</Button>
					</Box>
				</form>
			</Paper>
		</Box>
	);
};

export default LoginForm;
