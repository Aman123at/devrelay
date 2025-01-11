import { AUTH_API_BASE_URL } from "@/constants/constants";
import { ILoginPayload, IRegisterPayload } from "@/interfaces/interfaces";
import { extractErrorMessage } from "@/utils/helper";
import axios, { AxiosError } from "axios";

const loginUser = async ({ email, password }: ILoginPayload) => {
  try {
    const result = await axios.post(
      `${AUTH_API_BASE_URL}/login`,
      { email, password },
      { withCredentials: true }
    );
    if (result.status === 200) {
      const data = result.data.data;
      return { ...data, error: null };
    } else {
      return { error: "Something went wrong while login user." };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorMessage = extractErrorMessage(axiosError);
    return { error: errorMessage };
  }
};

const registerUser = async ({
  email,
  username,
  password,
  fullname,
}: IRegisterPayload) => {
  try {
    const result = await axios.post(
      `${AUTH_API_BASE_URL}/register`,
      { email, username, password, fullname },
      { withCredentials: true }
    );
    if (result.status === 200) {
      const data = result.data.data;
      return { ...data, error: null };
    } else {
      return { error: "Something went wrong while register user." };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorMessage = extractErrorMessage(axiosError);
    return { error: errorMessage };
  }
};

const getLoggedInUser = async () => {
  try {
    const result = await axios.get(`${AUTH_API_BASE_URL}/loggedIn`, {
      withCredentials: true,
    });
    if (result.status === 200) {
      const data = result.data.data;
      return { ...data, error: null };
    } else {
      return { error: "Something went wrong while getting loggedIn user." };
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    const errorMessage = extractErrorMessage(axiosError);
    return { error: errorMessage };
  }
};

const logoutUser = async () => {
  try {
    const result = await axios.get(`${AUTH_API_BASE_URL}/logout`, {
      withCredentials: true,
    });
    if (result.status === 200) {
      console.log("User logged out successfully.");
      return true;
    } else {
      console.log("Something went wrong while logout user.");
      return false;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorMessage = extractErrorMessage(axiosError);
    console.log("Something went wrong while logout user.", errorMessage);
    return false;
  }
};

export {loginUser,registerUser,getLoggedInUser,logoutUser}
