package service

type NotificationService struct {
	AccountSID string
	AuthToken  string
	From       string
}

func NewNotificationService(sid, token, from string) *NotificationService {
	return &NotificationService{
		AccountSID: sid,
		AuthToken:  token,
		From:       from,
	}
}

func (s *Service) SendOrderNotification() error {
    return nil
}
