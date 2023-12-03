import React, { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Badge, Box } from "@mui/material";
import { Notifications } from "@mui/icons-material";
import "../styles/Notifications.css";

const NotificationComponent = ({ user }) => {
	const [notifs, setNotifs] = useState([]);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const fetchNotifs = async () => {
			if (user.role === "Student") {
				const res = await axios.get(`/api/notifications/${user.username}`);
				setNotifs(res.data);
			} else {
				const res = await axios.get(`/api/notifications/user/${user.role}`);
				setNotifs(res.data);
			}
		};

		fetchNotifs();
	}, [user]);

	const deleteNotification = async (index) => {
		await axios.delete(`/api/notifications/${notifs[index]._id}`);
		setNotifs((prev) => prev.filter((notif) => notif._id !== notifs[index]._id));
	};

	return (
		<Box className="notifContainer">
			<Badge badgeContent={notifs.length} color="primary">
        <Notifications
          className="fs-2"
          style={{ cursor: "pointer" }}
          onClick={() => setOpen(!open)}
        />
      </Badge>
			{open && (
				<Box className="alertContainer">
					{notifs.map((notif, index) => (
						<Alert
							key={index}
							severity="info"
							className="alertBox"
							onClose={() => deleteNotification(index)}
						>
							{notif.message}
						</Alert>
					))}
				</Box>
			)}
		</Box>
	);
};

export default NotificationComponent;
