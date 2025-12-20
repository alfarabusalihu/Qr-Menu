package service

import (
	"fmt"
	"io"
	"log"
	"menu-backend/internal/models"
	"net/http"
	"net/url"
	"os"
	"strings"
)

type NotificationService interface {
	SendOrderConfirmation(order *models.Order) error
}

type WhatsAppNotificationService struct {
	AccountSID string
	AuthToken  string
	FromPhone  string
}

func NewWhatsAppNotificationService() *WhatsAppNotificationService {
	svc := &WhatsAppNotificationService{
		AccountSID: os.Getenv("TWILIO_ACCOUNT_SID"),
		AuthToken:  os.Getenv("TWILIO_AUTH_TOKEN"),
		FromPhone:  os.Getenv("TWILIO_PHONE_NUMBER"),
	}

	if svc.AccountSID == "" || svc.AuthToken == "" || svc.FromPhone == "" {
		log.Println("[WhatsApp] WARNING: Twilio credentials not configured. Notifications will be skipped.")
		log.Println("[WhatsApp] Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env")
	} else {
		log.Printf("[WhatsApp] Notification service initialized with phone: %s", svc.FromPhone)
	}

	return svc
}

func (s *WhatsAppNotificationService) SendOrderConfirmation(order *models.Order) error {
	log.Printf("[WhatsApp] Starting notification for order %s", order.ID)
	
	if s.AccountSID == "" || s.AuthToken == "" || s.FromPhone == "" {
		log.Println("[WhatsApp] Twilio credentials missing, skipping notification")
		return nil
	}

	log.Printf("[WhatsApp] Sending to: %s, From: %s", order.UserDetails.Phone, s.FromPhone)

	// Format the invoice message
	var itemsList strings.Builder
	for _, item := range order.Items {
		itemsList.WriteString(fmt.Sprintf("%s - %dx - $%.2f\n", item.Name, item.Quantity, item.Price*float64(item.Quantity)))
	}

	// TODO: Make Restaurant Name and URL configurable via env if needed
	restaurantName := "The Menu Restaurant"
	menuLink := "https://nav-menu-app.vercel.app" // Replace with actual production URL or localhost for dev

	messageBody := fmt.Sprintf(
		"*Name:* %s\n"+
			"*Email:* %s\n"+
			"--------------------------------\n"+
			"*Order ID:* %s\n\n"+
			"*Items Ordered:*\n%s\n"+
			"*Total:* $%.2f\n"+
			"*Payment Status:* %s\n\n"+
			"*Restaurant:* %s\n"+
			"*WhatsApp:* %s\n\n"+
			"🔗 *Go to Menu:* %s",
		order.UserDetails.Name,
		order.UserDetails.Email,
		order.ID,
		itemsList.String(),
		order.Total,
		strings.ToUpper(order.PaymentStatus),
		restaurantName,
		s.FromPhone,
		menuLink,
	)

	// Twilio API URL
	apiURL := fmt.Sprintf("https://api.twilio.com/2010-04-01/Accounts/%s/Messages.json", s.AccountSID)

	// Prepare form data
	data := url.Values{}
	data.Set("To", "whatsapp:"+order.UserDetails.Phone)
	data.Set("From", "whatsapp:"+s.FromPhone)
	data.Set("Body", messageBody)

	// create request
	req, err := http.NewRequest("POST", apiURL, strings.NewReader(data.Encode()))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	req.SetBasicAuth(s.AccountSID, s.AuthToken)

	// Send request
	log.Println("[WhatsApp] Sending HTTP request to Twilio...")
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("[WhatsApp] HTTP request failed: %v", err)
		return fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		log.Printf("[WhatsApp] ✅ Notification sent successfully to %s (Status: %d)", order.UserDetails.Phone, resp.StatusCode)
		return nil
	}

	// Read error response body
	bodyBytes, _ := io.ReadAll(resp.Body)
	log.Printf("[WhatsApp] ❌ Failed to send. Status: %d, Response: %s", resp.StatusCode, string(bodyBytes))
	return fmt.Errorf("twilio API returned status: %d - %s", resp.StatusCode, string(bodyBytes))
}
