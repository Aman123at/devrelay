import { COMMENTS_API_BASE_URL } from "@/constants/constants";
import { extractErrorMessage } from "@/utils/helper";
import axios, { AxiosError } from "axios";

interface ICommentPayload {
    post_id:number;
    content:string;
    parent_id?:number;
    is_top_level?:boolean
}

const addNewComment = async (payload:ICommentPayload) =>{
    try {
      const result = await axios.post(`${COMMENTS_API_BASE_URL}/add`,{...payload},{withCredentials:true})
      if (result.status === 200) {
        return { error: null };
      } else {
        return { error: "Something went wrong while adding comment." };
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = extractErrorMessage(axiosError);
      return { error: errorMessage };
    }
}

const fetchPostComments = async (postId:string, { pageParam = 1 }) =>{
    try {
        const result = await axios.get(`${COMMENTS_API_BASE_URL}/${postId}`,{params:{
            page_no:pageParam
          },withCredentials:true})
        if (result.status === 200) {
            console.log(result.data)
            const data = result.data
          return { ...data,error: null };
        } else {
          return { error: "Something went wrong while fetching comments." };
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        const errorMessage = extractErrorMessage(axiosError);
        return { error: errorMessage };
      }
}

export {addNewComment,fetchPostComments}