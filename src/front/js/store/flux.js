const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			auth: false,
			email: null,
			errorMessage: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			signUp: (email, password) => {
				console.log('signup desde Flux')
				const requestOptions = {
					method: 'POST',
					headers: { 'Content-Type': "application/json" },
					body: JSON.stringify({
						"email": email,
						"password": password
					})
				};
				fetch(process.env.BACKEND_URL + "api/signup", requestOptions)
					.then(response => {
						if (response.ok) {
							return response.json();
						} else {
							throw new Error("User already exists"); 
						}
					})
					.then(data => {
						setStore({ auth: true, email: email });
						localStorage.setItem("token", data.access_token);
					})
					.catch(error => {
						console.error("There was an error!", error);
						setStore({ errorMessage: error.message }); 
					});
			},

			login: async (email, password) => {
				try {
					// Verificar usuario mediante GET
					const checkResponse = await fetch(`${process.env.BACKEND_URL}api/check_user?email=${email}`, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json'
						}
					});
					if (!checkResponse.ok) {
						const errorData = await checkResponse.json();
						throw new Error(errorData.message || 'User does not exist');
					}
			
					// Intentar iniciar sesión mediante POST
					const response = await fetch(`${process.env.BACKEND_URL}api/login`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ email, password })
					});
					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.message || 'Invalid email or password');
					}
					
					const data = await response.json();
					setStore({ auth: true, email: email });
					localStorage.setItem('token', data.access_token);
				} catch (error) {
					setStore({ errorMessage: error.message });
				}
			},

			verifyToken: () => {
				try {
					const token = localStorage.getItem("token");
					setStore({ auth: !!token });
				} catch (error) {
					console.error("Error al verificar el token:", error);
				}
			},

			logout: () => {
				console.log("log out desde flux");
				localStorage.removeItem("token");
				setStore({ auth: false });
			},

					
		
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
