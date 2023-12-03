import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Container,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	CircularProgress,
	Chip,
	Button,
	Box,
} from "@mui/material";
import "../../styles/TaList.css";

const downloadFile = async (filename) => {
	try {
		filename = filename.split("/")[1];
		const response = await axios.get(`/api/download-resume/${filename}`, {
			responseType: "blob",
		});

		const file = new Blob([response.data], {
			type: "application/octet-stream",
		});

		const downloadUrl = window.URL.createObjectURL(file);
		const link = document.createElement("a");
		link.href = downloadUrl;
		link.setAttribute("download", `${filename}.pdf`);
		document.body.appendChild(link);
		link.click();

		link.parentNode.removeChild(link);
		window.URL.revokeObjectURL(downloadUrl);
	} catch (error) {
		console.error("Error downloading file:", error);
	}
};

const TaList = () => {
	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(false);

	const storeApplications = (applications) => {
		const newApps = [];
		applications.forEach((app) => {
			app.status?.split(",").forEach((status, index) => {
				if (status === "Reviewing") {
					newApps.push({
						...app,
						eligibleCourses: app.eligibleCourses?.split(",")[index],
						index,
					});
				}
			});
		});
		setApplications(newApps);
	};

	useEffect(() => {
		const fetchApplications = async () => {
			setLoading(true);
			try {
				const response = await axios.get("/api/ta-applications");
				storeApplications(response.data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching TA applications:", error);
				setLoading(false);
			}
		};

		fetchApplications();
	}, []);

	const approveApplication = (aIndex, index) => {
		const newApplications = [
			...applications.slice(0, aIndex),
			...applications.slice(aIndex + 1),
		];
		setApplications(newApplications);
	};

	const handleApprove = async (aIndex, index) => {
		try {
			await axios.post("/api/application/changeStatus", {
				newStatus: "Approved",
				appId: applications[aIndex]._id,
				index: index,
			});
			approveApplication(aIndex, index);
			alert("Application accepted!");
		} catch (error) {
			console.error("Error accepting application:", error);
		}
	};

	if (loading) {
		return (
			<Container className="text-center">
				<CircularProgress />
			</Container>
		);
	}

	return (
		<Box className="px-5 mx-2 text-center">
			{applications.length === 0 ? (
				<Typography className="mt-5 text-center">
					No Applications for approval
				</Typography>
			) : (
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell className="fs-4" style={{fontFamily: "Dhurjati"}}>Name</TableCell>
								<TableCell className="fs-4" style={{fontFamily: "Dhurjati"}}>Email</TableCell>
								<TableCell className="fs-4" style={{fontFamily: "Dhurjati"}}>Phone Number</TableCell>
								<TableCell className="fs-4" style={{fontFamily: "Dhurjati"}}>Joining Date</TableCell>
								<TableCell className="fs-4" style={{fontFamily: "Dhurjati"}}>Previous Courses</TableCell>
								<TableCell className="fs-4" style={{fontFamily: "Dhurjati"}}>Eligible Courses</TableCell>
								<TableCell className="fs-4" style={{fontFamily: "Dhurjati"}}>Resume</TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{applications.map((application, aIndex) => (
								<TableRow key={application._id}>
									<TableCell>{application.name}</TableCell>
									<TableCell>{application.email}</TableCell>
									<TableCell>{application.phoneNumber}</TableCell>
									<TableCell>
										{new Date(application.joiningDate).toLocaleDateString()}
									</TableCell>
									<TableCell>
										{application.previousCourses
											?.split(",")
											.map((course, index) => (
												<Chip
													key={index}
													label={course}
													className="course-chip fw-bold"
												/>
											))}
									</TableCell>
									<TableCell>
										<Chip
											key={aIndex}
											label={application.eligibleCourses}
											className="course-chip fw-bold"
											color="secondary"
										/>
									</TableCell>
									<TableCell>
										<Button
											type="a"
											onClick={() => downloadFile(application.resume)}
										>
											Download Resume
										</Button>
									</TableCell>
									<TableCell>
										<Button
											variant="contained"
											color="success"
											onClick={() => handleApprove(aIndex, application.index)}
											className="fw-bold"
										>
											Approve
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</Box>
	);
};

export default TaList;
