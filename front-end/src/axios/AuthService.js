import axios from "axios";

class AxiosService {
  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:9000",
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        // Add auth token or other headers if needed
        const token = localStorage.getItem("authToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  register = async (user, login) => {
    try {
      await this.api.post("/register", user);
      login();
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  };

  createProfile = async (profile) => {
    const userId = await this.getUserId(profile.username);
    profile = {
      userId: userId,
      userName: profile.username,
      email: profile.email,
    };
    try {
      await this.api.post(`/profile/add`, profile);
    } catch (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
  };

  login = async (user, login, userName) => {
    try {
      await this.api.post("/login", user);
      login();
      const userId = await this.getUserId(user.username);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  getUserId = async (userName) => {
    try {
      const response = await this.api.get(`/users/${userName}`);
      return response.data.id;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      throw error;
    }
  };

  logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("authToken");
  };
}

const axiosServiceInstance = new AxiosService();
export default axiosServiceInstance;
