const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
		eventAuthor: {
			type: String,
			default: "seed", // Indicates this is a seed event
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		toJSON: {
			virtuals: true,
		},
	}
);

const Event = model("Event", eventSchema);

module.exports = Event;
