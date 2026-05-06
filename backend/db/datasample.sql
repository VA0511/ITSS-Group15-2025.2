INSERT INTO "Role" ("role_name") VALUES ('OWNER'), ('MANAGER'), ('PT'), ('MEMBER');

-- account_id: 1=owner, 2=manager, 3=pt1, 4=member1, 5=pt2, 6=pt3
INSERT INTO "Account" ("username", "password", "role_id") VALUES
('owner@gym.com',   '123456', 1),
('manager@gym.com', '123456', 2),
('pt@gym.com',      '123456', 3),
('member@gym.com',  '123456', 4),
('pt2@gym.com',     '123456', 3),
('pt3@gym.com',     '123456', 3);

-- employee_id: 1..10
-- Each account assigned to exactly 1 employee
-- employee 2 -> account 3 (pt@gym.com), employee 5 -> account 5 (pt2@gym.com), employee 9 -> account 6 (pt3@gym.com)
INSERT INTO "Employee" ("full_name", "phone", "position", "salary", "account_id", "gender", "dob", "email", "address") VALUES
('Nguyễn Văn An',  '0901000001', 'MANAGER',  25000000, 2,    'Male',   '1990-05-15', 'an.nv@gym.com',     'Hà Nội'),
('Trần Minh Khoa', '0901000002', 'PT',        18000000, 3,    'Male',   '1995-08-20', 'khoa.tran@gym.com', 'Hà Nội'),
('Lê Hoàng Cường', '0901000003', 'SALE',      12000000, NULL, 'Male',   '1998-12-10', 'cuong.lh@gym.com',  'Đà Nẵng'),
('Phạm Mai Dung',  '0901000004', 'CS_STAFF',  10000000, NULL, 'Female', '2000-02-28', 'dung.pm@gym.com',   'Cần Thơ'),
('Nguyễn Thị Lan', '0901000005', 'PT',        16000000, 5,    'Female', '1994-06-05', 'lan.nt@gym.com',    'TP.HCM'),
('Đỗ Thu Phương',  '0901000006', 'SALE',      11000000, NULL, 'Female', '1997-09-15', 'phuong.dt@gym.com', 'Huế'),
('Vũ Văn Giang',   '0901000007', 'CS_STAFF',   7000000, NULL, 'Male',   '1999-11-11', 'giang.vv@gym.com',  'Nha Trang'),
('Bùi Thị Hiền',   '0901000008', 'MANAGER',   22000000, NULL, 'Female', '1992-03-30', 'hien.bt@gym.com',   'Bình Dương'),
('Phạm Văn Hùng',  '0901000009', 'PT',        15000000, 6,    'Male',   '1996-07-07', 'hung.pv@gym.com',   'Vũng Tàu'),
('Lý Thu Ký',      '0901000010', 'CS_STAFF',   6000000, NULL, 'Female', '1993-01-22', 'ky.lt@gym.com',     'Đồng Nai');

