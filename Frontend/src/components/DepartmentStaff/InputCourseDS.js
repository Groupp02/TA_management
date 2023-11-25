import { Box, Button, Container, TextField, Typography } from "@mui/material";
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
		console.log(response.data);
		alert(response.data.message);
	};

	return (
		<Container maxWidth="sm">
			<Typography variant="h4" className="text-center mb-3">
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
				<Typography variant="h5">Available Courses</Typography>
				{availableCourses.map((course, index) => (
					<Typography key={index} variant="subtitle1">
						{index + 1}. {course.course}
					</Typography>
				))}
			</Box>
		</Container>
	);
};

export default InputCourseDS;
