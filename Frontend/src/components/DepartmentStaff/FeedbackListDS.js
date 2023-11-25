import {
	CircularProgress,
	Container,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

const FeedbackList = () => {
	const [feedbacks, setFeedbacks] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchFeedbacks = async () => {
			try {
				const response = await axios.get("/api/getAllFeedbacks");
				console.log(response.data);
				setFeedbacks(response.data);
				setLoading(false);
			} catch (e) {
				console.error("Error fetching feedbacks:", e);
				alert("An error occurred while fetching feedbacks");
			}
		};
		fetchFeedbacks();
	}, []);

	return (
		<Container>
			<Typography variant="h4" sx={{ mb: 2 }} className="text-center">
				All Feedbacks
			</Typography>
			{loading ? (
				<Container className="mt-5 text-center">
					<CircularProgress />
				</Container>
			) : feedbacks.length === 0 ? (
				<Typography className="mt-5 text-center">No Feedbacks Yet</Typography>
			) : (
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Username</TableCell>
								<TableCell>Name</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Course</TableCell>
								<TableCell>Feedback</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{feedbacks.map((item, index) => (
								<TableRow key={index}>
									<TableCell>{item.username}</TableCell>
									<TableCell>{item.name}</TableCell>
									<TableCell>{item.email}</TableCell>
									<TableCell>{item.course}</TableCell>
									<TableCell>{item.feedback}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</Container>
	);
};

export default FeedbackList;
