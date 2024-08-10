const { Schema, model } = require("mongoose");

const photoSchema = new Schema({
	date: {
		type: String,
		required: true,
	},
	photoUrl: {
		type: String,
		required: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	event: {
		type: Schema.Types.ObjectId,
		ref: "Event",
	},
	photoAuthor: {
		type: String,
		default: "seed", // Indicates this is a seed photo
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
});

const Photo = model("Photo", photoSchema);

module.exports = Photo;
