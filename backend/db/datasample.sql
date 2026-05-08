INSERT INTO "Role" ("role_name") VALUES ('OWNER'), ('MANAGER'), ('PT'), ('MEMBER');

INSERT INTO "Account" ("username", "password", "role_id") VALUES
('owner@gym.com', '123456', 1), -- ID 1
('manager@gym.com', '123456', 2), -- ID 2
('pt@gym.com', '123456', 3),     -- ID 3
('member@gym.com', '123456', 4);  -- ID 4

INSERT INTO "Employee" ("full_name", "phone", "position", "salary", "account_id", "gender", "dob", "email", "address") VALUES
('Nguyễn Văn An', '0901000001', 'MANAGER', 25000000, 2, 'Male', '1990-05-15', 'an.nv@gym.com', 'Hà Nội'),
('Trần Thị Bình', '0901000002', 'PT', 18000000, 3, 'Female', '1995-08-20', 'binh.tt@gym.com', 'TP.HCM'),
('Lê Hoàng Cường', '0901000003', 'SALE', 12000000, NULL, 'Male', '1998-12-10', 'cuong.lh@gym.com', 'Đà Nẵng'),
('Phạm Mai Dung', '0901000004', 'CS_STAFF', 10000000, NULL, 'Female', '2000-02-28', 'dung.pm@gym.com', 'Cần Thơ'),
('Hoàng Tuấn Em', '0901000005', 'PT', 16000000, 3, 'Male', '1994-06-05', 'em.ht@gym.com', 'Hải Phòng'),
('Đỗ Thu Phương', '0901000006', 'SALE', 11000000, NULL, 'Female', '1997-09-15', 'phuong.dt@gym.com', 'Huế'),
('Vũ Văn Giang', '0901000007', 'BẢO VỆ', 7000000, NULL, 'Male', '1999-11-11', 'giang.vv@gym.com', 'Nha Trang'),
('Bùi Thị Hiền', '0901000008', 'MANAGER', 22000000, 2, 'Female', '1992-03-30', 'hien.bt@gym.com', 'Bình Dương'),
('Ngô Đình Ích', '0901000009', 'PT', 15000000, 3, 'Male', '1996-07-07', 'ich.nd@gym.com', 'Vũng Tàu'),
('Lý Thu Ký', '0901000010', 'VỆ SINH', 6000000, NULL, 'Female', '1993-01-22', 'ky.lt@gym.com', 'Đồng Nai');

-- 4. PT_Detail (Chỉ dành cho những ai có position = 'PT')
INSERT INTO "PT_Detail" ("employee_id", "professional_profile", "body_index", "experience_years", "achievements", "available_schedule") VALUES
(2, 'Chuyên gia Yoga', 'Cao 165cm', '3 năm', 'Chứng chỉ Yoga quốc tế', 'Chiều 14h-18h'),
(5, 'Chuyên gia thể hình', 'Cao 175cm', '6 năm', 'Master Trainer', 'Sáng 8h-12h'),
(9, 'Chuyên gia thể hình', 'Cao 172cm', '4 năm', 'Chứng chỉ PT', 'Chiều 14h-18h');


INSERT INTO "Member" ("full_name", "phone", "email", "gender", "dob", "address", "account_id") VALUES
('Nguyễn Văn A', '0910000001', 'mem1@test.com', 'Male', '1990-01-01', 'Hà Nội', 4),
('Nguyễn Văn B', '0910000002', 'mem2@test.com', 'Male', '1991-01-01', 'Hà Nội', 4),
('Nguyễn Văn C', '0910000003', 'mem3@test.com', 'Male', '1992-01-01', 'Hà Nội', 4),
('Nguyễn Văn D', '0910000004', 'mem4@test.com', 'Male', '1993-01-01', 'Hà Nội', 4),
('Nguyễn Văn E', '0910000005', 'mem5@test.com', 'Male', '1994-01-01', 'Hà Nội', 4),
('Nguyễn Văn F', '0910000006', 'mem6@test.com', 'Male', '1995-01-01', 'Hà Nội', 4),
('Nguyễn Văn G', '0910000007', 'mem7@test.com', 'Male', '1996-01-01', 'Hà Nội', 4),
('Nguyễn Văn H', '0910000008', 'mem8@test.com', 'Male', '1997-01-01', 'Hà Nội', 4),
('Nguyễn Văn I', '0910000009', 'mem9@test.com', 'Male', '1998-01-01', 'Hà Nội', 4),
('Nguyễn Văn J', '0910000010', 'mem10@test.com', 'Male', '1999-01-01', 'Hà Nội', 4);


