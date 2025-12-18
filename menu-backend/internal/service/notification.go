package service

import (
	"fmt"
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
	if s.AccountSID == "" || s.AuthToken == "" || s.FromPhone == "" {
		log.Println("[WhatsApp] Twilio credentials missing, skipping notification")
		return nil
	}

	// Format the invoice message
	var itemsList strings.Builder
	for _, item := range order.Items {
		itemsList.WriteString(fmt.Sprintf("- %dx %s ($%.2f)\n", item.Quantity, item.Name, item.Price))
	}

	messageBody := fmt.Sprintf(
		"🧾 *Order Confirmation*\n\n"+
			"Hello *%s*! Thank you for your order.\n\n"+
			"*Order ID:* %s\n"+
			"*Date:* %s\n\n"+
			"*Your Items:*\n%s\n"+
			"*Total: $%.2f*\n\n"+
			"We are preparing your food! 🍳",
		order.UserDetails.Name,
		order.ID,
		order.CreatedAt.Format("2006-01-02 15:04"),
		itemsList.String(),
		order.Total,
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
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		log.Printf("[WhatsApp] Notification sent to %s", order.UserDetails.Phone)
		return nil
	}

	log.Printf("[WhatsApp] Failed to send. Status: %s", resp.Status)
	return fmt.Errorf("twilio API returned status: %s", resp.Status)
}
