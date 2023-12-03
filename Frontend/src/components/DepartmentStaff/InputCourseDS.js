import {
	Box,
	Button,
	Chip,
	Container,
	TextField,
	Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

const InputCourseDS = () => {
	const [courseName, setCourseName] = useState("");
	const [availableCourses, setAvailableCourses] = useState([]);

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const response = await axios.get("/api/req-courses");
				setAvailableCourses(response.data);
			} catch (e) {
				alert("Error fetching courses");
			}
		};

		fetchCourses();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const response = await axios.post("/api/add-course", {
			course: courseName,
		});
		setAvailableCourses([...availableCourses, { course: courseName }]);
		alert(response.data.message);
	};

	const deleteCourse = async (id) => {
		const response = await axios.post("/api/delete-course", {
			id: id,
		});
		alert(response.data.message);
		setAvailableCourses(availableCourses.filter((course) => course._id !== id));
	};

	return (
		<Container
			maxWidth="sm"
			style={{ backgroundColor: "white" }}
			className="px-5 py-4 shadow rounded mb-5"
		>
			<Typography variant="h4" className="text-center mb-3" style={{fontFamily: "Aoboshi One"}}>
				Input Course
			</Typography>
			<form onSubmit={handleSubmit}>
				<TextField
					fullWidth
					label="Courses Requiring TA"
					variant="outlined"
					value={courseName}
					onChange={(e) => setCourseName(e.target.value)}
				/>
				<Box className="text-center">
					<Button variant="contained" type="submit" className="mt-4">
						Submit
					</Button>
				</Box>
			</form>
			<Box className="mt-4">
				<Typography variant="h5" className="mb-2">Available Courses</Typography>
				{availableCourses.map((course, index) => (
					<Chip
						className="fw-bold m-1"
						label={course.course}
						color="warning"
						variant="contained"
						onDelete={() => deleteCourse(course._id)}
						key={index}
					/>
				))}
			</Box>
		</Container>
	);
};

export default InputCourseDS;
