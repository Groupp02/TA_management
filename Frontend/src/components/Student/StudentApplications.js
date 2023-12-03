import React, { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	Container,
	Typography,
	Chip,
	Grid,
	Button,
	CircularProgress,
} from "@mui/material";
import axios from "axios";

const ApplicationCard = ({ appData, setApplication, index }) => {
	const getStatusColor = (status) => {
		switch (status) {
			case "Approved":
				return "success";
			case "Pending":
				return "warning";
			case "Rejected":
				return "error";
			case "Reviewing":
				return "info";
			case "Accepted":
				return "success";
			default:
				return "default";
		}
	};

	const acceptApplicationHandler = async () => {
		try {
			await axios.post("/api/application/changeStatus", {
				newStatus: "Accepted",
				appId: appData.applicationId,
				index: appData.index,
			});
			setApplication(index);
			alert("Application accepted!");
		} catch (error) {
			console.error("Error accepting application:", error);
		}
	};

	return (
		<Card className="mb-3 shadow">
			<CardContent>
				<Grid container alignItems="center" justifyContent="space-between">
					<Grid item xs>
						<Typography variant="h6" component="h2">
							Course: <strong>{appData.course}</strong>
						</Typography>
					</Grid>
					<Grid item xs>
						<Chip
							label={appData.status.toUpperCase()}
							color={getStatusColor(appData.status)}
							size="medium"
							style={{ marginTop: "10px" }}
							className="fw-bold"
						/>
					</Grid>
					{appData.status === "Approved" && (
						<Grid item>
							<Button
								variant="contained"
								color="primary"
								size="small"
								onClick={acceptApplicationHandler}
							>
								Accept
							</Button>
						</Grid>
					)}
				</Grid>
			</CardContent>
		</Card>
	);
};

const StudentApplications = ({ user }) => {
	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchApplications = async () => {
			try {
				const response = await axios.get(`/api/applications`);
				const apps = [];
				response.data.applications.forEach((app) => {
					app.eligibleCourses.split(",").forEach((course, index) => {
						apps.push({
							...app,
							applicationId: app._id,
							index,
							course,
							status:
								app.status.split(",").length > 1
									? app.status.split(",")[index]
									: app.status,
						});
					});
				});

				setApplications(apps);
				setLoading(false);
			} catch (error) {
				console.error("Failed to fetch applications", error);
			}
		};

		fetchApplications();
	}, []);

	const handleApplicationAccept = (index) => {
		const newApplications = [...applications];
		newApplications[index].status = "Accepted";
		setApplications(newApplications);
	};

	if (loading) {
		return (
			<Container className="d-flex justify-content-center align-items-center">
				<CircularProgress className="mt-5" />
			</Container>
		);
	}

	if (applications.length === 0) {
		return (
			<Container className="d-flex justify-content-center align-items-center">
				<Typography variant="h5" className="text-center">
					No applications found
				</Typography>
			</Container>
		);
	}

	return (
		<Container>
			{applications.map((app, index) => (
				<ApplicationCard
					key={index}
					appData={app}
					setApplication={handleApplicationAccept}
					index={index}
				/>
			))}
		</Container>
	);
};

export default StudentApplications;
