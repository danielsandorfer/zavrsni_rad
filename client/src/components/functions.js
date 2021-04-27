import axios from "axios";

export const login = user => {
	return axios
		.post("/api/login/login", {
			username: user.username,
			password: user.password
		}).then(response => {
			return response;
		})
		.catch(err => {
			console.log(err);
		});
};

export const register = user => {
	return axios
		.post("/api/login/register", {
			username: user.username,
			name: user.name,
			lastName: user.lastName,
			email: user.email,
			password: user.password
		}).then(response => {
			return response;
		}).catch(e => console.log(e));
}
