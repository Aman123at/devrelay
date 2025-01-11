package database

import (
	"log"

	"github.com/Aman123at/devrelay/commentsconsumer/models"
)

var DbConnPool *connPool

func InsertComment(comment models.Comment) {
	conn, poolerr := DbConnPool.Get()
	defer DbConnPool.Put(conn)
	if poolerr != nil {
		log.Println("Unable to get connection from pool")
	}

	query := `
        INSERT INTO comments (post_id, user_id, parent_comment_id, content, is_top_level, username, fullname, avatar_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `
	_, err := conn.dbInstance.Exec(query, comment.PostID, comment.UserID, getParentId(comment.ParentID, comment.IsTopLevel), comment.Content, comment.IsTopLevel, comment.UserName, comment.FullName, comment.AvatarUrl)
	if err != nil {
		log.Println("Unable to insert comment", err.Error())
	}

}

func getParentId(parentId int, isTopLevel bool) any {
	if isTopLevel {
		return nil
	}
	return parentId
}
