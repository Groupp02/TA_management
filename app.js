const express = require("express");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const connectDB = require("./db/connect");
const TAApplication = require("./models/TAApplication");
const User = require("./models/User");
const ReqCourse = require("./models/ReqCourse");
const Feedback = require("./models/Feedbacks");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "./Frontend/build")));

const jwt_secret = process.env.JWTSECRET;
const PORT = process.env.PORT || 3000;

connectDB();

// Route to handle session validation
app.get("/api/validate-session", async (req, res) => {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).send("No token provided");
	}

	try {
		const decoded = jwt.verify(token, jwt_secret);

		const user = await User.findOne({
			_id: decoded.userId,
			"tokens.token": token,
		});
		if (!user) {
			return res.status(401).send("Invalid session");
		}

		res.json({ user: { username: user.username, role: user.role } });
	} catch (error) {
		res.status(401).send("Invalid token");
	}
});

// Route to handle the signup
app.post("/api/signup", async (req, res) => {
	const { username, password, role } = req.body;

	try {
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).send("User already exists");
		}
		const user = new User({ username, password, role });
		const token = jwt.sign({ userId: user._id }, jwt_secret, {
			expiresIn: "30h",
		});
		user.tokens = user.tokens.concat({ token });
		await user.save();

		res
			.cookie("token", token, {
				httpOnly: true,
			})
			.send({ username: user.username, role: user.role });
	} catch (error) {
		console.error("Signup error:", error);
		res.status(500).send("Error signing up");
	}
});

// Route to handle the login
app.post("/api/login", async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(401).send("Invalid credentials");
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).send("Invalid credentials");
		}
		const token = jwt.sign({ userId: user._id }, jwt_secret, {
			expiresIn: "30h",
		});

		user.tokens = user.tokens.concat({ token });
		await user.save();

		res
			.cookie("token", token, {
				httpOnly: true,
			})
			.send({ username: user.username, role: user.role });
	} catch (error) {
		res.status(500).send("Server error");
	}
});

// Route to handle the logout
app.post("/api/logout", async (req, res) => {
	const token = req.cookies.token;
	if (!token) {
		return res.status(400).send("No token provided");
	}
	try {
		const decoded = jwt.verify(token, jwt_secret);
		await User.updateOne(
			{ _id: decoded.userId },
			{ $pull: { tokens: { token } } }
		);
		res.clearCookie("token").send("Logged out successfully");
	} catch (error) {
		res.status(500).send("Logout failed");
	}
});

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// Route to handle TA Application form submission
app.post("/api/ta-application", upload.single("resume"), async (req, res) => {
	const applicationData = req.body;
	applicationData.resume = req.file.path;

	console.log(applicationData);

	const application = new TAApplication(applicationData);
	console.log(application);
	try {
		const result = await application.save();
		res.status(201).json(result);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Server error" });
	}
});

// Route to get all the application forms
app.get("/api/ta-applications", async (req, res) => {
	try {
		const applications = await TAApplication.find();
		res.json(applications);
	} catch (error) {
		console.error("Error fetching TA applications:", error);
		res.status(500).json({ message: "Error fetching TA applications" });
	}
});

// Route to get all the application forms for a particular student
app.get("/api/applications", async (req, res) => {
	const token = req.cookies.token;
	if (!token) {
		return res.status(401).send("No token provided");
	}

	try {
		const decoded = jwt.verify(token, jwt_secret);
		const user = await User.findOne({
			_id: decoded.userId,
			"tokens.token": token,
		});
		if (!user) {
			return res.status(401).send("Invalid session");
		}
		const applications = await TAApplication.find({ username: user.username });
		res.json({ applications });
	} catch (error) {
		console.error("Error fetching TA applications:", error);
		res.status(500).json({ message: "Error fetching TA applications" });
	}
});

// Create a POST route to fetch applications with at least one "Accepted" status
app.get("/api/getAcceptedApplications", async (req, res) => {
	try {
		const acceptedApplications = await TAApplication.find({
			status: { $regex: /Accepted/, $options: "i" },
		});

		res.status(200).json(acceptedApplications);
	} catch (error) {
		console.error("Error fetching accepted applications:", error);
		res
			.status(500)
			.json({
				error: "An error occurred while fetching accepted applications",
			});
	}
});

// Route to change the status of an application
app.post("/api/application/changeStatus", async (req, res) => {
	try {
		const { newStatus, appId, index } = req.body;
		console.log({ newStatus, appId, index });
		const application = await TAApplication.findById(appId);
		console.log(application.status);
		const statusArray = application.status.split(",");
		statusArray[index] = newStatus;
		const newStatusArray = statusArray.join(",");
		application.status = newStatusArray;
		await application.save();

		res.json({ message: "Status changed successfully", newStatus });
	} catch (error) {
		console.error("Error changing status:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

// Route to download resume file
app.get("/api/download-resume/:filename", (req, res) => {
	const filename = req.params.filename;
	const fileDirectory = path.join(__dirname, "uploads");
	const filePath = path.join(fileDirectory, filename);

	console.log(filePath);

	if (fs.existsSync(filePath)) {
		res.setHeader("Content-Disposition", "attachment; filename=" + filename);

		const readStream = fs.createReadStream(filePath);
		readStream.pipe(res);
	} else {
		res.status(404).send("File not found");
	}
});

// Route to add a course requirement to the database
app.post("/api/add-course", async (req, res) => {
	try {
		const { course } = req.body;

		if (!course) {
			return res.status(400).json({ message: "Course name is required" });
		}

		const newReqCourse = new ReqCourse({ course });
		await newReqCourse.save();

		return res
			.status(201)
			.json({ message: "Course requirement added successfully" });
	} catch (error) {
		console.error("Error adding course requirement:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

// Route to get all the required courses
app.get("/api/req-courses", async (req, res) => {
	try {
		const reqCourses = await ReqCourse.find();

		return res.status(200).json(reqCourses);
	} catch (error) {
		console.error("Error retrieving reqCourses:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

// Create a POST route for storing feedback
app.post("/api/createFeedback", async (req, res) => {
	try {
		const { username, name, email, course, feedback } = req.body;

		const newFeedback = new Feedback({
			username,
			name,
			email,
			course,
			feedback,
		});

		await newFeedback.save();

		res.status(201).json({ message: "Feedback created successfully" });
	} catch (error) {
		console.error("Error creating feedback:", error);
		res
			.status(500)
			.json({ error: "An error occurred while creating feedback" });
	}
});

// Create a GET route to fetch all feedbacks
app.get("/api/getAllFeedbacks", async (req, res) => {
	try {
		const feedbacks = await Feedback.find();

		res.status(200).json(feedbacks);
	} catch (error) {
		console.error("Error fetching feedbacks:", error);
		res
			.status(500)
			.json({ error: "An error occurred while fetching feedbacks" });
	}
});

// Route to handle frontend
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "./Frontend/build", "index.html"));
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
