import React, { useEffect, useState } from "react";
import axios from "axios";
import {
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	CircularProgress,
	Container,
	Typography,
} from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

const FeedbackList = ({ user }) => {
	const [loading, setLoading] = useState(true);
	const [feedbacks, setFeedbacks] = useState([]);
	const [open, setOpen] = useState(-1);

	useEffect(() => {
		const fetchFeedbacks = async () => {
			try {
				const response = await axios.get(`/api/getFeedbacks/${user.username}`);
				setFeedbacks(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Failed to fetch feedbacks", error);
			}
		};

		fetchFeedbacks();
	}, [user]);

	if (loading) {
		<Container className="mt-5 d-flex justify-content-center aligh-items-center">
			<CircularProgress />
		</Container>;
	}

	return (
		<Box className="mx-3 px-4 my-4">
			{feedbacks?.map((feedback, index) => (
				<Card key={index} className="my-3">
					<CardContent>
						<Box className="d-flex justify-content-between align-items-center">
							<Chip
								label={feedback.course}
								className="me-3 fw-bold"
								color="info"
							/>
							<Button
								variant="text"
								onClick={() => {
									open === index ? setOpen(-1) : setOpen(index);
								}}
							>
								{open !== index ? (
									<ArrowDropDown className="fs-3" />
								) : (
									<ArrowDropUp className="fs-3" />
								)}
							</Button>
						</Box>
						{open === index && (
							<>
								<Typography variant="subtitle1" className="mt-3 fw-bold">
									Feedback:
								</Typography>
								<Box
									className="border mt-1 px-5 py-3"
									style={{ fontFamily: "Hedvig Letters Serif" }}
								>
									{feedback.feedback}
								</Box>
							</>
						)}
					</CardContent>
				</Card>
			))}
		</Box>
	);
};

export default FeedbackList;
