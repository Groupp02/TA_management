const mongoose = require("mongoose");

const ReqCourseSchema = new mongoose.Schema({
	course: String,
});

const ReqCourse = mongoose.model("ReqCourse", ReqCourseSchema);

module.exports = ReqCourse;
