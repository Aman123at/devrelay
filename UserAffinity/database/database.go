package database

import (
	"log"

	"github.com/Aman123at/devrelay/useraffinity/utils"
)

var DbConnPool *connPool

func InitializeUserAffTable() {
	conn, poolerr := DbConnPool.Get()
	defer DbConnPool.Put(conn)
	if poolerr != nil {
		log.Println("Unable to get connection from pool")
		return
	}
	query := `CREATE TABLE IF NOT EXISTS user_affinity (
		source INT NOT NULL,
		target INT NOT NULL,
		affinity_type VARCHAR(2) NOT NULL,
		is_deleted BOOLEAN DEFAULT false,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY (source, affinity_type, target)
	)`
	_, err := conn.dbInstance.Exec(query)
	if err != nil {
		log.Println("Unable to create user_affinity table")
	}
}

func GetCountOfUsers(userID int, affType string) (int, error) {
	conn, poolerr := DbConnPool.Get()
	defer DbConnPool.Put(conn)
	if poolerr != nil {
		log.Println("Unable to get connection from pool")
		return -1, poolerr
	}

	query := `SELECT COUNT(*) FROM user_affinity WHERE source=$1 AND affinity_type=$2 AND is_deleted=false`
	var count int
	err := conn.dbInstance.QueryRow(query, userID, affType).Scan(&count)
	log.Println("Count of users", count)
	if err != nil {
		log.Println("Unable to get count of users")
		return -1, err
	}
	return count, nil
}

func InsertUserAffinity(sourceUserID int, targetUserID int) error {
	conn, poolerr := DbConnPool.Get()
	defer DbConnPool.Put(conn)
	if poolerr != nil {
		log.Println("Unable to get connection from pool")
		return poolerr
	}

	// check if user affinity already exists with same source and target also if it is deleted previously
	query := `SELECT COUNT(*) FROM user_affinity WHERE source = $1 AND target = $2 AND is_deleted = true`
	var count int
	err := conn.dbInstance.QueryRow(query, sourceUserID, targetUserID).Scan(&count)
	if err != nil {
		log.Println("Unable to check user affinity")
		return err
	}

	if count > 0 {
		// if user affinity already exists and is deleted, then update it
		query = `UPDATE user_affinity SET is_deleted=false WHERE source = $1 AND target = $2 AND affinity_type = $3`
		tx, err := conn.dbInstance.Begin()
		if err != nil {
			log.Println("Unable to begin transaction")
			return err
		}
		_, foerr := tx.Exec(query, sourceUserID, targetUserID, utils.AffinityEnums["followings"])
		if foerr != nil {
			tx.Rollback()
			log.Println("Unable to update user affinity")
			return foerr
		}

		_, fberr := tx.Exec(query, targetUserID, sourceUserID, utils.AffinityEnums["followers"])
		if fberr != nil {
			tx.Rollback()
			log.Println("Unable to update user affinity")
			return fberr
		}

		err = tx.Commit()
		if err != nil {
			log.Println("Unable to commit transaction")
			return err
		}
		return nil
	}

	query = `INSERT INTO user_affinity (source, target, affinity_type) VALUES ($1, $2, $3)`

	// start db transaction
	tx, err := conn.dbInstance.Begin()
	if err != nil {
		log.Println("Unable to begin transaction")
		return err
	}

	_, foerr := tx.Exec(query, sourceUserID, targetUserID, utils.AffinityEnums["followings"])
	if foerr != nil {
		tx.Rollback()
		log.Println("Unable to insert user affinity")
		return foerr
	}

	_, fberr := tx.Exec(query, targetUserID, sourceUserID, utils.AffinityEnums["followers"])
	if fberr != nil {
		tx.Rollback()
		log.Println("Unable to insert user affinity")
		return fberr
	}

	err = tx.Commit()
	if err != nil {
		log.Println("Unable to commit transaction")
		return err
	}
	return nil
}

func DeleteUserAffinity(sourceUserID int, targetUserID int) error {
	conn, poolerr := DbConnPool.Get()
	defer DbConnPool.Put(conn)
	if poolerr != nil {
		log.Println("Unable to get connection from pool")
		return poolerr
	}
	query := `UPDATE user_affinity SET is_deleted=true WHERE source = $1 AND target = $2 AND affinity_type = $3`

	// start db transaction
	tx, err := conn.dbInstance.Begin()
	if err != nil {
		log.Println("Unable to begin transaction")
		return err
	}

	_, err = tx.Exec(query, sourceUserID, targetUserID, utils.AffinityEnums["followings"])
	if err != nil {
		tx.Rollback()
		log.Println("Unable to delete user affinity")
		return err
	}

	_, err = tx.Exec(query, targetUserID, sourceUserID, utils.AffinityEnums["followers"])
	if err != nil {
		tx.Rollback()
		log.Println("Unable to delete user affinity")
		return err
	}

	err = tx.Commit()
	if err != nil {
		log.Println("Unable to delete user affinity")
		return err
	}

	return nil
}
