import {
	Box,
	Button,
	Chip,
	CircularProgress,
	Container,
	Paper,
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

const TAList = () => {
	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(true);

	const updateApplications = (apps) => {
		const newApps = [];
		apps.forEach((app) => {
			app.status.split(",").forEach((status, index) => {
				if (status === "Pending" || status === "Reviewing") {
					newApps.push({
						...app,
						eligibleCourses: app.eligibleCourses.split(",")[index],
						index,
					});
				}
			});
		});
		setApplications(newApps);
	};

	useEffect(() => {
		const fetchApplications = async () => {
			try {
				const response = await axios.get("/api/ta-applications");
				updateApplications(response.data);
				setLoading(false);
			} catch (e) {
				alert("Error fetching applications");
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
				newStatus: "Reviewing",
				appId: applications[aIndex]._id,
				index: index,
			});
			approveApplication(aIndex, index);
			alert("Application sent to TA committee!");
		} catch (error) {
			console.error("Error accepting application:", error);
		}
	};

	if (loading) {
		return (
			<Container>
				<CircularProgress />
			</Container>
		);
	}

	return (
		<Box className="px-5 mb-4">
			<Paper elevation={3} className="p-3">
				{applications.length === 0 ? (
					<Typography variant="h5" className="fw-bold mt-5 text-center">
						No Applications to review
					</Typography>
				) : (
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell className="fs-4" style={{ fontFamily: "Dhurjati" }}>
										Name (username)
									</TableCell>
									<TableCell className="fs-4" style={{ fontFamily: "Dhurjati" }}>
										Email
									</TableCell>
									<TableCell className="fs-4" style={{ fontFamily: "Dhurjati" }}>
										Phone Number
									</TableCell>
									<TableCell className="fs-4" style={{ fontFamily: "Dhurjati" }}>
										Previous Courses
									</TableCell>
									<TableCell className="fs-4" style={{ fontFamily: "Dhurjati" }}>
										Eligible Courses
									</TableCell>
									<TableCell className="fs-4" style={{ fontFamily: "Dhurjati" }}>
										Resume
									</TableCell>
									<TableCell></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{applications.map((applicant, aIndex) => (
									<TableRow key={aIndex}>
										<TableCell>{applicant.name} <span className="fst-italic">({applicant.username})</span></TableCell>
										<TableCell>{applicant.email}</TableCell>
										<TableCell>{applicant.phoneNumber}</TableCell>
										<TableCell>
											{applicant.previousCourses
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
												label={applicant.eligibleCourses}
												className="course-chip fw-bold"
												color="secondary"
											/>
										</TableCell>
										<TableCell>
											<Button
												type="a"
												onClick={() => downloadFile(applicant.resume)}
											>
												Download Resume
											</Button>
										</TableCell>
										<TableCell>
											<Button
												variant="contained"
												color="success"
												onClick={() => handleApprove(aIndex, applicant.index)}
												disabled={applicant.status.split(",")[applicant.index] === "Reviewing"}
											>
												Reviewed
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				)}
			</Paper>
		</Box>
	);
};

export default TAList;
