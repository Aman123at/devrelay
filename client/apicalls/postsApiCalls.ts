import { POST_API_BASE_URL } from "@/constants/constants";
import { extractErrorMessage } from "@/utils/helper";
import axios, { AxiosError } from "axios";

const fetchPosts = async (fetchUrl: string, { pageParam = 1 }) => {
  try {
    const result = await axios.get(fetchUrl,{
      params:{
        page_no:pageParam
      },
      withCredentials:true
    })
    if (result.status === 200) {
      const data = result.data.data;
      return { posts: data.posts};
    } else {
      return { error: "Something went wrong while getting presigned url." };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorMessage = extractErrorMessage(axiosError);
    console.log(errorMessage)
    return { error: errorMessage };
  }
};

const uploadToCloudinary = async (url:string, formData:FormData) =>{
  try {
    const result = await axios.post(url
      ,formData, {
        headers:{
          "Content-Type":"multipart/form-data"
        }
      })
    if (result.status === 200) {
      return { data: result.data ,error: null };
    } else {
      return { error: "Something went wrong while getting presigned url." };
    }
  } catch (error) {
    console.log(error)
    return { error };
  }
}

const getPresignedURL = async () =>{
  try {
    const result = await axios.get(`${POST_API_BASE_URL}/getPreSignedUrl`,{withCredentials:true})
    if (result.status === 200) {
      const data = result.data.data;
      return { ...data, error: null };
    } else {
      return { error: "Something went wrong while getting presigned url." };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorMessage = extractErrorMessage(axiosError);
    return { error: errorMessage };
  }
}

const createPost = async ({image_url,description,userId,username,fullname}:any) =>{
  try {
    const result = await axios.post(`${POST_API_BASE_URL}/create`,{image_url,description,userId,username,fullname},{withCredentials:true})
    if (result.status === 200) {
      const data = result.data.data;
      return { ...data, error: null };
    } else {
      return { error: "Something went wrong while creating post." };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorMessage = extractErrorMessage(axiosError);
    return { error: errorMessage };
  }
}

const getPostDetail = async (postId:number) => {
  try {
    const result = await axios.get(`${POST_API_BASE_URL}/detail/${postId}`,{withCredentials:true})
    if (result.status === 200) {
      const data = result.data.data;
      return { ...data, error: null };
    } else {
      return { error: "Something went wrong while creating post." };
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorMessage = extractErrorMessage(axiosError);
    return { error: errorMessage };
  }
}

export { fetchPosts, createPost, getPresignedURL, uploadToCloudinary, getPostDetail };
