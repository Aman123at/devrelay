package database

import (
	"database/sql"
	"encoding/json"
	"errors"
	"log"

	"github.com/Aman123at/devrelay/comments/models"
)

var DbConnPool *connPool

func InitializeTables() {
	conn, poolerr := DbConnPool.Get()
	defer DbConnPool.Put(conn)
	if poolerr != nil {
		log.Println("Unable to get connection from pool")
		return
	}
	commentQuery := `CREATE TABLE IF NOT EXISTS comments (
				id SERIAL PRIMARY KEY,
				post_id INT NOT NULL,
				user_id INT NOT NULL,
				parent_comment_id INT REFERENCES comments(id) ON DELETE CASCADE,
				content TEXT NOT NULL,
				is_top_level BOOLEAN DEFAULT false,
				username VARCHAR(255) NOT NULL DEFAULT '',
				fullname TEXT NOT NULL DEFAULT '',
				avatar_url TEXT NOT NULL DEFAULT '',
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)`
	reactionQuery := `CREATE TABLE IF NOT EXISTS comment_reactions (
					id SERIAL PRIMARY KEY,
					comment_id INT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
					user_id INT NOT NULL,
					reaction_type VARCHAR(20) NOT NULL,
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					UNIQUE (comment_id, user_id)
				)`

	tx, err := conn.dbInstance.Begin()
	if err != nil {
		log.Fatalln("Unable to begin transaction")
	}
	_, commerr := tx.Exec(commentQuery)
	if commerr != nil {
		tx.Rollback()
		log.Fatalln("Unable to create comments table")
	}
	_, reacterr := tx.Exec(reactionQuery)
	if reacterr != nil {
		tx.Rollback()
		log.Fatalln("Unable to create comment_reactions table")
	}
	commiterr := tx.Commit()
	if commiterr != nil {
		log.Fatalln("Unable to commit transaction")
	}
}

func GetCommentsForPost(postID int, page_no int, results_per_page int) ([]models.CommentRow, error) {
	conn, poolerr := DbConnPool.Get()
	defer DbConnPool.Put(conn)
	if poolerr != nil {
		log.Println("Unable to get connection from pool")
		return nil, poolerr
	}

	query := `
			WITH TopLevelComments AS (
				SELECT
					id AS commentId,
					content,
					is_top_level,
					post_id,
					user_id,
					username,
					fullname,
					avatar_url,
					updated_at
				FROM
					comments
				WHERE
					is_top_level = TRUE AND post_id = $1
				
			),
			FirstReply AS (
				SELECT DISTINCT ON (parent_comment_id)
					parent_comment_id,
					id as reply_comment_id,
					content as reply_content,
					user_id as reply_user_id,
					username as reply_username,
					fullname as reply_fullname,
					avatar_url as reply_avatar_url,
					updated_at as reply_updated_at
				FROM comments
				WHERE parent_comment_id IN (SELECT commentId FROM TopLevelComments)
			)
			SELECT
				json_agg(json_build_object(
					'commentId', tlc.commentId,
					'content', tlc.content,
					'is_top_level', tlc.is_top_level,
					'post_id', tlc.post_id,
					'user_id', tlc.user_id,
					'username', tlc.username,
					'fullname', tlc.fullname,
					'avatar_url', tlc.avatar_url,
					'updated_at', tlc.updated_at,
					'replies', CASE WHEN fr.reply_comment_id IS NOT NULL THEN json_build_array(json_build_object('commentId', fr.reply_comment_id, 'content', fr.reply_content, 'user_id', fr.reply_user_id, 'username', fr.reply_username, 'fullname', fr.reply_fullname, 'avatar_url', fr.reply_avatar_url, 'updated_at', fr.reply_updated_at )) ELSE '[]'::json END
				))
			FROM TopLevelComments tlc
			LEFT JOIN FirstReply fr ON tlc.commentId = fr.parent_comment_id LIMIT $2 OFFSET $3;
    `
	var jsonData []byte

	scanerr := conn.dbInstance.QueryRow(query, postID, results_per_page, (page_no-1)*results_per_page).Scan(&jsonData)
	// scanerr := conn.dbInstance.QueryRow(query, postID).Scan(&jsonData)

	if scanerr != nil {
		if scanerr == sql.ErrNoRows {
			return nil, sql.ErrNoRows
		}
		return nil, scanerr
	}
	// if no rows found from query
	if len(jsonData) == 0 {
		// return blank array
		return []models.CommentRow{}, nil
	}

	var comments []models.CommentRow

	err := json.Unmarshal(jsonData, &comments)

	if err != nil {
		return nil, err
	}

	return comments, nil
}

func DeleteComment(commentId int) error {
	conn, poolerr := DbConnPool.Get()
	defer DbConnPool.Put(conn)
	if poolerr != nil {
		log.Println("Unable to get connection from pool")
		return poolerr
	}

	query := `DELETE FROM comments WHERE id=$1`
	result, execerr := conn.dbInstance.Exec(query, commentId)
	if execerr != nil {
		return execerr
	}
	count, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if count == 0 {
		return errors.New("unable to delete comment")
	}
	return nil
}
