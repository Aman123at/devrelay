export const POST_API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/post`
export const COMMENTS_API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/comments`
export const PROFILE_API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/profile`
export const AUTH_API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`

export const feedTabs = [
    { value: "recommended", label: "Recommended For you", fetchUrl:`${POST_API_BASE_URL}/all` },
    { value: "following", label: "Following", fetchUrl:`${POST_API_BASE_URL}/followings`  }
]

export const profileTabs = [
  {value: "posts", label: "Posts", fetchUrl:`${PROFILE_API_BASE_URL}/posts`},
  {value: "followings", label: "Followings", fetchUrl:`${PROFILE_API_BASE_URL}/followings`},
  {value: "followers", label: "Followers", fetchUrl:`${PROFILE_API_BASE_URL}/followers`},
]
