import axios from "axios";

// set Authorization header interceptor
axios.interceptors.request.use(function(config) {
  const token = authService.getToken();
  config.headers.Authorization = token;

  return config;
});

export const authService = {
  sendDataforAuth: async userInfo => {
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      }
    };
    let response = await axios.post(
      "http://127.0.0.1:2000/image",
      userInfo,
      axiosConfig
    );
    console.log("sent data for auth : response from /image", response.data);

    if (response.status === 200 && response.data !== undefined) {
      if (response.data.error) {
        return response.data.error;
      } else {
        authService.setToken(response.data.token);
        return true;
      }
    }
  },
  accessPrivateResources: async () => {
    const response = await axios.get("/third-party");
    return response.data;
  },
  setToken: idToken => {
    // Saves user token to localStorage
    localStorage.setItem("id_token", idToken);
  },
  getToken: () => {
    // Retrieves the user token from localStorage
    return localStorage.getItem("id_token");
  },
  logoutUser: () => {
    // Clear user token and profile data from localStorage
    localStorage.removeItem("id_token");
  }
};
