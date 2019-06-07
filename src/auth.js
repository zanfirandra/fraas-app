import axios from "axios";

// set Authorization header interceptor
axios.interceptors.request.use(function(config) {
  const token = authService.getToken();
  config.headers.Authorization = token;

  return config;
});

axios.interceptors.response.use(
  function(response) {
    debugger;
    console.log("axios response intercept", response);
    return response;
  },
  function(error) {
    if (error.message) {
      alert("Servers are down. " + error.message + ". Please try again");
      console.log("axios response intercept", error);
      return Promise.reject(error);
    }
  }
);

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
  performLivenessDetection: async imageData => {
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      }
    };
    let imageToDetect = {
      image: imageData
    };
    let response = await axios.post(
      "http://127.0.0.1:2000/liveness",
      imageToDetect,
      axiosConfig
    );
    console.log(response.data);
    if (typeof response.data === "boolean") {
      if (response.data)
        return "Passed liveness detection! You can now go to the next step.";
      else
        return "Failed liveness detection! Please do not try to impersonate someone!";
    } else return response.data.error;
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