-- PT_Detail: employee_id 2, 5, 9
-- body_index: JSON for grid measurements
-- available_schedule: JSON {"Mon": ["HH:MM",...], ...}
-- professional_profile, achievements: plain text
INSERT INTO "PT_Detail" ("employee_id", "professional_profile", "body_index", "experience_years", "achievements", "available_schedule") VALUES
(
  2,
  'Huấn luyện viên chuyên Strength & Conditioning với hơn 6 năm kinh nghiệm. Từng là Head PT tại ActiveGym Hà Nội và Personal Trainer tại California Fitness (2019–2022). Sở hữu chứng chỉ ACE-CPT và FMS Level 1.',
  '{"height": 178, "weight": 76, "chest": 102, "bicep": 38, "waist": 80, "forearm": 29, "thigh": 58, "calf": 40}',
  '6',
  'HCV Men''s Physique - VNBF 2023; Á quân Classic Bodybuilding - WBPF 2022; Top 3 PT of the Year - ActiveGym 2024',
  '{"Mon": ["07:00","08:00","09:00","17:00","18:00"], "Tue": ["07:00","08:00","09:00"], "Wed": ["17:00","18:00","19:00"], "Thu": ["07:00","08:00","09:00"], "Fri": ["17:00","18:00","19:00"], "Sat": ["08:00","09:00","10:00"]}'
),
(
  5,
  'Chuyên gia Yoga và Pilates với 5 năm kinh nghiệm. Tốt nghiệp Đại học TDTT TP.HCM, có chứng chỉ Yoga Alliance 200h và Pilates Reformer Certified. Chuyên trị liệu đau lưng và cải thiện linh hoạt cơ thể.',
  '{"height": 163, "weight": 52, "chest": 84, "bicep": 26, "waist": 62, "forearm": 21, "thigh": 52, "calf": 34}',
  '5',
  'Best Female Trainer - FitExpo Vietnam 2023; Yoga Alliance 200h Certified; Pilates Reformer Certified',
  '{"Mon": ["09:00","10:00","14:00","15:00"], "Wed": ["09:00","10:00","14:00","15:00"], "Fri": ["09:00","10:00","14:00","15:00"], "Sat": ["08:00","09:00","10:00","11:00"]}'
),
(
  9,
  'Huấn luyện viên thể hình và calisthenics với 4 năm kinh nghiệm. Chuyên thiết kế chương trình giảm mỡ, tăng cơ và phục hồi chức năng. Sở hữu chứng chỉ NSCA-CPT và Functional Movement Specialist.',
  '{"height": 175, "weight": 72, "chest": 98, "bicep": 36, "waist": 78, "forearm": 28, "thigh": 56, "calf": 38}',
  '4',
  'Chứng chỉ NSCA-CPT; Top 10 Physique - Mr. Vietnam 2022; Best Transformation Coach - ActiveGym 2023',
  '{"Tue": ["06:00","07:00","08:00","19:00","20:00"], "Thu": ["06:00","07:00","08:00","19:00","20:00"], "Sat": ["06:00","07:00","08:00","09:00"], "Sun": ["09:00","10:00","11:00"]}'
);

-- Only member_id=1 has account_id=4 (member@gym.com). Other members have no login account.
INSERT INTO "Member" ("full_name", "phone", "email", "gender", "dob", "address", "account_id") VALUES
('Nguyễn Văn A', '0910000001', 'mem1@test.com',  'Male', '1990-01-01', 'Hà Nội', 4),
('Nguyễn Văn B', '0910000002', 'mem2@test.com',  'Male', '1991-01-01', 'Hà Nội', NULL),
('Nguyễn Văn C', '0910000003', 'mem3@test.com',  'Male', '1992-01-01', 'Hà Nội', NULL),
('Nguyễn Văn D', '0910000004', 'mem4@test.com',  'Male', '1993-01-01', 'Hà Nội', NULL),
('Nguyễn Văn E', '0910000005', 'mem5@test.com',  'Male', '1994-01-01', 'Hà Nội', NULL),
('Nguyễn Văn F', '0910000006', 'mem6@test.com',  'Male', '1995-01-01', 'Hà Nội', NULL),
('Nguyễn Văn G', '0910000007', 'mem7@test.com',  'Male', '1996-01-01', 'Hà Nội', NULL),
('Nguyễn Văn H', '0910000008', 'mem8@test.com',  'Male', '1997-01-01', 'Hà Nội', NULL),
('Nguyễn Văn I', '0910000009', 'mem9@test.com',  'Male', '1998-01-01', 'Hà Nội', NULL),
('Nguyễn Văn J', '0910000010', 'mem10@test.com', 'Male', '1999-01-01', 'Hà Nội', NULL);

