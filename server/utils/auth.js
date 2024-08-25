const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.SECRET_KEY;
const expiration = "2h";

class AuthenticationError extends GraphQLError {
	constructor(message) {
		super(message, {
			extensions: {
				code: "UNAUTHENTICATED",
			},
		});
	}
}

module.exports = {
	AuthenticationError,
	authMiddleware: function ({ req }) {
		let token =
			req.body.token || req.query.token || req.headers.authorization;

		if (req.headers.authorization) {
			token = token.split(" ").pop().trim();
		}

		if (!token) {
			return req;
		}

		try {
			const { data } = jwt.verify(token, secret, { maxAge: expiration });
			req.user = data;
		} catch {
			console.log("Invalid token");
		}

		return req;
	},
	signToken: function ({ email, username, _id }) {
		const payload = { email, username, _id };
		return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
	},
};
