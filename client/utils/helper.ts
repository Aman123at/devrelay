import { AxiosError } from "axios";

export const extractErrorMessage = (axiosError: AxiosError) => {
  const errorHtml = axiosError.response?.data as string;
  const parser = new DOMParser();
  const doc = parser.parseFromString(errorHtml, "text/html");
  let errorMessage = "An Unknown Error";
  // Extract the error message from the <pre> tag
  const preTagContent = doc.querySelector("pre");
  if (preTagContent) {
    // Extract only the first line (main error message)
    const rawContent = preTagContent.innerHTML;

    // Split by <br> to get individual lines
    const lines = rawContent.split("<br>");

    // Extract the first line and clean it
    errorMessage = lines[0].replace("Error: ", "").trim();
  }
  return errorMessage;
};


export const convertStringToNumber = (str: string) : number | null =>{
    try {
        return parseInt(str,10)
    } catch (error) {
        console.log("Unable to convert postid string to integer",error)
        return null
    }
}