package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	connStr := "postgres://user:password@localhost:5432/gym_db?sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Alter table to add category_type
	_, err = db.Exec(`ALTER TABLE "ServiceCategory" ADD COLUMN IF NOT EXISTS "category_type" varchar NOT NULL DEFAULT 'specialty'`)
	if err != nil {
		log.Fatalf("Error altering table: %v", err)
	}

	// Update existing basic categories
	_, err = db.Exec(`UPDATE "ServiceCategory" SET "category_type" = 'basic' WHERE id IN (1, 2, 3)`)
	if err != nil {
		log.Fatalf("Error updating table: %v", err)
	}

	fmt.Println("Migration successful: added category_type to ServiceCategory")
}
