const { User, Event, Photo } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

// Util function to allow addPhoto to be used in mutation resolver & seeders/seed.js
// const addPhoto = require("../utils/photos");

const resolvers = {
	Query: {
		users: async () => {
			return User.find().populate("events").populate("photos");
		},
		user: async (parent, { username }) => {
			const user = await User.findOne({ username })
				.populate("events")
				.populate("photos");

			// Fetch seed events
			const seedEvents = await Event.find({ eventAuthor: "seed" });

			return {
				...user.toObject(),
				events: [...user.events, ...seedEvents],
			};
		},
		events: async (parent, { date }) => {
			const query = date ? { date } : {};
			return Event.find(query)
				.sort({ createdAt: -1 })
				.populate("createdBy");
		},
		seedEvents: async (parent, { date }) => {
			return Event.find({ date, eventAuthor: "seed" })
				.sort({ createdAt: -1 })
				.populate("createdBy");
		},
		event: async (parent, { eventId }) => {
			return Event.findById(eventId).populate("createdBy");
		},
		me: async (parent, args, context) => {
			if (context.user) {
				const user = await User.findOne({ _id: context.user._id })
					.populate({
						path: "events",
						populate: { path: "createdBy" },
					})
					.populate({
						path: "photos",
						populate: { path: "event" },
					});

				// Fetch seed events
				const seedEvents = await Event.find({ eventAuthor: "seed" });

				return {
					...user.toObject(),
					events: [...user.events, ...seedEvents],
				};
			}
			throw new AuthenticationError("You need to be logged in!");
		},
		photos: async (parent, args, context) => {
			if (!context.user) {
				throw new AuthenticationError("You need to be logged in!");
			}

			const user = await User.findById(context.user._id).populate({
				path: "photos",
				populate: {
					path: "event",
				},
			});

			return user.photos;
		},
		photo: async (parent, { photoId }) => {
			return Photo.findById(photoId);
		},
		dates: async () => {
			try {
				const uniqueConcepts = await Event.distinct("date");
				return uniqueConcepts.map((date) => ({
					_id: date,
					date,
				}));
			} catch (err) {
				console.error("Error fetching dates:", err);
				throw err;
			}
		},
	},
	Mutation: {
		addUser: async (parent, { username, email, password }) => {
			const user = await User.create({ username, email, password });
			const token = signToken(user);
			return { token, user };
		},
		login: async (parent, { email, password }) => {
			const user = await User.findOne({ email });
			if (!user) {
				throw new AuthenticationError(
					"No user found with this email address"
				);
			}
			const correctPw = await user.isCorrectPassword(password);
			if (!correctPw) {
				throw new AuthenticationError("Incorrect credentials");
			}
			const token = signToken(user);
			return { token, user };
		},
		updateUser: async (parent, { username, email, password }, context) => {
			if (!context.user) {
				throw new AuthenticationError("You need to be logged in!");
			}

			const updateData = {};
			if (username) updateData.username = username;
			if (email) updateData.email = email;
			if (password) updateData.password = password;

			const user = await User.findOneAndUpdate(
				{ _id: context.user._id },
				{ $set: updateData },
				{ new: true }
			);

			const token = signToken(user);
			return { token, user };
		},
		addAdminEvent: async (
			parent,
			{ title, description, date },
			context
		) => {
			// Check if the user is authenticated
			if (!context.user) {
				throw new AuthenticationError("You need to be logged in!");
			}

			const events = await Event.find().populate("createdBy");

			// Verify that the user has admin privileges
			const user = await User.findById(context.user._id);
			if (!user || !user.admin) {
				throw new Error(
					"You do not have the necessary permissions to perform this action!"
				);
			}

			// Create the event
			const event = await Event.create({
				title,
				description,
				date,
				eventAuthor: "seed",
				createdBy: context.user._id,
			});

			// Update the user's events
			await User.findOneAndUpdate(
				{ _id: context.user._id },
				{ $addToSet: { events: event._id } }
			);

			return event;
		},
		updateAdminEvent: async (
			parent,
			{ eventId, title, description, date },
			context
		) => {
			// Check if the user is authenticated
			if (!context.user) {
				throw new AuthenticationError("You need to be logged in!");
			}

			// Verify that the user has admin privileges
			const user = await User.findById(context.user._id);
			if (!user || !user.admin) {
				// Assuming there is an isAdmin field in the User model
				throw new Error("You must be an admin to do this");
			}

			// Check if the event exists
			const event = await Event.findById(eventId);
			if (!event) {
				throw new Error(`Event with ID ${eventId} not found`);
			}

			// Update the event
			event.title = title;
			event.description = description;
			event.date = date;
			const updatedEvent = await event.save();

			return updatedEvent;
		},
		removeAdminEvent: async (parent, { eventId }, context) => {
			// Check if the user is authenticated
			if (!context.user) {
				throw new AuthenticationError("You need to be logged in!");
			}

			// Verify that the user has admin privileges
			const user = await User.findById(context.user._id);
			if (!user || !user.admin) {
				throw new Error("You must be an admin to do this");
			}

			try {
				// Find the event and ensure it was authored by the current user
				const event = await Event.findOneAndDelete({
					_id: eventId,
					createdBy: context.user._id,
				});

				if (!event) {
					throw new UserInputError(
						`Event with ID ${eventId} not found or you do not have permission to delete it`
					);
				}

				// Remove the event reference from the user's list of events
				await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $pull: { events: event._id } }
				);

				return event;
			} catch (error) {
				throw new Error(`Failed to delete event: ${error.message}`);
			}
		},
		addUserEvent: async (parent, { title, description, date }, context) => {
			// Check if the user is authenticated
			if (!context.user) {
				throw new AuthenticationError("You need to be logged in!");
			}

			const events = await Event.find().populate("createdBy");

			// Create the event
			const event = await Event.create({
				title,
				description,
				date,
				eventAuthor: context.user.username,
				createdBy: context.user._id,
			});

			// Update the user's events
			await User.findOneAndUpdate(
				{ _id: context.user._id },
				{ $addToSet: { events: event._id } }
			);

			return event;
		},
		updateUserEvent: async (
			parent,
			{ eventId, title, description, date },
			context
		) => {
			// Check if the user is authenticated
			if (!context.user) {
				throw new AuthenticationError("You need to be logged in!");
			}

			// Check if the event exists
			const event = await Event.findById(eventId);
			if (!event) {
				throw new Error(`Event with ID ${eventId} not found`);
			}

			// Update the event
			event.title = title;
			event.description = description;
			event.date = date;
			const updatedEvent = await event.save();

			return updatedEvent;
		},
		removeUserEvent: async (parent, { eventId }, context) => {
			// Check if the user is authenticated
			if (!context.user) {
				throw new AuthenticationError("You need to be logged in!");
			}

			try {
				// Find the event and ensure it was authored by the current user
				const event = await Event.findOneAndDelete({
					_id: eventId,
					createdBy: context.user._id,
				});

				if (!event) {
					throw new UserInputError(
						`Event with ID ${eventId} not found or you do not have permission to delete it`
					);
				}

				// Remove the event reference from the user's list of events
				await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $pull: { events: event._id } }
				);

				return event;
			} catch (error) {
				throw new Error(`Failed to delete event: ${error.message}`);
			}
		},
		addPhoto: async (parent, { eventId }, context) => {
			if (context.user) {
				const event = await Event.findById(eventId);
				const photo = await Photo.create({
					event: event._id,
					user: context.user._id,
					title: event.title,
					description: event.description,
					date: event.date,
				});
				await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $addToSet: { photos: photo._id } }
				);
				return photo;
			}
			throw new AuthenticationError(
				"Please log in to perform this action."
			);
		},
		removePhoto: async (parent, { photoId }, context) => {
			if (context.user) {
				const photo = await Photo.findOneAndDelete({
					_id: photoId,
					user: context.user._id,
				});
				await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $pull: { photos: photo._id } }
				);
				return photo;
			}
			throw new AuthenticationError(
				"Please log in to perform this action."
			);
		},
	},
	User: {
		events: async (user) => {
			return Event.find({ createdBy: user._id });
		},
		photos: async (user) => {
			return Photo.find({ user: user._id });
		},
	},
	Event: {
		createdBy: async (event) => {
			return User.findById(event.createdBy);
		},
	},
	Photo: {
		event: async (photo) => {
			return Event.findById(photo.event);
		},
		user: async (photo) => {
			return User.findById(photo.user);
		},
	},
};

module.exports = resolvers;
