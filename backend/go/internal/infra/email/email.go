package email

import (
	"fmt"
	"net/smtp"
	"os"
	"strconv"
)

type Service struct {
	host string
	port int
	user string
	pass string
}

func NewService() *Service {
	port, _ := strconv.Atoi(os.Getenv("MAIL_PORT"))
	if port == 0 {
		port = 587
	}
	return &Service{
		host: os.Getenv("MAIL_HOST"),
		port: port,
		user: os.Getenv("MAIL_USER"),
		pass: os.Getenv("MAIL_PASS"),
	}
}

func (s *Service) SendNewMemberCredentials(toEmail, fullName, username, password string) error {
	subject := "Tài khoản đăng nhập phòng gym của bạn"
	body := fmt.Sprintf(`Xin chào %s,

Tài khoản của bạn đã được tạo thành công. Dưới đây là thông tin đăng nhập:

  Tên đăng nhập: %s
  Mật khẩu tạm thời: %s

Vui lòng đăng nhập và đổi mật khẩu ngay lần đầu sử dụng.

Trân trọng,
Ban quản lý phòng gym`, fullName, username, password)

	msg := fmt.Sprintf("From: ActiveGym <%s>\r\nTo: %s\r\nSubject: %s\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n%s",
		s.user, toEmail, subject, body)

	addr := fmt.Sprintf("%s:%d", s.host, s.port)
	auth := smtp.PlainAuth("", s.user, s.pass, s.host)
	return smtp.SendMail(addr, auth, s.user, []string{toEmail}, []byte(msg))
}