INSERT INTO "Facility" ("facility_name", "facility_type", "status", "description", "max_capacity", "current_capacity", "amenities") VALUES
('Phòng Gym Gold',     'Gym',     'Operating',   'Khu tập tạ cao cấp',         50, 15, 'Wifi, Điều hòa, Nước uống'),
('Sân Yoga Zen',       'Studio',  'Operating',   'Không gian tĩnh lặng',       20,  5, 'Thảm, Gương, Loa'),
('Hồ bơi bốn mùa',    'Pool',    'Operating',   'Nước ấm quanh năm',          30,  8, 'Tủ khóa, Khăn tắm'),
('Sân Tennis 1',       'Outdoor', 'Operating',   'Sân ngoài trời',              4,  2, 'Đèn chiếu sáng'),
('Sân Tennis 2',       'Outdoor', 'Operating',   'Sân ngoài trời',              4,  0, 'Đèn chiếu sáng'),
('Phòng Xông hơi khô', 'Spa',    'Operating',   'Thư giãn cơ bắp',            10,  2, 'Khăn, Tinh dầu'),
('Phòng Xông hơi ướt', 'Spa',    'Operating',   'Hỗ trợ hô hấp',              10,  1, 'Khăn'),
('Phòng Boxing',       'Studio',  'Operating',   'Tập luyện cường độ cao',     15,  4, 'Găng tay, Bao cát'),
('Khu Cardio A',       'Gym',     'Operating',   'Máy chạy bộ, xe đạp',       40, 10, 'Điều hòa, Tivi'),
('Khu Cardio B',       'Gym',     'Operating',   'Máy leo núi, chèo thuyền',  40,  5, 'Điều hòa');

INSERT INTO "Equipment" ("facility_id", "equipment_name", "serial_number", "quantity", "status", "purchase_date", "maintenance_deadline", "origin") VALUES
(1, 'Máy chạy bộ Kingsmith',     'KSM-001', 5, 'Broken',      '2026-01-01', '2027-01-01', 'Trung Quốc'),
(1, 'Tạ đòn Olympic',             'TDO-001', 4, 'Broken',      '2026-01-05', '2027-01-05', 'Việt Nam'),
(2, 'Thảm Yoga cao cấp',          'THM-001',20, 'New',         '2026-02-01', '2027-02-01', 'Đài Loan'),
(3, 'Hệ thống lọc nước hồ',       'LOC-001', 1, 'Operating',   '2025-12-10', '2026-12-10', 'Mỹ'),
(4, 'Lưới Tennis tiêu chuẩn',     'LUI-001', 1, 'New',         '2026-03-01', '2027-03-01', 'Việt Nam'),
(6, 'Máy xông hơi khô',           'XHK-001', 1, 'Maintenance', '2026-01-20', '2027-01-20', 'Nhật Bản'),
(7, 'Máy xông hơi ướt',           'XHU-001', 1, 'Maintenance', '2026-01-20', '2027-01-20', 'Nhật Bản'),
(8, 'Bao cát Boxing Pro',          'BOX-001', 4, 'Operating',   '2026-01-15', '2027-01-15', 'Thái Lan'),
(9, 'Xe đạp tập Impulse',          'XDT-001', 6, 'New',         '2026-02-10', '2027-02-10', 'Trung Quốc'),
(10,'Máy chèo thuyền (Rower)',     'CTH-001', 3, 'Broken',      '2026-03-05', '2027-03-05', 'Mỹ');

INSERT INTO "ServiceCategory" ("category_name", "benefits_description", "allowed_gender") VALUES
('VIP',         'Truy cập mọi khu vực, sử dụng phòng xông hơi, yoga, gym, hồ bơi', 'All'),
('Normal',      'Khu vực Gym cơ bản',                                                'All'),
('Female-only', 'Khu vực riêng cho nữ, Yoga, Spa',                                  'Female');

INSERT INTO "MembershipPackage" ("category_id", "package_name", "duration_days", "price", "is_active") VALUES
(1, 'Gói VIP Tháng',     30,  1000000, true),
(2, 'Gói Cơ Bản Tháng',  30,   500000, true),
(3, 'Gói Nữ Tháng',      30,    50000, true),
(1, 'Gói VIP nửa năm',  180, 5000000, true),
(3, 'Gói Nữ nửa năm',   180, 2500000, true),
(1, 'Gói VIP 1 năm',    365,10000000, true);

