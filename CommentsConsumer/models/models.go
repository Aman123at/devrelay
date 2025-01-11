package models

type Comment struct {
	PostID     int    `json:"post_id" binding:"required"`
	ParentID   int    `json:"parent_id"`
	Content    string `json:"content" binding:"required"`
	IsTopLevel bool   `json:"is_top_level"`
	UserID     int    `json:"userId"`
	UserName   string `json:"username"`
	FullName   string `json:"fullname"`
	AvatarUrl  string `json:"avatar_url"`
}
