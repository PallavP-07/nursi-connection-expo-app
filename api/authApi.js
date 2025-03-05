import axios from "axios";

const BASE_URL = "https://nursi.webiknows.in/api";

export const loginAPI = async ({email, password}) => {
  console.log(email,password)
    try {
      const response = await axios.post(`${BASE_URL}/nurse/login`, {
        email,
        password,
      });
      if (response.data?.status === false) {
        throw new Error(response.data?.message || "Invalid login credentials");
      }
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  };