INSERT INTO "Subscription" ("member_id", "package_id", "registration_date", "start_date", "end_date", "status") VALUES
(1,  1, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date,  'Active'),
(2,  2, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date,  'Active'),
(3,  1, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date,  'Active'),
(4,  3, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date,  'Active'),
(5,  4, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '180 days')::date, 'Active'),
(6,  2, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date,  'Active'),
(7,  4, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '180 days')::date, 'Active'),
(8,  3, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date,  'Active'),
(9,  6, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '365 days')::date, 'Active'),
(10, 3, CURRENT_TIMESTAMP, CURRENT_DATE, (CURRENT_DATE + INTERVAL '30 days')::date,  'Active');

INSERT INTO "Invoice" ("member_id", "subscription_id", "total_amount", "payment_status", "payment_method", "notes") VALUES
(1,  1,  1000000, 'Paid', 'Cash',          'Thanh toán gói VIP Tháng'),
(2,  2,   500000, 'Paid', 'Bank Transfer', 'Thanh toán gói Cơ Bản Tháng'),
(3,  3,  1000000, 'Paid', 'Card',          'Thanh toán gói VIP Tháng'),
(4,  4,    50000, 'Paid', 'Cash',          'Thanh toán gói Nữ Tháng'),
(5,  5,  5000000, 'Paid', 'Bank Transfer', 'Thanh toán gói VIP nửa năm'),
(6,  6,   500000, 'Paid', 'Cash',          'Thanh toán gói Cơ Bản Tháng'),
(7,  7,  5000000, 'Paid', 'Card',          'Thanh toán gói VIP nửa năm'),
(8,  8,    50000, 'Paid', 'Cash',          'Thanh toán gói Nữ Tháng'),
(9,  9, 10000000, 'Paid', 'Bank Transfer', 'Thanh toán gói VIP 1 năm'),
(10,10,    50000, 'Paid', 'Card',          'Thanh toán gói Nữ Tháng');

-- TrainingBooking và TrainingSession: để trống, add thủ công qua giao diện

INSERT INTO "Feedback" ("member_id", "processor_id", "equipment_id", "content", "sent_at", "resolution_note", "status", "rating") VALUES
(1,  1, 1,  'Máy chạy bộ số 1 hay bị kẹt băng tải',    '2026-04-10 08:30:00', 'Đã bảo trì xong, máy chạy mượt',        'Resolved', 4),
(2,  4, 2,  'Tạ đơn 10kg bị rỉ sét phần tay cầm',      '2026-04-11 09:15:00', 'Đang đợi thay mới',                     'Pending',  2),
(3,  8, 3,  'Thảm tập Yoga bị rách ở góc',              '2026-04-12 10:00:00', 'Đã thay thảm mới cho hội viên',         'Resolved', 5),
(4,  1, 4,  'Hệ thống lọc nước kêu to quá',             '2026-04-13 14:20:00', 'Kiểm tra motor, bôi trơn lại',          'Resolved', 3),
(5,  4, 5,  'Lưới tennis bị chùng, khó chơi',           '2026-04-14 15:45:00', 'Đã căng lại lưới',                      'Resolved', 4),
(6,  8, 6,  'Phòng xông hơi khô không đủ nóng',         '2026-04-15 16:10:00', 'Chỉnh lại cảm biến nhiệt',              'Resolved', 4),
(7,  1, 7,  'Máy xông ướt bị rò nước ra sàn',           '2026-04-16 09:00:00', 'Đang chờ linh kiện sửa chữa',           'Pending',  1),
(8,  4, 8,  'Bao cát Boxing bị móp một bên',             '2026-04-17 11:30:00', 'Sẽ bọc lại da và thêm bông',            'Pending',  3),
(9,  8, 9,  'Xe đạp Impulse phát tiếng kêu lạ',         '2026-04-18 10:00:00', 'Đã vệ sinh và tra dầu',                 'Resolved', 5),
(10, 1, 10, 'Máy chèo thuyền bị lỏng ốc vít',           '2026-04-19 08:45:00', 'Đã siết chặt lại toàn bộ ốc',           'Resolved', 5);
