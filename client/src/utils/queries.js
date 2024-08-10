import { gql } from "@apollo/client";

export const QUERY_ME = gql`
	query me {
		me {
			_id
			username
			email
			photos {
				_id
				date
				photoURL
			}
			events {
				_id
				date
				title
				story
			}
		}
	}
`;

export const QUERY_USER = gql`
	query user($username: String!) {
		user(username: $username) {
			_id
			username
			email
			photos {
				_id
				photoURL
			}
			events {
				_id
				date
				title
				story
			}
		}
	}
`;

export const QUERY_PHOTO = gql`
	query GetPhotos($photoId: ID!) {
		photos(photo: $photoId) {
			_id
		}
	}
`;

export const QUERY_EVENT = gql`
	query GetEvents {
		events {
			_id
			date
			title
			event
		}
	}
`;
