import React, { useState } from "react";
import { UPDATE_USER_EVENT } from "../utils/mutations";
import { useMutation } from "@apollo/client";

const UpdateEventForm = ({ eventToUpdate, onUpdate, onCancel, userId }) => {
	const [formState, setFormState] = useState({
		date: eventToUpdate.date || "",
		title: eventToUpdate.title || "",
		description: eventToUpdate.description || "",
	});

	const [errors, setErrors] = useState({
		date: "",
		title: "",
		description: "",
	});

	const [updateEvent] = useMutation(UPDATE_USER_EVENT);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormState({ ...formState, [name]: value });

		// Clear errors when user starts typing
		if (name === "date") {
			setErrors({ ...errors, date: "" });
		} else if (name === "title") {
			setErrors({ ...errors, title: "" });
		} else if (name === "description") {
			setErrors({ ...errors, description: "" });
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newErrors = {};

		if (formState.date.trim() === "") {
			newErrors.date = "Please enter a date.";
		}

		if (formState.title.trim() === "") {
			newErrors.title = "Please enter a title.";
		}

		if (formState.description.trim() === "") {
			newErrors.description = "Please enter an description.";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		try {
			const { data } = await updateEvent({
				variables: {
					eventId: eventToUpdate._id,
					title: formState.title,
					description: formState.description,
					date: formState.date.toLowerCase(),
				},
			});

			onUpdate(data.updateUserEvent); // Pass the updated event data up to the parent component
		} catch (error) {
			console.error("Error updating event:", error);
		}
	};

	return (
		<div className="form-container event w-50">
			<h4 className="card-header bg-primary text-primary p-2 pl-3">
				Update This Event
			</h4>
			<form className="card-body px-3" onSubmit={handleSubmit}>
				<div className="form-fields">
					<label>Concept:</label>
					<input
						type="text"
						name="date"
						value={formState.date}
						onChange={handleChange}
					/>
					{errors.date && <p className="error-text">{errors.date}</p>}
				</div>
				<div className="form-fields">
					<label>Title:</label>
					<input
						type="text"
						name="title"
						value={formState.title}
						onChange={handleChange}
					/>
					{errors.title && (
						<p className="error-text">{errors.title}</p>
					)}
				</div>
				<div className="form-fields">
					<label>Answer:</label>
					<input
						type="text"
						name="description"
						value={formState.description}
						onChange={handleChange}
					/>
					{errors.description && (
						<p className="error-text">{errors.description}</p>
					)}
				</div>
				<button
					type="submit"
					className="btn btn-md btn-primary text-primary mt-3 mb-1 nav-btn w-100"
				>
					Submit
				</button>
				<button
					type="button"
					className="btn btn-md btn-danger text-primary mt-1 mb-2 nav-btn w-100"
					onClick={onCancel}
				>
					Cancel
				</button>
			</form>
		</div>
	);
};

export default UpdateEventForm;
