import React, { useState } from "react";
import {
	TextField,
	Button,
	Typography,
	Paper,
	Box,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
} from "@mui/material";
import axios from "axios";
import "../styles/SignUpForm.css";
import { useNavigate } from "react-router-dom";

const SignUpForm = ({setUser}) => {
	const navigate = useNavigate();
	
	const [userData, setUserData] = useState({
		username: "",
		password: "",
		confirmPassword: "",
		role: "",
	});

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (userData.password !== userData.confirmPassword) {
			alert("Passwords do not match!");
			return;
		}

		try {
			const response = await axios.post("/api/signup", {
				username: userData.username,
				password: userData.password,
				role: userData.role,
			});
			console.log(response.data);
			setUser({username: response.data.username, role: response.data.role});
			navigate("/");
		} catch (error) {
			console.error("Error during signup:", error.response.data);
			alert(error.response.data.message);
		}
	};

	const handleChange = (event) => {
		setUserData({ ...userData, [event.target.name]: event.target.value });
	};

	return (
		<Box className="signup-container">
			<Paper elevation={3} className="p-4 signup-paper">
				<Typography variant="h4" className="mb-3">
					Sign Up
				</Typography>
				<form onSubmit={handleSubmit}>
					<TextField
						name="username"
						label="Username"
						fullWidth
						margin="normal"
						variant="outlined"
						value={userData.username}
						onChange={handleChange}
					/>
					<TextField
						name="password"
						label="Password"
						type="password"
						fullWidth
						margin="normal"
						variant="outlined"
						value={userData.password}
						onChange={handleChange}
					/>
					<TextField
						name="confirmPassword"
						label="Confirm Password"
						type="password"
						fullWidth
						margin="normal"
						variant="outlined"
						value={userData.confirmPassword}
						onChange={handleChange}
					/>
					<FormControl fullWidth margin="normal">
						<InputLabel id="role-label">Role</InputLabel>
						<Select
							labelId="role-label"
							name="role"
							value={userData.role}
							label="Role"
							onChange={handleChange}
						>
							<MenuItem value="Student">Student</MenuItem>
							<MenuItem value="Instructor">Instructor</MenuItem>
							<MenuItem value="TA Committee Member">
								TA Committee Member
							</MenuItem>
							<MenuItem value="Department Staff">
								Department Staff
							</MenuItem>
						</Select>
					</FormControl>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						className="mt-3"
					>
						Register
					</Button>
				</form>
			</Paper>
		</Box>
	);
};

export default SignUpForm;
