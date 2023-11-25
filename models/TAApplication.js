const mongoose = require("mongoose");

const TAApplicationSchema = new mongoose.Schema({
	username: String,
	name: String,
	email: String,
	joiningDate: Date,
	phoneNumber: String,
	resume: String,
	previousCourses: String,
	eligibleCourses: String,
	status: String,
});

const TAApplication = mongoose.model("TAApplication", TAApplicationSchema);

module.exports = TAApplication;