INSERT INTO "Facility" ("facility_name", "facility_type", "status", "description", "max_capacity", "current_capacity", "amenities") VALUES
('Phòng Gym Gold', 'Gym', 'Operating', 'Khu tập tạ cao cấp', 50, 15, 'Wifi, Điều hòa, Nước uống'),
('Sân Yoga Zen', 'Studio', 'Operating', 'Không gian tĩnh lặng', 20, 5, 'Thảm, Gương, Loa'),
('Hồ bơi bốn mùa', 'Pool', 'Operating', 'Nước ấm quanh năm', 30, 8, 'Tủ khóa, Khăn tắm'),
('Sân Tennis 1', 'Outdoor', 'Operating', 'Sân ngoài trời', 4, 2, 'Đèn chiếu sáng'),
('Sân Tennis 2', 'Outdoor', 'Operating', 'Sân ngoài trời', 4, 0, 'Đèn chiếu sáng'),
('Phòng Xông hơi khô', 'Spa', 'Operating', 'Thư giãn cơ bắp', 10, 2, 'Khăn, Tinh dầu'),
('Phòng Xông hơi ướt', 'Spa', 'Operating', 'Hỗ trợ hô hấp', 10, 1, 'Khăn'),
('Phòng Boxing', 'Studio', 'Operating', 'Tập luyện cường độ cao', 15, 4, 'Găng tay, Bao cát'),
('Khu Cardio A', 'Gym', 'Operating', 'Máy chạy bộ, xe đạp', 40, 10, 'Điều hòa, Tivi'),
('Khu Cardio B', 'Gym', 'Operating', 'Máy leo núi, chèo thuyền', 40, 5, 'Điều hòa');

INSERT INTO "Equipment" ("facility_id", "equipment_name", "serial_number", "quantity", "status", "purchase_date", "maintenance_deadline", "origin") VALUES
(1, 'Máy chạy bộ Kingsmith', 'KSM-001', 5, 'Broken', '2026-01-01', '2027-01-01', 'Trung Quốc'),
(1, 'Tạ đòn Olympic', 'TDO-001', 4, 'Broken', '2026-01-05', '2027-01-05', 'Việt Nam'),
(2, 'Thảm Yoga cao cấp', 'THM-001', 20, 'New', '2026-02-01', '2027-02-01', 'Đài Loan'),
(3, 'Hệ thống lọc nước hồ', 'LOC-001', 1, 'Operating', '2025-12-10', '2026-12-10', 'Mỹ'),
(4, 'Lưới Tennis tiêu chuẩn', 'LUI-001', 1, 'New', '2026-03-01', '2027-03-01', 'Việt Nam'),
(6, 'Máy xông hơi khô', 'XHK-001', 1, 'Maintenance', '2026-01-20', '2027-01-20', 'Nhật Bản'),
(7, 'Máy xông hơi ướt', 'XHU-001', 1, 'Maintenance', '2026-01-20', '2027-01-20', 'Nhật Bản'),
(8, 'Bao cát Boxing Pro', 'BOX-001', 4, 'Operating', '2026-01-15', '2027-01-15', 'Thái Lan'),
(9, 'Xe đạp tập Impulse', 'XDT-001', 6, 'New', '2026-02-10', '2027-02-10', 'Trung Quốc'),
(10, 'Máy chèo thuyền (Rower)', 'CTH-001', 3, 'Broken', '2026-03-05', '2027-03-05', 'Mỹ');

INSERT INTO "ServiceCategory" ("category_name", "benefits_description", "allowed_gender") VALUES
('VIP', 'Truy cập mọi khu vực, sử dụng phòng xông hơi, yoga, gym, hồ bơi', 'All'),
('Normal', 'Khu vực Gym cơ bản', 'All'),
('Female-only', 'Khu vực riêng cho nữ, Yoga, Spa', 'Female'),
('VIP', 'Truy cập mọi khu vực, sử dụng phòng xông hơi, yoga, gym, hồ bơi', 'All'),
('Normal', 'Khu vực Gym cơ bản', 'All'),
('Female-only', 'Khu vực riêng cho nữ, Yoga, Spa', 'Female');

INSERT INTO "MembershipPackage" ("category_id", "package_name", "duration_days", "price", "is_active") VALUES
(1, 'Gói VIP Tháng', 30, 1000000, true),
(2, 'Gói Cơ Bản Tháng', 30, 500000, true),
(3, 'Gói Nữ Tháng', 30, 50000, true),
(1, 'Gói VIP nửa năm', 180, 5000000, true),
(3, 'Gói Nữ nửa năm', 180, 2500000, true),
(1, 'Gói VIP 1 năm', 365, 10000000, true);


-- Lệnh Insert mẫu chuẩn cho team (Dùng khi DB chưa có dữ liệu)
INSERT INTO "Subscription" ("member_id", "package_id", "registration_date", "start_date", "end_date", "status") VALUES
(1, 1, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date, 'Active'),  -- Gói VIP Tháng
(2, 2, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date, 'Active'),  -- Gói Cơ Bản Tháng
(3, 1, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date, 'Active'),  -- Gói VIP Tháng
(4, 3, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date, 'Active'),  -- Gói Nữ Tháng
(5, 4, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '180 days')::date, 'Active'), -- Gói VIP nửa năm
(6, 2, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date, 'Active'),  -- Gói Cơ Bản Tháng
(7, 4, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '180 days')::date, 'Active'), -- Gói VIP nửa năm
(8, 3, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date, 'Active'),  -- Gói Nữ Tháng
(9, 6, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '365 days')::date, 'Active'), -- Gói VIP 1 năm
(10, 3, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date, 'Active'); -- Gói Nữ Tháng

