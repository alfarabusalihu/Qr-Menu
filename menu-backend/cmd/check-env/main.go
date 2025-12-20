package main

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	fmt.Println("=== Checking Twilio Credentials ===\n")

	accountSID := os.Getenv("TWILIO_ACCOUNT_SID")
	authToken := os.Getenv("TWILIO_AUTH_TOKEN")
	phoneNumber := os.Getenv("TWILIO_PHONE_NUMBER")

	if accountSID == "" {
		fmt.Println("❌ TWILIO_ACCOUNT_SID is NOT set")
	} else {
		fmt.Printf("✅ TWILIO_ACCOUNT_SID is set: %s\n", accountSID)
	}

	if authToken == "" {
		fmt.Println("❌ TWILIO_AUTH_TOKEN is NOT set")
	} else {
		fmt.Printf("✅ TWILIO_AUTH_TOKEN is set: %s... (hidden for security)\n", authToken[:8])
	}

	if phoneNumber == "" {
		fmt.Println("❌ TWILIO_PHONE_NUMBER is NOT set")
	} else {
		fmt.Printf("✅ TWILIO_PHONE_NUMBER is set: %s\n", phoneNumber)
	}

	fmt.Println("\n=== Summary ===")
	if accountSID != "" && authToken != "" && phoneNumber != "" {
		fmt.Println("✅ All credentials are configured!")
	} else {
		fmt.Println("❌ Some credentials are missing. Check your .env file.")
		fmt.Println("\nYour .env file should have:")
		fmt.Println("TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
		fmt.Println("TWILIO_AUTH_TOKEN=your_auth_token_here")
		fmt.Println("TWILIO_PHONE_NUMBER=+14155238886")
	}
}
