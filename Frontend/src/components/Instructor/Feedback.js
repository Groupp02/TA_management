import {
	Box,
	Button,
	Container,
	Grid,
	Modal,
	TextField,
	Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

const FeedbackModal = ({ user, open, onClose }) => {
	const [feedback, setFeedback] = useState("");

	const handleClose = () => {
		onClose();
	};

	const handleSubmit = async () => {
		if (feedback === "") {
			alert("Feedback cannot be empty");
			return;
		}
		try {
			const response = await axios.post("/api/createFeedback", {
				username: user.username,
				name: user.name,
				email: user.email,
				course: user.course,
				feedback,
			});
			console.log(response.data);
			if (response.status === 201) {
				alert("Feedback created successfully");
			} else {
				console.error("Failed to create feedback");
				alert("Failed to create feedback");
			}
		} catch (e) {
			console.error("Error creating feedback:", e);
			alert("An error occurred while creating feedback");
		}
		handleClose();
	};

	return (
		<Modal open={open} onClose={handleClose}>
			<Container maxWidth="md">
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						mt: 4,
						p: 3,
						bgcolor: "white",
						boxShadow: 4,
						borderRadius: 4,
					}}
				>
					<Typography variant="h6" gutterBottom>
						User Information
					</Typography>
					<Typography variant="body1">Username: {user.username}</Typography>
					<Typography variant="body1">Name: {user.name}</Typography>
					<Typography variant="body1">Email: {user.email}</Typography>
					<Typography variant="body1">Course: {user.course}</Typography>
					<TextField
						label="Feedback"
						variant="outlined"
						fullWidth
						multiline
						rows={4}
						value={feedback}
						onChange={(e) => setFeedback(e.target.value)}
						className="mt-2"
					/>
					<Button
						variant="contained"
						color="primary"
						onClick={handleSubmit}
						className="mt-2"
					>
						Submit Feedback
					</Button>
				</Box>
			</Container>
		</Modal>
	);
};

const Feedback = () => {
	const [applicants, setApplicants] = useState([]);
	const [open, setOpen] = useState(false);
	const [curUser, setCurUser] = useState(null);

	const fillApplicants = (applics) => {
		const newApplicants = [];
		const applics2 = applics.map((appli) => {
			return {
				...appli,
				eligibleCourses: appli.eligibleCourses.split(","),
				status: appli.status.split(","),
			};
		});
		applics2.forEach((appli) => {
			appli.eligibleCourses.forEach((course, index) => {
				if (appli.status[index] === "Accepted") {
					newApplicants.push({
						username: appli.username,
						name: appli.name,
						email: appli.email,
						course,
					});
				}
			});
		});
		setApplicants(newApplicants);
	};

	useEffect(() => {
		const fetchAcceptedApplications = async () => {
			try {
				const response = await axios.get("/api/getAcceptedApplications");

				if (response.status === 200) {
					fillApplicants(response.data);
				} else {
					console.error("Failed to fetch accepted applications");
				}
			} catch (error) {
				console.error("Error fetching accepted applications:", error);
			}
		};

		fetchAcceptedApplications();
	}, []);

	const handleFeedbackClick = (user) => {
		setCurUser(user);
		setOpen(true);
	};

	return (
		<Container>
			<Typography variant="h4" sx={{ mb: 2 }} className="text-center">
				Fill Feedback
			</Typography>
			{applicants.length === 0 ? (
				<Typography className="mt-5 text-center">
					No TAs available yet to give feedback
				</Typography>
			) : (
				applicants.map((item, index) => (
					<Grid container key={index} className="p-3 border">
						<Grid xs item>
							<Box>
								<Typography>
									<strong>Username:</strong> {item.username}
								</Typography>
								<Typography>
									<strong>Name:</strong> {item.name}
								</Typography>
								<Typography>
									<strong>Email:</strong> {item.email}
								</Typography>
								<Typography>
									<strong>Course:</strong> {item.course}
								</Typography>
							</Box>
						</Grid>
						<Grid item>
							<Button
								variant="contained"
								color="primary"
								onClick={() => handleFeedbackClick(item)}
							>
								Feedback
							</Button>
						</Grid>
					</Grid>
				))
			)}
			{open && (
				<FeedbackModal
					user={curUser}
					open={open}
					onClose={() => setOpen(false)}
				/>
			)}
		</Container>
	);
};

export default Feedback;