INSERT INTO "Invoice" ("member_id", "subscription_id", "total_amount", "payment_status", "payment_method", "notes") VALUES
(1, 1, 1000000, 'Paid', 'Cash', 'Thanh toán gói VIP Tháng'),
(2, 2, 500000, 'Paid', 'Bank Transfer', 'Thanh toán gói Cơ Bản Tháng'),
(3, 3, 1000000, 'Paid', 'Card', 'Thanh toán gói VIP Tháng'),
(4, 4, 50000, 'Paid', 'Cash', 'Thanh toán gói Nữ Tháng'),
(5, 5, 5000000, 'Paid', 'Bank Transfer', 'Thanh toán gói VIP nửa năm'),
(6, 6, 500000, 'Paid', 'Cash', 'Thanh toán gói Cơ Bản Tháng'),
(7, 7, 5000000, 'Paid', 'Card', 'Thanh toán gói VIP nửa năm'),
(8, 8, 50000, 'Paid', 'Cash', 'Thanh toán gói Nữ Tháng'),
(9, 9, 10000000, 'Paid', 'Bank Transfer', 'Thanh toán gói VIP 1 năm'),
(10, 10, 50000, 'Paid', 'Card', 'Thanh toán gói Nữ Tháng');

-- Liên kết member với 3 PT đã tạo (ID 2, 5, 9)
INSERT INTO "TrainingBooking" ("member_id", "pt_id", "requested_start", "requested_end", "training_plan_note", "status") VALUES
(1, 2, '2026-04-20 18:00:00', '2026-04-20 19:30:00', 'Giảm cân', 'Accepted'),
(2, 5, '2026-04-21 07:00:00', '2026-04-21 08:30:00', 'Tăng cơ', 'Accepted'),
(3, 9, '2026-04-22 09:00:00', '2026-04-22 10:30:00', 'Yoga', 'Accepted');

INSERT INTO "TrainingSession" ("booking_id", "facility_id", "session_time", "attendance_status", "pt_feedback") VALUES
(1, 1, CURRENT_TIMESTAMP, 'Present', 'Học viên rất tích cực'),
(2, 1, CURRENT_TIMESTAMP, 'Present', 'Cần cải thiện kỹ thuật squat'),
(3, 2, CURRENT_TIMESTAMP, 'Present', 'Đã hoàn thành tốt bài tập');

INSERT INTO "Feedback" ("member_id", "processor_id", "equipment_id", "content", "sent_at", "resolution_note", "status", "rating") VALUES
(1, 1, 1, 'Máy chạy bộ số 1 hay bị kẹt băng tải', '2026-04-10 08:30:00', 'Đã bảo trì xong, máy chạy mượt', 'Resolved', 4),
(2, 4, 2, 'Tạ đơn 10kg bị rỉ sét phần tay cầm', '2026-04-11 09:15:00', 'Đang đợi thay mới', 'Pending', 2),
(3, 8, 3, 'Thảm tập Yoga bị rách ở góc', '2026-04-12 10:00:00', 'Đã thay thảm mới cho hội viên', 'Resolved', 5),
(4, 1, 4, 'Hệ thống lọc nước kêu to quá', '2026-04-13 14:20:00', 'Kiểm tra motor, bôi trơn lại', 'Resolved', 3),
(5, 4, 5, 'Lưới tennis bị chùng, khó chơi', '2026-04-14 15:45:00', 'Đã căng lại lưới', 'Resolved', 4),
(6, 8, 6, 'Phòng xông hơi khô không đủ nóng', '2026-04-15 16:10:00', 'Chỉnh lại cảm biến nhiệt', 'Resolved', 4),
(7, 1, 7, 'Máy xông ướt bị rò nước ra sàn', '2026-04-16 09:00:00', 'Đang chờ linh kiện sửa chữa', 'Pending', 1),
(8, 4, 8, 'Bao cát Boxing bị móp một bên', '2026-04-17 11:30:00', 'Sẽ bọc lại da và thêm bông', 'Pending', 3),
(9, 8, 9, 'Xe đạp Impulse phát tiếng kêu lạ', '2026-04-18 10:00:00', 'Đã vệ sinh và tra dầu', 'Resolved', 5),
(10, 1, 10, 'Máy chèo thuyền bị lỏng ốc vít', '2026-04-19 08:45:00', 'Đã siết chặt lại toàn bộ ốc', 'Resolved', 5);