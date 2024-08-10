const { User, Event, Photo } = require("../models");

async function addPhoto(userId, eventId) {
	const event = await Event.findById(eventId);
	const photo = await Photo.create({
		event: event._id,
		title: event.title,
		description: event.description,
		date: event.date,
		createdBy: event.createdBy,
	});

	await User.findOneAndUpdate(
		{ _id: userId },
		{ $addToSet: { photos: photo._id } }
	);

	return photo;
}

module.exports = addPhoto;
