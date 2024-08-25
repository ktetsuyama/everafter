const db = require("../config/connection");
const cleanDB = require("./cleanDB");
const { User, Event, Photo } = require("../models");

const eventSeeds = require("./eventSeeds.json");
const userSeeds = require("./userSeeds.json");
const photoSeeds = require("./photoSeeds.json");

const moment = require("moment-timezone");

// Convert date strings to UTC
const convertToUTC = (dateString, timezone) =>
	moment.tz(dateString, timezone).utc().toISOString();

db.once("open", async () => {
	try {
		await cleanDB("Photo", "photos");
		await cleanDB("Event", "events");
		await cleanDB("User", "users");

		// Seed users first
		const users = await User.create(userSeeds);
		console.log("Users seeded successfully");

		// Seed admin user
		const adminUser = await User.findOne({ admin: true });
		if (!adminUser) {
			throw new Error("Admin user not found");
		}
		const adminUserId = adminUser._id;
		console.log("Admin user seeded: ", adminUser.username);

		// Convert event dates to UTC
		const allEventSeeds = eventSeeds.map((event) => ({
			...event,
			date: convertToUTC(event.date, "America/New_York"),
			createdBy: adminUserId,
		}));

		// Seed events
		const createdEvents = await Event.create(allEventSeeds);
		console.log("Events seeded successfully");

		// Log event dates
		console.log(
			"Stored events dates (UTC):",
			createdEvents.map((e) => e.date)
		);

		// Convert photo dates to UTC
		const allPhotoSeeds = photoSeeds.map((photo) => ({
			...photo,
			date: convertToUTC(photo.date, "America/New_York"),
		}));

		// Seed photos
		const createdPhotos = await Photo.create(allPhotoSeeds);

		// Assign photos to users and events
		for (let photoSeed of allPhotoSeeds) {
			const { username, date } = photoSeed;

			console.log("Looking for user with username:", username);
			console.log("Looking for event with date:", date);

			// Find the user based on the photoSeed's username
			const user = users.find((u) => u.username === username);
			if (!user) {
				throw new Error(`User not found for username: ${username}`);
			}

			// Find the event based on the photoSeed's date
			const eventDate = new Date(date);
			const event = createdEvents.find(
				(c) => new Date(c.date).getTime() === eventDate.getTime()
			);
			if (!event) {
				console.error(`Event not found for date: ${date}`);
				console.log(
					"Available event dates:",
					createdEvents.map((e) => e.date)
				);
				throw new Error(`Event not found for date: ${date}`);
			}

			// Create a new Photo instance
			const newPhoto = await Photo.create({
				...photoSeed,
				user: user._id,
				event: event._id,
			});

			// Update user's photos
			await User.findByIdAndUpdate(user._id, {
				$push: { photos: newPhoto._id },
			});

			// Update event's photos
			await Event.findByIdAndUpdate(event._id, {
				$push: { photos: newPhoto._id },
			});

			console.log(
				`Random event from the '${date}' category saved to photos for user ${username}`
			);
		}

		console.log("All data seeded successfully");
		process.exit(0);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
});
