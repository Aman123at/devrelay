export interface ITab {
    value: string;
    label: string;
    fetchUrl: string;
}

export interface IUser {
  id:number;
  avatar_url:string;
  city:string;
  country:string;
  created_at:string;
  email:string;
  fullname:string;
  login_type:string;
  role:string;
  state:string;
  updated_at:string;
  username:string;
}

export interface IAuthApiResponse {
  accessToken:string;
  user: IUser;
  error?:string | null;
}

export interface ILoginPayload {
  email:string;
  password:string;
}

export interface IRegisterPayload {
  email:string;
  username:string;
  password:string;
  fullname:string;
}

export interface IPost {
  comments:number;
  created_at:string;
  description:string;
  image_url:string;
  likes:number;
  postid:number;
  updated_at:string;
  userid:string;
  username:string;
  fullname:string;
  avatar_url:string;
  navigation?:boolean;
}