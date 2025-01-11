package models

import "time"

type CommentRequest struct {
	PostID     int    `json:"post_id" binding:"required"`
	ParentID   int    `json:"parent_id"`
	Content    string `json:"content" binding:"required"`
	IsTopLevel bool   `json:"is_top_level"`
	UserID     int
	UserName   string
	FullName   string
	AvatarUrl  string
}

type Comment struct {
	ID        int       `json:"id"`
	ParentID  *int      `json:"parent_id"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
	Depth     int       `json:"depth"`
}

type Reply struct {
	CommentID int    `json:"commentId"`
	Content   string `json:"content"`
	UserID    int    `json:"user_id"`
	UserName  string `json:"username"`
	FullName  string `json:"fullname"`
	AvatarUrl string `json:"avatar_url"`
	UpdatedAt string `json:"updated_at"`
}

type CommentRow struct {
	CommentID  int     `json:"commentId"`
	Content    string  `json:"content"`
	IsTopLevel bool    `json:"is_top_level"`
	PostID     int     `json:"post_id"`
	UserID     int     `json:"user_id"`
	UserName   string  `json:"username"`
	FullName   string  `json:"fullname"`
	AvatarUrl  string  `json:"avatar_url"`
	UpdatedAt  string  `json:"updated_at"`
	Replies    []Reply `json:"replies"`
}
