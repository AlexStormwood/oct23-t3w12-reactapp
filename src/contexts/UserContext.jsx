import { useState, createContext, useContext } from "react";


const UserDataContext = createContext(null);
const UserDispatchContext = createContext(null);

export function useUserData(){
	return useContext(UserDataContext);
}

export function useUserDispatch(){
	return useContext(UserDispatchContext);
}


export default function UserProvider({children}){

	// Encoded string to send to the backend
	// lets us stay logged in without a password
	const [userJwt, setUserJwt] = useState("");

	// Object of payload data,
	// lets us render data about the user AND
	// make more requests like get user by ID
	const [decodedUserJwt, setDecodedUserJwt] = useState({});

	const makeSignupRequest = async (username, password) => {
		let bodyData = {username, password};
		console.log("Body data to send is: ");
		console.log(bodyData);
		let signUpResult = await fetch("http://localhost:3000/users/", {
			method: "POST",
			body: JSON.stringify(bodyData),
			headers: {
				'Content-Type': 'application/json'
			}
		}).catch(error => console.error(error));

		signUpResult = await signUpResult.json();

		console.log("Sign up result is: " + JSON.stringify(signUpResult));

		// Express route for POST /users/ returns object with JWT as a property
		setUserJwt(signUpResult.jwt);
		setDecodedUserJwt(signUpResult.decodedJwt);
	}

	const makeLoginRequest = async (username, password) => {
		let loginResult = await fetch("http://localhost:3000/users/jwt", {method: "POST",body: {username, password}});

		console.log("Login result is: " + JSON.stringify(loginResult));

		// Express route for POST /users/jwt returns object with JWT as a property
		setUserJwt(loginResult.jwt);
		setDecodedUserJwt(loginResult.decodedUserJwt);
	}


	return <UserDataContext.Provider value={{userJwt, decodedUserJwt}}>
		<UserDispatchContext.Provider value={{
			// functions to make requests to sign up and log in and so on
			makeSignupRequest,
			makeLoginRequest
		}}>
			{children}
		</UserDispatchContext.Provider>
	</UserDataContext.Provider>

}