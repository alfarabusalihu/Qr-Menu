package main

import (
	"context"
	"log"
	"os"
	"path/filepath"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env from project root
	rootDir, _ := os.Getwd()
	_ = godotenv.Load(filepath.Join(rootDir, ".env"))

	dbUrl := os.Getenv("DATABASE_URL")
	if dbUrl == "" {
		log.Fatal("DATABASE_URL not set")
	}

	ctx := context.Background()
	db, err := pgxpool.New(ctx, dbUrl)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	log.Println("Connected to database...")

	// Run Schema
	if err := executeFile(ctx, db, filepath.Join(rootDir, "db", "schema.sql")); err != nil {
		log.Fatalf("Failed to run schema: %v", err)
	}
	log.Println("Schema applied successfully.")

	// Run Seeds
	if err := executeFile(ctx, db, filepath.Join(rootDir, "db", "seed.sql")); err != nil {
		log.Fatalf("Failed to run seeds: %v", err)
	}
	log.Println("Seeds applied successfully.")
}

func executeFile(ctx context.Context, db *pgxpool.Pool, path string) error {
	content, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	sql := string(content)
	_, err = db.Exec(ctx, sql)
	return err
}
