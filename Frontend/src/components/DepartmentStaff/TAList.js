import {
	Button,
	CircularProgress,
	Container,
	Paper,
	Table,
	TableBody,
	TableCell,
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
				if (status === "Pending") {
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
			const response = await axios.post("/api/application/changeStatus", {
				newStatus: "Reviewing",
				appId: applications[aIndex]._id,
				index: index,
			});
			console.log(response.data);
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
		<Container>
			<Typography variant="h4" sx={{ mb: 2 }} className="text-center">
				TA Applications
			</Typography>
			<Paper elevation={3} className="p-3">
				{applications.length === 0 ? (
					<Typography className="mt-5 text-center">
						No Applications to review
					</Typography>
				) : (
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Username</TableCell>
								<TableCell>Name</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Phone Number</TableCell>
								<TableCell>Previous Courses</TableCell>
								<TableCell>Eligible Courses</TableCell>
								<TableCell>Resume</TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{applications.map((applicant, aIndex) => (
								<TableRow key={aIndex}>
									<TableCell>{applicant.username}</TableCell>
									<TableCell>{applicant.name}</TableCell>
									<TableCell>{applicant.email}</TableCell>
									<TableCell>{applicant.phoneNumber}</TableCell>
									<TableCell>{applicant.previousCourses}</TableCell>
									<TableCell><strong>{applicant.eligibleCourses}</strong></TableCell>
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
											color="primary"
											onClick={() => handleApprove(aIndex, applicant.index)}
										>
											Reviewed
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</Paper>
		</Container>
	);
};

export default TAList;
