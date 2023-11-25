import React from "react";
import {
	Container,
	Typography,
	Grid,
	Box,
	TextField,
	Button,
	Chip,
	Checkbox,
	Select,
	MenuItem,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

const PersonalDetails = ({ personalDetails, onChange }) => {
	return (
		<Container className="shadow-sm py-3">
			<Typography variant="h5" component="h2" className="_heading2">
				PERSONAL DETAILS
			</Typography>
			<Grid container spacing={2}>
				<Grid item xs={5} className="mx-4">
					<Box className="text-center">
						<TextField
							name="username"
							label="Username"
							variant="outlined"
							sx={{ mt: 4 }}
							fullWidth
							value={personalDetails.username}
							disabled
						/>
					</Box>
				</Grid>
				<Grid item xs={5} className="mx-4">
					<Box className="text-center">
						<TextField
							name="name"
							label="Name"
							variant="outlined"
							sx={{ mt: 4 }}
							fullWidth
							value={personalDetails.name}
							onChange={onChange}
						/>
					</Box>
				</Grid>
				<Grid item xs={5} className="mx-4">
					<Box className="text-center">
						<TextField
							name="email"
							label="Email"
							variant="outlined"
							sx={{ mt: 4 }}
							fullWidth
							type="email"
							value={personalDetails.email}
							onChange={onChange}
						/>
					</Box>
				</Grid>
				<Grid item xs={5} className="mx-4">
					<Box className="text-center">
						<TextField
							name="phoneNumber"
							label="Phone Number"
							variant="outlined"
							type="number"
							sx={{ mt: 4 }}
							fullWidth
							value={personalDetails.phoneNumber}
							onChange={onChange}
						/>
					</Box>
				</Grid>
				<Grid item xs={5} className="mx-4">
					<Box className="text-center">
						<TextField
							name="joiningDate"
							label="Joining Date"
							variant="outlined"
							sx={{ mt: 4 }}
							fullWidth
							type="date"
							InputLabelProps={{
								shrink: true,
							}}
							value={personalDetails.joiningDate}
							onChange={onChange}
						/>
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
};

const PreviousTACourses = ({
	previousCourses,
	onChange,
	addCourse,
	checkPreviousCourse,
	setCheckPreviousCourse,
}) => {
	return (
		<Container className="shadow-sm py-3">
			<Box className="d-flex align-items-center">
				<Checkbox
					checked={checkPreviousCourse}
					onChange={(e) => setCheckPreviousCourse(e.target.checked)}
					inputProps={{ "aria-label": "controlled" }}
				/>
				<Typography variant="h5" component="h2" className="_heading2">
					PREVIOUSLY SERVED AS TA
				</Typography>
			</Box>
			{checkPreviousCourse && (
				<>
					{previousCourses.map((input, index) => (
						<Box key={index}>
							<TextField
								label={`TA Service ${index + 1}`}
								variant="outlined"
								sx={{ mt: 2 }}
								value={previousCourses[index]}
								onChange={(e) => onChange(index, e.target.value)}
							/>
						</Box>
					))}
					<Box className="d-flex justify-content-end">
						<Button
							variant="contained"
							color="secondary"
							onClick={() => addCourse([...previousCourses, ""])}
							className="mt-1"
						>
							<AddCircleIcon />
						</Button>
					</Box>
				</>
			)}
		</Container>
	);
};

const EligibleCourses = ({ eligibleCourses, onChange, addCourse, availableCourses }) => {
	return (
		<Container className="shadow-sm py-3">
			<Typography variant="h5" component="h2" className="_heading2">
				ELIGIBLE COURSES
			</Typography>
			{eligibleCourses.map((course, index) => (
				<Box key={index}>
				<Select
					label={`Course ${index + 1}`}
					variant="outlined"
					value={course}
					onChange={(e) => onChange(index, e.target.value)}
					sx={{ mt: 2 }}
				>
					<MenuItem value="Select Course">Select Course</MenuItem>
					{availableCourses?.map((aCourse, index) => (
						<MenuItem key={index} value={aCourse.course}>{aCourse.course}</MenuItem>
					))}
				</Select>
			</Box>
			))}
			<Box className="d-flex justify-content-end">
				<Button
					variant="contained"
					color="secondary"
					onClick={() => addCourse([...eligibleCourses, "Select Course"])}
					className="mt-1"
				>
					<AddCircleIcon />
				</Button>
			</Box>
		</Container>
	);
};

const ResumeUploader = ({ onChange, fileName }) => {
	return (
		<Container className="shadow-sm py-3">
			<Typography variant="h5">UPLOAD YOUR RESUME</Typography>
			<div className="my-3">
				<input
					accept="application/pdf"
					className="form-control"
					id="contained-button-file"
					type="file"
					onChange={onChange}
				/>
			</div>

			{fileName && (
				<Chip
					avatar={<PictureAsPdfIcon />}
					label={fileName}
					className="mb-3"
					style={{ background: "rgba(255,0,0,0.5)" }}
				/>
			)}
		</Container>
	);
};

export { PersonalDetails, PreviousTACourses, EligibleCourses, ResumeUploader };
