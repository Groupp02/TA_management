import { useEffect, useState } from "react";
import {
	Avatar,
	Box,
	Button,
	Container,
	Grid,
} from "@mui/material";
import axios from "axios";
import "../../styles/TaApplication.css";
import {
	PersonalDetails,
	PreviousTACourses,
	EligibleCourses,
	ResumeUploader,
} from "./ta_application.js";

const TaApplication = ({ user }) => {
	const [fileName, setFileName] = useState("");
	const [personalDetails, setPersonalDetails] = useState({
		username: user.username,
		name: "",
		email: "",
		phoneNumber: "",
		joiningDate: "",
	});

	const [previousCourses, setPreviousCourses] = useState([""]);
	const [checkPreviousCourse, setCheckPreviousCourse] = useState(false);
	const [eligibleCourses, setEligibleCourses] = useState(["Select Course"]);
	const [resume, setResume] = useState(null);
	const [reqCourse, setReqCourse] = useState([]);

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const response = await axios.get("/api/req-courses");
				setReqCourse(response.data);
			} catch (e) {
				alert("Error fetching courses");
			}
		};

		fetchCourses();
	}, []);

	const handlePersonalDetailsChange = (e) => {
		setPersonalDetails({ ...personalDetails, [e.target.name]: e.target.value });
	};

	const handleCheckPC = (value) => {
		setCheckPreviousCourse(value);
	};

	const handlePreviousCoursesChange = (index, value) => {
		const newCourses = [...previousCourses];
		newCourses[index] = value;
		setPreviousCourses(newCourses);
	};

	const handleEligibleCoursesChange = (index, value) => {
		const newCourses = [...eligibleCourses];
		newCourses[index] = value;
		setEligibleCourses(newCourses);
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setResume(file);
			setFileName(file.name);
		}
	};

	const validateForm = () => {
		for (const key in personalDetails) {
			if (personalDetails[key].trim() === "") {
				return { valid: false, message: `Please fill out the ${key}.` };
			}
		}
		if (!resume) {
			return { valid: false, message: "Please upload your resume." };
		}
		if (
			checkPreviousCourse &&
			previousCourses.every((course) => course.trim() === "")
		) {
			return {
				valid: false,
				message: "Please enter at least one previous TA course.",
			};
		}
		if (
			eligibleCourses.length === 0 ||
			eligibleCourses.every((course) => course === "Select Course")
		) {
			return {
				valid: false,
				message: "Please enter at least one eligible course.",
			};
		}

		return { valid: true, message: "Form is valid." };
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const validation = validateForm();
		if (!validation.valid) {
			alert(validation.message);
			return;
		}

		const formData = new FormData();
		formData.append("username", personalDetails.username);
		formData.append("name", personalDetails.name);
		formData.append("course", personalDetails.course);
		formData.append("email", personalDetails.email);
		formData.append("joiningDate", personalDetails.joiningDate);
		formData.append("phoneNumber", personalDetails.phoneNumber);
		formData.append("resume", resume);
		if (checkPreviousCourse) {
			formData.append(
				"previousCourses",
				previousCourses
					.filter((course) => course.trim() !== "")
					.map((course) => course.trim())
					.join(",")
			);
		}
		formData.append(
			"eligibleCourses",
			eligibleCourses
				.filter((course) => course !== "Select Course")
				.map((course) => course.trim())
				.join(",")
		);
		const pendingStatusArrayLength = eligibleCourses
			.filter((course) => course.trim() !== "")
			.map((course) => course.trim()).length;
		const pendingStatusArray = Array(pendingStatusArrayLength).fill("Pending");
		formData.append("status", pendingStatusArray.join(","));

		try {
			await axios.post("/api/ta-application", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			alert("Form submitted successfully!");

			setFileName("");
			setPersonalDetails({
				username: user.username,
				name: "",
				email: "",
				phoneNumber: "",
				joiningDate: "",
			});
			setPreviousCourses([""]);
			setEligibleCourses([""]);
			setResume(null);
		} catch (error) {
			console.error("Error submitting form:", error);
		}
	};

	return (
		<Container style={{backgroundColor: "white", borderRadius: "20px"}}>
			{/* <Typography variant="h4" component="h1" className="containerHeading">
				TA APPLICATION
			</Typography> */}
			<Grid container spacing={2} className="mt-4">
				<Grid
					item
					xs={2}
					className="d-flex justify-content-center align-items-center"
				>
					<Avatar sx={{ width: 200, height: 200 }} />
				</Grid>
				<Grid item xs={10}>
					<PersonalDetails
						personalDetails={personalDetails}
						onChange={handlePersonalDetailsChange}
					/>
				</Grid>
			</Grid>
			<ResumeUploader onChange={handleFileChange} fileName={fileName} />
			<PreviousTACourses
				previousCourses={previousCourses}
				onChange={handlePreviousCoursesChange}
				addCourse={setPreviousCourses}
				checkPreviousCourse={checkPreviousCourse}
				setCheckPreviousCourse={handleCheckPC}
			/>
			<EligibleCourses
				eligibleCourses={eligibleCourses}
				onChange={handleEligibleCoursesChange}
				addCourse={setEligibleCourses}
				availableCourses={reqCourse}
			/>
			<Box className="mt-4 text-center mb-5 pb-3">
				<Button
					variant="contained"
					color="success"
					component="span"
					onClick={handleSubmit}
				>
					Submit
				</Button>
			</Box>
		</Container>
	);
};

export default TaApplication;
