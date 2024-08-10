const db = require("../config/connection");
const cleanDB = require("./cleanDB");
const { User, Event, Photo } = require("../models");

const eventSeeds = require("./eventSeeds.json");
const userSeeds = require("./userSeeds.json");
const photoSeeds = require("./photoSeeds.json");

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

		// Map each event seed with the admin user ID for the createdBy field
		const allEventSeeds = [...eventSeeds].map((event) => ({
			...event,
			createdBy: adminUserId,
		}));

		// Seed events
		const createdEvents = await Event.create(allEventSeeds);
		console.log("Events seeded successfully");

		// Seed photos
		const createdPhotos = await Photo.create(photoSeeds);

		// Assign photos to users and events
		for (let photoSeed of photoSeeds) {
			const { username, date } = photoSeed;

			// Find the user based on the photoSeed's username
			const user = users.find((u) => u.username === username);
			if (!user) {
				throw new Error(`User not found for username: ${username}`);
			}

			// Find the event based on the photoSeed's date
			const event = createdEvents.find((c) => c.date === date);
			if (!event) {
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
