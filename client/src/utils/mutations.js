import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
	mutation login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
			user {
				_id
				username
				photos {
					_id
				}
				events {
					_id
					date
					title
					description
				}
			}
		}
	}
`;

export const ADD_USER = gql`
	mutation addUser($username: String!, $email: String!, $password: String!) {
		addUser(username: $username, email: $email, password: $password) {
			token
			user {
				_id
				username
			}
		}
	}
`;

export const UPDATE_USER = gql`
	mutation updateUser($username: String, $email: String, $password: String) {
		updateUser(username: $username, email: $email, password: $password) {
			token
			user {
				_id
				username
				photos {
					_id
				}
				events {
					_id
					date
					title
					description
				}
			}
		}
	}
`;

export const ADD_PHOTO = gql`
  mutation addPhoto() {
    addPhoto(photoId: $photoId) {
      _id
    }
  }
`;

export const REMOVE_PHOTO = gql`
	mutation RemovePhoto($photoId: ID!) {
		removePhoto(photoId: $photoId) {
			_id
		}
	}
`;

export const ADD_EVENT = gql`
	mutation addEvent($date: String!, $title: String!, $description: String!) {
		addEvent(date: $date, title: $title, description: $description) {
			_id
			date
			title
			description
		}
	}
`;

export const UPDATE_EVENT = gql`
	mutation UpdateEvent(
		$eventId: ID!
		$date: String!
		$title: String!
		$description: String!
	) {
		updateUserEvent(date: $date, title: $title, description: $description) {
			_id
			date
			title
			description
		}
	}
`;

export const REMOVE_EVENT = gql`
	mutation RemoveEvent($eventId: ID!) {
		removeEvent(eventId: $eventId) {
			_id
			date
			title
			description
		}
	}
`;
