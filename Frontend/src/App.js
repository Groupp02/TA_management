import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import "./styles/App.css";
import {
	TaApplication,
	TaList,
	LoginForm,
	SignUpForm,
	Navigation,
	StudentApplications,
	InputCourseDS,
	TAListDS,
	FeedbackList,
	Feedback,
	FeedbackListTC,
	FeedbackListDS,
	FeedbackListStudent,
} from "./components";
import { CircularProgress, Container } from "@mui/material";

const App = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const handleSetUser = (user) => {
		setUser(user);
	};

	useEffect(() => {
		const checkSession = async () => {
			try {
				const response = await axios.get("/api/validate-session");
				setUser(response.data.user);
				setLoading(false);
			} catch (error) {
				console.error("Session validation failed", error);
				setLoading(false);
			}
		};

		checkSession();
	}, []);

	if (loading) {
		return (
			<Container className="text-center">
				<CircularProgress />
			</Container>
		);
	}

	return (
		<Router>
			<Navigation user={user} setUser={handleSetUser} />
			{!user && (
				<Routes>
					<Route
						path="/signup"
						element={<SignUpForm setUser={handleSetUser} />}
					/>
					<Route path="*" element={<LoginForm setUser={handleSetUser} />} />
				</Routes>
			)}
			{user && user.role === "Student" && (
				<Routes>
					<Route path="/applications" element={<TaApplication user={user} />} />
					<Route path="/feedbacks" element={<FeedbackListStudent user={user} />} />
					<Route path="*" element={<StudentApplications user={user} />} />
				</Routes>
			)}
			{user && user.role === "TA Committee Member" && (
				<Routes>
					<Route
						path="/feedbacks"
						element={<FeedbackListTC setUser={handleSetUser} user={user} />}
					/>
					<Route path="*" element={<TaList />} />
				</Routes>
			)}
			{user && user.role === "Department Staff" && (
				<Routes>
					<Route
						path="/feedbacks"
						element={<FeedbackListDS setUser={handleSetUser} user={user} />}
					/>
					<Route path="/input-new-course" element={<InputCourseDS />} />
					<Route path="*" element={<TAListDS />} />
				</Routes>
			)}
			{user && user.role === "Instructor" && (
				<Routes>
					<Route
						path="/feedback"
						element={<Feedback setUser={handleSetUser} user={user} />}
					/>
					<Route
						path="*"
						element={<FeedbackList setUser={handleSetUser} user={user} />}
					/>
				</Routes>
			)}
		</Router>
	);
};

export default App;
