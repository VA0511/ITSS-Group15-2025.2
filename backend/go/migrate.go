package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	connStr := "host=localhost port=5432 user=postgres password=postgres dbname=gymdb sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	query := `ALTER TABLE "MembershipPackage" 
		ADD COLUMN IF NOT EXISTS pricing_type VARCHAR(20) NOT NULL DEFAULT 'time_based',
		ADD COLUMN IF NOT EXISTS total_sessions INT NULL;`

	_, err = db.Exec(query)
	if err != nil {
		log.Fatalf("Error altering table: %v", err)
	}
	fmt.Println("Migration successful!")
}
