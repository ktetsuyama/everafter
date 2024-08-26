import React, { useState } from "react";

const CreateEventForm = ({ onCreate, onCancel }) => {
	const [formState, setFormState] = useState({
		date: "",
		title: "",
		description: "",
	});
	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormState({ ...formState, [name]: value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const newErrors = {};

		if (formState.date.trim() === "") {
			newErrors.date = "Please enter a date.";
		}

		if (formState.title.trim() === "") {
			newErrors.title = "Please enter a title.";
		}

		if (formState.description.trim() === "") {
			newErrors.description = "Please enter a description.";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		const formStateToSubmit = {
			...formState,
			date: formState.date.toLowerCase(),
		};

		onCreate(formStateToSubmit);
	};

	return (
		<div className="form-container card w-50">
			<h4 className="card-header bg-primary text-primary p-2 pl-3">
				Create a New Event
			</h4>
			<form className="card-body px-3" onSubmit={handleSubmit}>
				<div className="form-fields">
					<label>Date:</label>
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
					<label>Description:</label>
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

export default CreateEventForm;
