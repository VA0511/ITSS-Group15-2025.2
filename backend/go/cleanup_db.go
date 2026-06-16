package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	connStr := "postgres://postgres:Megake123@localhost:5432/gymdb?sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// 1. Delete packages where package_name is null, empty, or 'undefined'
	res2, err := db.Exec(`
		DELETE FROM "MembershipPackage"
		WHERE package_name IS NULL OR package_name = '' OR package_name = 'undefined'
	`)
	if err != nil {
		log.Fatal(err)
	}
	rowsAffected2, _ := res2.RowsAffected()
	fmt.Printf("Deleted %d invalid packages\n", rowsAffected2)

	// 2. Delete duplicate Service Categories (keep the one with the lowest ID for each name)
	res, err := db.Exec(`
		DELETE FROM "ServiceCategory"
		WHERE id NOT IN (
			SELECT MIN(id)
			FROM "ServiceCategory"
			GROUP BY LOWER(category_name)
		) AND id NOT IN (SELECT DISTINCT category_id FROM "MembershipPackage" WHERE category_id IS NOT NULL)
	`)
	if err != nil {
		log.Fatal(err)
	}
	rowsAffected, _ := res.RowsAffected()
	fmt.Printf("Deleted %d duplicate categories\n", rowsAffected)
}
