const typeDefs = `
	type User {
		_id: ID!
		username: String!
		email: String!
		admin: Boolean
		events: [Event]!
		photos: [Photo]!
	}

	type Event {
		_id: ID!
		title: String!
		description: String!
		date: String!
		eventAuthor: String!
		createdAt: String!
		createdBy: User
	}

	type Photo {
		_id: ID!
		date: String!
		photoUrl: String!
		event: Event!
		user: User!
	}

	type Auth {
		token: ID!
		user: User
	}

	type Query {
		users: [User]
		user(username: String!): User
		events(concept: String): [Event]
		seedEvents(concept: String!): [Event]
		event(eventId: ID!): Event
		me: User
		photos(username: String): [Photo]
		photo(photoId: ID!): Photo
		dates: [Date]
	}

	type Date {
		_id: ID!
		date: String!
	}

	type Mutation {
		addUser(username: String!, email: String!, password: String!): Auth
		updateUser(username: String, email: String, password: String): Auth
		login(email: String!, password: String!): Auth
		addAdminEvent(question: String!, answer: String!, concept: String!): Event
		updateAdminEvent(eventId: ID!, question: String!, answer: String!, concept: String!): Event
		removeAdminEvent(eventId: ID!): Event
		addUserEvent(question: String!, answer: String!, concept: String!): Event
		updateUserEvent(eventId: ID!, question: String!, answer: String!, concept: String!): Event
		removeUserEvent(eventId: ID!): Event
		addPhoto(eventId: ID!): Photo
		removePhoto(photoId: ID!): Photo
	}
`;

module.exports = typeDefs;
