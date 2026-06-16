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

	rows, err := db.Query(`SELECT id, category_id, package_name, pricing_type FROM "MembershipPackage" WHERE package_name ILIKE '%bơi lội%' ORDER BY id DESC`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var id, catId int
		var name, pType string
		rows.Scan(&id, &catId, &name, &pType)
		fmt.Printf("ID: %d, CategoryID: %d, Name: %s, Type: %s\n", id, catId, name, pType)
	}
}
