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
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

const FeedbackList = () => {
	const [feedbacks, setFeedbacks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openIndex, setOpenIndex] = useState(-1);

	useEffect(() => {
		const fetchFeedbacks = async () => {
			try {
				const response = await axios.get("/api/getAllFeedbacks");
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
		<Container style={{ backgroundColor: "white" }} className="shadow rounded">
			{loading ? (
				<Container className="mt-5 text-center">
					<CircularProgress />
				</Container>
			) : feedbacks.length === 0 ? (
				<Typography variant="h5" className="p-5 mt-5 text-center fw-bold">
					No Feedbacks Yet !
				</Typography>
			) : (
				<div className="container py-5">
					{feedbacks.map((item, index) => (
						<Card key={index} className="mb-2 shadow">
							<CardContent className="py-1 pb-2">
								<Box className="d-flex align-items-center">
									<Typography
										variant="h5"
										component="div"
										className="fs-4 me-5"
										style={{ fontFamily: "Dhurjati" }}
									>
										{item.username}
									</Typography>
									<Typography
										className="fs-5 me-5"
										style={{ fontFamily: "Hedvig Letters Serif" }}
									>
										Name: <strong>{item.name}</strong>
									</Typography>
									<Typography className="fs-5 me-5">
										Email:{" "}
										<span className="fs-4" style={{ fontFamily: "Dhurjati" }}>
											{item.email}
										</span>
									</Typography>
									<Typography
										className="fs-5 my-3"
										style={{ fontFamily: "Hedvig Letters Serif" }}
									>
										<Chip
											className="ms-2 fs-6 fw-bold"
											label={item.course}
											color="default"
											style={{ fontFamily: "Hedvig Letters Serif" }}
										/>
									</Typography>
									<Button
										className="ms-auto"
										onClick={
											openIndex !== index
												? () => setOpenIndex(index)
												: () => setOpenIndex(-1)
										}
									>
										{openIndex === index ? <ArrowDropUp /> : <ArrowDropDown />}
									</Button>
								</Box>
								{openIndex === index && (
									<Box>
										<Typography className="fs-6">
											<strong>Feedback:</strong>{" "}
											<span
												style={{ fontFamily: "Hedvig Letters Serif" }}
												className="fs-5"
											>
												{item.feedback}
											</span>
										</Typography>
									</Box>
								)}
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</Container>
	);
};

export default FeedbackList;
