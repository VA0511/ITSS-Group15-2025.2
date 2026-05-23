-- =============================================================================
-- SEED DATA  (chạy ngay sau gymdb.sql)
-- Demo target: tháng 6/2026
--
-- Account IDs:
--   1=owner  2=manager  3=pt(Khoa)  4=mem1  5=pt2(Lan)  6=pt3(Hùng)
--   7-15 = mem2-mem10   16=pt4(Anh)  17=pt5(Mai)  18=pt6(Tuấn)   19-28 = mem11-mem20
-- =============================================================================

-- ─── ROLES ───────────────────────────────────────────────────────────────────
INSERT INTO "Role" ("role_name") VALUES ('OWNER'), ('MANAGER'), ('PT'), ('MEMBER');


-- ─── ACCOUNTS ────────────────────────────────────────────────────────────────
INSERT INTO "Account" ("username", "password", "role_id", "email", "is_first_login") VALUES
-- Hệ thống
('owner@gym.com',   '123456', 1, 'owner@gym.com',   false),  -- id 1
('manager@gym.com', '123456', 2, 'manager@gym.com', false),  -- id 2
-- PT
('pt@gym.com',      '123456', 3, 'pt@gym.com',      false),  -- id 3  (Khoa)
-- Member
('mem1@gym.com',    '123456', 4, 'mem1@gym.com',    false),  -- id 4
-- PT
('pt2@gym.com',     '123456', 3, 'pt2@gym.com',     false),  -- id 5  (Lan)
('pt3@gym.com',     '123456', 3, 'pt3@gym.com',     false),  -- id 6  (Hùng)
-- Member 2-10
('mem2@gym.com',    '123456', 4, 'mem2@gym.com',    false),  -- id 7
('mem3@gym.com',    '123456', 4, 'mem3@gym.com',    false),  -- id 8
('mem4@gym.com',    '123456', 4, 'mem4@gym.com',    false),  -- id 9
('mem5@gym.com',    '123456', 4, 'mem5@gym.com',    false),  -- id 10
('mem6@gym.com',    '123456', 4, 'mem6@gym.com',    false),  -- id 11
('mem7@gym.com',    '123456', 4, 'mem7@gym.com',    false),  -- id 12
('mem8@gym.com',    '123456', 4, 'mem8@gym.com',    false),  -- id 13
('mem9@gym.com',    '123456', 4, 'mem9@gym.com',    false),  -- id 14
('mem10@gym.com',   '123456', 4, 'mem10@gym.com',   false),  -- id 15
-- PT 4-6
('pt4@gym.com',     '123456', 3, 'pt4@gym.com',     false),  -- id 16 (Anh - Aerobic)
('pt5@gym.com',     '123456', 3, 'pt5@gym.com',     false),  -- id 17 (Mai - Yoga)
('pt6@gym.com',     '123456', 3, 'pt6@gym.com',     false),  -- id 18 (Tuấn - Boxing)
-- Member 11-20
('mem11@gym.com',   '123456', 4, 'mem11@gym.com',   false),  -- id 19
('mem12@gym.com',   '123456', 4, 'mem12@gym.com',   false),  -- id 20
('mem13@gym.com',   '123456', 4, 'mem13@gym.com',   false),  -- id 21
('mem14@gym.com',   '123456', 4, 'mem14@gym.com',   false),  -- id 22
('mem15@gym.com',   '123456', 4, 'mem15@gym.com',   false),  -- id 23
('mem16@gym.com',   '123456', 4, 'mem16@gym.com',   false),  -- id 24
('mem17@gym.com',   '123456', 4, 'mem17@gym.com',   false),  -- id 25
('mem18@gym.com',   '123456', 4, 'mem18@gym.com',   false),  -- id 26
('mem19@gym.com',   '123456', 4, 'mem19@gym.com',   false),  -- id 27
('mem20@gym.com',   '123456', 4, 'mem20@gym.com',   false);  -- id 28


-- ─── EMPLOYEES ───────────────────────────────────────────────────────────────
INSERT INTO "Employee" ("full_name", "phone", "position", "salary", "account_id", "gender", "dob", "email", "address") VALUES
('Nguyễn Văn An',  '0901000001', 'MANAGER',  25000000,  2,    'Male',   '1990-05-15', 'an.nv@gym.com',     'Hà Nội'    ),
('Trần Minh Khoa', '0901000002', 'PT',        18000000,  3,    'Male',   '1995-08-20', 'khoa.tran@gym.com', 'Hà Nội'    ),
('Lê Hoàng Cường', '0901000003', 'SALE',      12000000,  NULL, 'Male',   '1998-12-10', 'cuong.lh@gym.com',  'Đà Nẵng'   ),
('Phạm Mai Dung',  '0901000004', 'CS_STAFF',  10000000,  NULL, 'Female', '2000-02-28', 'dung.pm@gym.com',   'Cần Thơ'   ),
('Nguyễn Thị Lan', '0901000005', 'PT',        16000000,  5,    'Female', '1994-06-05', 'lan.nt@gym.com',    'TP.HCM'    ),
('Đỗ Thu Phương',  '0901000006', 'SALE',      11000000,  NULL, 'Female', '1997-09-15', 'phuong.dt@gym.com', 'Huế'       ),
('Vũ Văn Giang',   '0901000007', 'CS_STAFF',   7000000,  NULL, 'Male',   '1999-11-11', 'giang.vv@gym.com',  'Nha Trang' ),
('Bùi Thị Hiền',   '0901000008', 'MANAGER',   22000000,  NULL, 'Female', '1992-03-30', 'hien.bt@gym.com',   'Bình Dương'),
('Phạm Văn Hùng',  '0901000009', 'PT',        15000000,  6,    'Male',   '1996-07-07', 'hung.pv@gym.com',   'Vũng Tàu'  ),
('Lý Thu Ký',      '0901000010', 'CS_STAFF',   6000000,  NULL, 'Female', '1993-01-22', 'ky.lt@gym.com',     'Đồng Nai'  ),
('Trần Đức Anh',   '0901000011', 'PT',        17000000, 16,    'Male',   '1993-04-12', 'anh.td@gym.com',    'Hà Nội'    ),
('Nguyễn Thị Mai', '0901000012', 'PT',        16500000, 17,    'Female', '1997-07-25', 'mai.nt@gym.com',    'TP.HCM'    ),
('Lê Minh Tuấn',   '0901000013', 'PT',        18500000, 18,    'Male',   '1991-11-03', 'tuan.lm@gym.com',   'Đà Nẵng'   );


-- ─── PT DETAIL ───────────────────────────────────────────────────────────────
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
),
(
  11,
  'Chuyên gia Aerobic và HIIT với 7 năm kinh nghiệm. Cựu vận động viên thể dục nhịp điệu quốc gia. Chứng chỉ ACE Group Fitness và Les Mills BODYCOMBAT.',
  '{"height": 180, "weight": 74, "chest": 100, "bicep": 37, "waist": 79, "forearm": 28, "thigh": 57, "calf": 39}',
  '7',
  'HCV Aerobic Đồng đội - Giải Quốc gia 2019; Chứng chỉ ACE Group Fitness; Les Mills BODYCOMBAT Certified',
  '{"Mon": ["06:00","07:00","08:00","17:00","18:00","19:00"], "Tue": ["06:00","07:00","08:00","17:00","18:00","19:00"], "Wed": ["06:00","07:00","08:00","17:00","18:00","19:00"], "Thu": ["06:00","07:00","08:00","17:00","18:00","19:00"], "Fri": ["06:00","07:00","08:00","17:00","18:00","19:00"], "Sat": ["07:00","08:00","09:00","10:00"], "Sun": ["08:00","09:00","10:00"]}'
),
(
  12,
  'Huấn luyện viên Yoga và Dưỡng sinh 6 năm. Tốt nghiệp Yoga Alliance 300h, chuyên trị liệu cột sống và cân bằng tâm lý. Từng giảng dạy tại các spa 5 sao Đà Lạt và Phú Quốc.',
  '{"height": 160, "weight": 50, "chest": 82, "bicep": 24, "waist": 60, "forearm": 20, "thigh": 50, "calf": 33}',
  '6',
  'Yoga Alliance 300h RYT; Giải thưởng Best Yoga Instructor - FitExpo 2024; Yin Yoga & Restorative Certified',
  '{"Mon": ["08:00","09:00","10:00","14:00","15:00","16:00"], "Wed": ["08:00","09:00","10:00","14:00","15:00","16:00"], "Fri": ["08:00","09:00","10:00","14:00","15:00","16:00"], "Sat": ["07:00","08:00","09:00","10:00","11:00"], "Sun": ["09:00","10:00","11:00","14:00","15:00"]}'
),
(
  13,
  'Huấn luyện viên Boxing và MMA 8 năm kinh nghiệm. Cựu võ sĩ hạng Welterweight tại giải Boxing toàn quốc. Chứng chỉ AIBA Level 2 Coach và USA Boxing Coach.',
  '{"height": 177, "weight": 78, "chest": 105, "bicep": 40, "waist": 82, "forearm": 31, "thigh": 60, "calf": 41}',
  '8',
  'HCB Boxing Hạng 69kg - Giải Quốc gia 2018; AIBA Level 2 Coach Certified; USA Boxing Coach Certified',
  '{"Mon": ["07:00","08:00","09:00","18:00","19:00","20:00"], "Tue": ["07:00","08:00","09:00","18:00","19:00","20:00"], "Thu": ["07:00","08:00","09:00","18:00","19:00","20:00"], "Fri": ["07:00","08:00","09:00","18:00","19:00","20:00"], "Sat": ["08:00","09:00","10:00","11:00"], "Sun": ["10:00","11:00","14:00","15:00"]}'
);


-- ─── MEMBERS ─────────────────────────────────────────────────────────────────
INSERT INTO "Member" ("full_name", "phone", "email", "gender", "dob", "address", "account_id") VALUES
('Nguyễn Văn A',    '0910000001', 'mem1@gym.com',  'Male',   '1990-01-01', 'Hà Nội',     4 ),
('Nguyễn Văn B',    '0910000002', 'mem2@gym.com',  'Male',   '1991-01-01', 'Hà Nội',     7 ),
('Nguyễn Văn C',    '0910000003', 'mem3@gym.com',  'Male',   '1992-01-01', 'Hà Nội',     8 ),
('Nguyễn Văn D',    '0910000004', 'mem4@gym.com',  'Male',   '1993-01-01', 'Hà Nội',     9 ),
('Nguyễn Văn E',    '0910000005', 'mem5@gym.com',  'Male',   '1994-01-01', 'Hà Nội',     10),
('Nguyễn Văn F',    '0910000006', 'mem6@gym.com',  'Male',   '1995-01-01', 'Hà Nội',     11),
('Nguyễn Văn G',    '0910000007', 'mem7@gym.com',  'Male',   '1996-01-01', 'Hà Nội',     12),
('Nguyễn Văn H',    '0910000008', 'mem8@gym.com',  'Male',   '1997-01-01', 'Hà Nội',     13),
('Nguyễn Văn I',    '0910000009', 'mem9@gym.com',  'Male',   '1998-01-01', 'Hà Nội',     14),
('Nguyễn Văn J',    '0910000010', 'mem10@gym.com', 'Male',   '1999-01-01', 'Hà Nội',     15),
('Phạm Thị Lan',    '0920000011', 'mem11@gym.com', 'Female', '1995-03-10', 'Hà Nội',     19),
('Hoàng Văn Bình',  '0920000012', 'mem12@gym.com', 'Male',   '1992-07-22', 'TP.HCM',     20),
('Vũ Thị Cẩm',      '0920000013', 'mem13@gym.com', 'Female', '1998-11-15', 'Đà Nẵng',    21),
('Đặng Quốc Dũng',  '0920000014', 'mem14@gym.com', 'Male',   '1989-05-08', 'Cần Thơ',    22),
('Bùi Thị Emilia',  '0920000015', 'mem15@gym.com', 'Female', '2000-01-30', 'Hải Phòng',  23),
('Lý Văn Phong',    '0920000016', 'mem16@gym.com', 'Male',   '1994-09-18', 'Huế',        24),
('Trịnh Thị Giang', '0920000017', 'mem17@gym.com', 'Female', '1996-12-05', 'Nha Trang',  25),
('Ngô Đình Hải',    '0920000018', 'mem18@gym.com', 'Male',   '1991-04-27', 'Bình Dương', 26),
('Đinh Thị Iris',   '0920000019', 'mem19@gym.com', 'Female', '1997-08-14', 'Vũng Tàu',   27),
('Cao Minh Khoa',   '0920000020', 'mem20@gym.com', 'Male',   '1993-06-20', 'Đồng Nai',   28);


-- ─── FACILITIES ──────────────────────────────────────────────────────────────
INSERT INTO "Facility" ("facility_name", "facility_type", "status", "description", "max_capacity", "current_capacity", "amenities") VALUES
('Phòng Gym VIP',      'Gym',    'Operating', 'Khu tập cao cấp dành riêng cho hội viên VIP. Trang bị đầy đủ máy móc hiện đại, không gian rộng rãi, ánh sáng chuyên nghiệp và hệ thống điều hòa inverter tiêu chuẩn quốc tế.',                                                 40, 12, 'Điều hòa inverter, WiFi tốc độ cao, Nước uống miễn phí, Tủ khóa VIP, Phòng thay đồ riêng, Màn hình tivi, Gương toàn thân'),
('Phòng Yoga',         'Studio', 'Operating', 'Không gian yoga tĩnh lặng, rộng rãi với ánh sáng tự nhiên và sàn gỗ ấm áp. Thích hợp cho các lớp Hatha, Vinyasa và Yin Yoga. Học viên được cung cấp đầy đủ dụng cụ khi tham gia.',                                             20,  6, 'Thảm Yoga cao cấp, Gạch Yoga, Dây đai tập, Gương toàn thân, Hệ thống âm thanh, Điều hòa, Khóa tủ đồ'),
('Phòng Aerobic',      'Studio', 'Operating', 'Phòng tập Aerobic rộng rãi với sàn gỗ chuyên dụng giảm chấn, hệ thống âm thanh sống động và gương toàn thân. Không gian lý tưởng cho các lớp Aerobic, Zumba và Dance Fitness.',                                                 30,  8, 'Sàn gỗ chuyên dụng, Gương toàn thân, Hệ thống âm thanh JBL, Điều hòa, Quạt thông gió, Thảm Aerobic'),
('Phòng Pilates',      'Studio', 'Operating', 'Phòng Pilates chuyên nghiệp trang bị máy Reformer cao cấp nhập khẩu từ Đức. Phù hợp cho cả người mới bắt đầu lẫn học viên nâng cao. Giảng viên được chứng nhận quốc tế STOTT Pilates.',                                         12,  4, 'Máy Pilates Reformer, Vòng Magic Circle, Thảm Pilates, Gương toàn thân, Điều hòa, Khóa tủ đồ'),
('Phòng Dưỡng sinh',   'Studio', 'Operating', 'Không gian yên tĩnh, thoáng đãng dành cho các bài tập dưỡng sinh, thái cực quyền và khí công. Sàn gỗ tự nhiên, âm nhạc thiền định nhẹ nhàng giúp tâm thể thư giãn hoàn toàn.',                                                  20,  5, 'Sàn gỗ tự nhiên, Nhạc thiền định, Gậy thể dục, Thảm tập, Quạt gió tự nhiên, Cây xanh trang trí'),
('Phòng Xông hơi khô', 'Spa',    'Operating', 'Phòng xông hơi khô (Sauna) nhiệt độ 80–100°C, hỗ trợ giải độc cơ thể, thư giãn cơ bắp sau luyện tập và cải thiện tuần hoàn máu. Phục vụ hội viên VIP và Female-only.',                                                          10,  2, 'Máy xông hơi khô Nhật Bản, Khăn tắm, Tinh dầu thư giãn, Nước uống, Đồng hồ hẹn giờ'),
('Phòng Xông hơi ướt', 'Spa',    'Operating', 'Phòng xông hơi ướt (Steam Room) với hơi nước ở 45–50°C. Hỗ trợ làm sạch lỗ chân lông, cải thiện hô hấp và giảm căng thẳng. Sử dụng sau mỗi buổi tập để phục hồi hiệu quả.',                                                    10,  1, 'Máy sinh hơi nước Nhật Bản, Khăn tắm, Ghế đá tự nhiên, Nước uống, Đèn UV khử khuẩn'),
('Phòng Boxing',       'Studio', 'Operating', 'Phòng tập Boxing chuyên nghiệp với sàn cao su chống chấn, đầy đủ bao cát và vòng boxing tiêu chuẩn. Phù hợp cho luyện tập Boxing, Kickboxing và Muay Thai cơ bản.',                                                               15,  4, 'Bao cát Boxing, Vòng Boxing, Găng tay (cho mượn), Sàn cao su, Gương toàn thân, Điều hòa'),
('Phòng Gym Cơ Bản',   'Gym',    'Operating', 'Khu tập gym tiêu chuẩn dành cho hội viên gói Cơ Bản. Trang bị tạ tự do, máy chạy bộ và các thiết bị gym phổ biến. Không gian thoải mái, phù hợp với mọi trình độ.',                                                             35, 10, 'Tạ tự do (2–40kg), Máy chạy bộ, Xe đạp tập, Điều hòa, Gương, Nước uống'),
('Phòng Gym Nữ',       'Gym',    'Operating', 'Khu tập gym dành riêng cho hội viên nữ — không gian riêng tư, an toàn và thân thiện. Trang bị thiết bị phù hợp với nhu cầu tập luyện của phụ nữ như giảm mỡ, định hình vóc dáng.',                                                25,  7, 'Tạ tay (1–15kg), Thảm tập, Máy chạy bộ nhỏ, Gương toàn thân, Điều hòa, Không gian riêng tư');


-- ─── EQUIPMENT ───────────────────────────────────────────────────────────────
INSERT INTO "Equipment" ("facility_id", "equipment_name", "serial_number", "quantity", "status", "purchase_date", "maintenance_deadline", "origin") VALUES
(1,  'Máy chạy bộ Kingsmith',       'KSM-001',  5, 'Broken',      '2026-01-01', '2027-01-01', 'Trung Quốc'),
(1,  'Tạ đòn Olympic',               'TDO-001',  4, 'Broken',      '2026-01-05', '2027-01-05', 'Việt Nam'  ),
(2,  'Thảm Yoga cao cấp',            'THM-001', 20, 'New',         '2026-02-01', '2027-02-01', 'Đài Loan'  ),
(3,  'Dàn âm thanh JBL',             'JBL-003',  1, 'Operating',   '2026-02-01', '2027-02-01', 'Mỹ'        ),
(4,  'Máy Pilates Reformer',         'PLT-004',  4, 'New',         '2026-03-01', '2028-03-01', 'Đức'       ),
(6,  'Máy xông hơi khô',             'XHK-001',  1, 'Maintenance', '2026-01-20', '2027-01-20', 'Nhật Bản'  ),
(7,  'Máy xông hơi ướt',             'XHU-001',  1, 'Maintenance', '2026-01-20', '2027-01-20', 'Nhật Bản'  ),
(8,  'Bao cát Boxing Pro',           'BOX-001',  4, 'Operating',   '2026-01-15', '2027-01-15', 'Thái Lan'  ),
(9,  'Bộ tạ tự do (2–40kg)',         'TAT-009',  3, 'Operating',   '2026-01-15', '2027-06-15', 'Việt Nam'  ),
(10, 'Máy chạy bộ NordicTrack',      'NRT-010',  5, 'New',         '2026-03-05', '2028-03-05', 'Mỹ'        ),
(1,  'Bộ tạ đòn Olympic đầy đủ',     'OLY-011',  2, 'Operating',   '2026-01-01', '2027-06-01', 'Mỹ'        ),
(1,  'Ghế tập đa năng (Adjustable)', 'ADJ-012',  5, 'Operating',   '2026-01-01', '2027-06-01', 'Đức'       ),
(1,  'Máy kéo cáp đa năng',          'CAB-013',  2, 'Operating',   '2026-01-15', '2027-06-15', 'Mỹ'        ),
(2,  'Gạch Yoga (Yoga Block)',        'YBK-014', 30, 'New',         '2026-02-01', '2028-02-01', 'Đài Loan'  ),
(2,  'Dây đai Yoga (Yoga Strap)',     'YST-015', 25, 'New',         '2026-02-01', '2028-02-01', 'Đài Loan'  ),
(3,  'Thảm Aerobic chống trượt',      'TAR-016', 25, 'New',         '2026-02-15', '2027-08-15', 'Hàn Quốc'  ),
(4,  'Vòng Magic Circle',             'VMC-017', 10, 'New',         '2026-03-01', '2028-03-01', 'Nhật Bản'  ),
(5,  'Gậy thể dục (Wooden Stick)',    'GAY-018', 15, 'Operating',   '2026-02-01', '2027-08-01', 'Việt Nam'  ),
(5,  'Thảm tập dưỡng sinh',           'THD-019', 15, 'New',         '2026-02-01', '2028-02-01', 'Đài Loan'  ),
(8,  'Vòng Boxing tiêu chuẩn',        'VBX-020',  1, 'Operating',   '2026-01-15', '2027-06-15', 'Thái Lan'  ),
(8,  'Găng tay Boxing (cho mượn)',     'GBX-021', 10, 'Operating',   '2026-01-15', '2027-01-15', 'Thái Lan'  ),
(9,  'Xe đạp tập thẳng',              'XDC-022',  4, 'Operating',   '2026-02-10', '2027-08-10', 'Trung Quốc'),
(10, 'Tạ tay bộ (1–15kg)',            'TAY-023',  3, 'New',         '2026-03-05', '2027-09-05', 'Hàn Quốc'  ),
(10, 'Thảm tập yoga/fitness',         'TMN-024', 10, 'New',         '2026-03-05', '2027-09-05', 'Đài Loan'  );


-- ─── SERVICE CATEGORIES ──────────────────────────────────────────────────────
INSERT INTO "ServiceCategory" ("category_name", "benefits_description", "allowed_gender") VALUES
('VIP',         'Truy cập mọi khu vực, gym VIP, phòng xông hơi, yoga và tất cả studio',              'All'   ),
('Normal',      'Khu vực Gym Cơ Bản, thiết bị cardio và tạ tự do',                                   'All'   ),
('Female-only', 'Phòng Gym Nữ riêng tư, an toàn; kết hợp Yoga và Spa',                               'Female'),
('Aerobic',     'Lớp học Aerobic, HIIT, Zumba cường độ cao - đốt mỡ hiệu quả',                       'All'   ),
('Yoga',        'Yoga, Pilates, Dưỡng sinh - cải thiện linh hoạt và tâm trí',                        'All'   ),
('Boxing',      'Boxing, Kickboxing, MMA - rèn sức mạnh và phản xạ',                                 'All'   ),
('Pilates',     'Pilates Reformer, Mat Pilates - phục hồi chức năng và tăng cơ lõi',                 'All'   ),
('Dưỡng sinh',  'Khí công, Thái cực quyền, thiền định - cân bằng thể chất lẫn tinh thần',            'All'   );


-- ─── MEMBERSHIP PACKAGES ─────────────────────────────────────────────────────
INSERT INTO "MembershipPackage" ("category_id", "package_name", "duration_days", "price", "is_active") VALUES
(1, 'Gói VIP Tháng',          30,  1000000, true),
(1, 'Gói VIP nửa năm',       180,  5000000, true),
(1, 'Gói VIP 1 năm',         365, 10000000, true),
(1, 'Gói VIP 3 tháng',        90,  2800000, true),
(2, 'Gói Cơ Bản Tháng',       30,   500000, true),
(2, 'Gói Cơ Bản 3 tháng',     90,  1300000, true),
(3, 'Gói Nữ Tháng',           30,    50000, true),
(3, 'Gói Nữ nửa năm',        180,  2500000, true),
(4, 'Gói Aerobic Tháng',      30,   400000, true),
(4, 'Gói Aerobic 3 tháng',    90,  1050000, true),
(4, 'Gói Aerobic 6 tháng',   180,  1900000, true),
(5, 'Gói Yoga Tháng',         30,   450000, true),
(5, 'Gói Yoga 3 tháng',       90,  1200000, true),
(5, 'Gói Yoga Trị liệu',      60,   900000, true),
(6, 'Gói Boxing Tháng',       30,   500000, true),
(6, 'Gói Boxing 3 tháng',     90,  1300000, true),
(7, 'Gói Pilates Tháng',      30,   600000, true),
(7, 'Gói Pilates 3 tháng',    90,  1600000, true),
(8, 'Gói Dưỡng sinh Tháng',   30,   300000, true),
(8, 'Gói Dưỡng sinh 6 tháng',180,  1500000, true);


-- ─── SUBSCRIPTIONS ───────────────────────────────────────────────────────────
-- Gói đang hoạt động — bắt đầu 01/06/2026
INSERT INTO "Subscription" ("member_id", "package_id", "registration_date", "start_date", "end_date", "status") VALUES
(1,   1, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(1,  12, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(2,   5, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(2,   9, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(3,   1, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(3,  15, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(4,   7, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(4,  12, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(5,   2, '2026-06-01 08:00:00', '2026-06-01', '2026-11-28', 'active'),
(5,  17, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(6,   5, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(6,  10, '2026-06-01 08:00:00', '2026-06-01', '2026-08-30', 'active'),
(7,   2, '2026-06-01 08:00:00', '2026-06-01', '2026-11-28', 'active'),
(7,  13, '2026-06-01 08:00:00', '2026-06-01', '2026-08-30', 'active'),
(7,  15, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(8,   7, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(8,  17, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(8,  19, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(9,   3, '2026-06-01 08:00:00', '2026-06-01', '2027-06-01', 'active'),
(9,  16, '2026-06-01 08:00:00', '2026-06-01', '2026-08-30', 'active'),
(9,  14, '2026-06-01 08:00:00', '2026-06-01', '2026-07-31', 'active'),
(10,  7, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(10, 20, '2026-06-01 08:00:00', '2026-06-01', '2026-11-28', 'active'),
(11,  1, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(11, 12, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(12,  4, '2026-06-01 08:00:00', '2026-06-01', '2026-08-30', 'active'),
(12, 15, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(13,  9, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(13, 19, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(14,  6, '2026-06-01 08:00:00', '2026-06-01', '2026-08-30', 'active'),
(14, 10, '2026-06-01 08:00:00', '2026-06-01', '2026-08-30', 'active'),
(15,  7, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(15, 12, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(16,  1, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(16, 15, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(17,  8, '2026-06-01 08:00:00', '2026-06-01', '2026-11-28', 'active'),
(17, 13, '2026-06-01 08:00:00', '2026-06-01', '2026-08-30', 'active'),
(18,  2, '2026-06-01 08:00:00', '2026-06-01', '2026-11-28', 'active'),
(18, 16, '2026-06-01 08:00:00', '2026-06-01', '2026-08-30', 'active'),
(19, 12, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(19,  9, '2026-06-01 08:00:00', '2026-06-01', '2026-07-01', 'active'),
(20,  3, '2026-06-01 08:00:00', '2026-06-01', '2027-06-01', 'active'),
(20, 11, '2026-06-01 08:00:00', '2026-06-01', '2026-11-28', 'active');

-- Gói đã hết hạn (lịch sử)
INSERT INTO "Subscription" ("member_id", "package_id", "registration_date", "start_date", "end_date", "status") VALUES
(1,  5, '2026-02-01 08:00:00', '2026-02-01', '2026-03-03', 'expired'),
(3,  5, '2026-01-15 08:00:00', '2026-01-15', '2026-02-14', 'expired'),
(5,  5, '2026-03-15 08:00:00', '2026-03-15', '2026-04-14', 'expired'),
(12, 9, '2026-01-05 08:00:00', '2026-01-05', '2026-02-04', 'expired'),
(14, 1, '2026-03-20 08:00:00', '2026-03-20', '2026-04-19', 'expired');


-- ─── INVOICES ────────────────────────────────────────────────────────────────
INSERT INTO "Invoice" ("member_id", "subscription_id", "total_amount", "payment_status", "payment_method", "notes") VALUES
(1,   1,  1000000, 'Paid', 'Cash',          'Gói VIP Tháng'),
(1,   2,   450000, 'Paid', 'Card',          'Gói Yoga Tháng - combo VIP'),
(2,   3,   500000, 'Paid', 'Bank Transfer', 'Gói Cơ Bản Tháng'),
(2,   4,   400000, 'Paid', 'Cash',          'Gói Aerobic Tháng'),
(3,   5,  1000000, 'Paid', 'Card',          'Gói VIP Tháng'),
(3,   6,   500000, 'Paid', 'Bank Transfer', 'Gói Boxing Tháng - combo VIP'),
(4,   7,    50000, 'Paid', 'Cash',          'Gói Nữ Tháng'),
(4,   8,   450000, 'Paid', 'Cash',          'Gói Yoga Tháng - combo Nữ'),
(5,   9,  5000000, 'Paid', 'Bank Transfer', 'Gói VIP nửa năm'),
(5,  10,   600000, 'Paid', 'Card',          'Gói Pilates Tháng - combo VIP'),
(6,  11,   500000, 'Paid', 'Cash',          'Gói Cơ Bản Tháng'),
(6,  12,  1050000, 'Paid', 'Bank Transfer', 'Gói Aerobic 3 tháng'),
(7,  13,  5000000, 'Paid', 'Card',          'Gói VIP nửa năm'),
(7,  14,  1200000, 'Paid', 'Card',          'Gói Yoga 3 tháng - combo VIP'),
(7,  15,   500000, 'Paid', 'Cash',          'Gói Boxing Tháng - combo VIP'),
(8,  16,    50000, 'Paid', 'Cash',          'Gói Nữ Tháng'),
(8,  17,   600000, 'Paid', 'Bank Transfer', 'Gói Pilates Tháng - combo Nữ'),
(8,  18,   300000, 'Paid', 'Cash',          'Gói Dưỡng sinh Tháng - combo Nữ'),
(9,  19, 10000000, 'Paid', 'Bank Transfer', 'Gói VIP 1 năm'),
(9,  20,  1300000, 'Paid', 'Card',          'Gói Boxing 3 tháng - combo VIP'),
(9,  21,   900000, 'Paid', 'Bank Transfer', 'Gói Yoga Trị liệu - combo VIP'),
(10, 22,    50000, 'Paid', 'Card',          'Gói Nữ Tháng'),
(10, 23,  1500000, 'Paid', 'Card',          'Gói Dưỡng sinh 6 tháng - combo Nữ'),
(11, 24,  1000000, 'Paid', 'Cash',          'Gói VIP Tháng'),
(11, 25,   450000, 'Paid', 'Card',          'Gói Yoga Tháng - combo VIP'),
(12, 26,  2800000, 'Paid', 'Bank Transfer', 'Gói VIP 3 tháng'),
(12, 27,   500000, 'Paid', 'Cash',          'Gói Boxing Tháng - combo VIP 3T'),
(13, 28,   400000, 'Paid', 'Card',          'Gói Aerobic Tháng'),
(13, 29,   300000, 'Paid', 'Cash',          'Gói Dưỡng sinh Tháng - combo Aerobic'),
(14, 30,  1300000, 'Paid', 'Bank Transfer', 'Gói Cơ Bản 3 tháng'),
(14, 31,  1050000, 'Paid', 'Card',          'Gói Aerobic 3 tháng - combo Cơ bản'),
(15, 32,    50000, 'Paid', 'Cash',          'Gói Nữ Tháng'),
(15, 33,   450000, 'Paid', 'Card',          'Gói Yoga Tháng - combo Nữ'),
(16, 34,  1000000, 'Paid', 'Bank Transfer', 'Gói VIP Tháng'),
(16, 35,   500000, 'Paid', 'Cash',          'Gói Boxing Tháng - combo VIP'),
(17, 36,  2500000, 'Paid', 'Card',          'Gói Nữ nửa năm'),
(17, 37,  1200000, 'Paid', 'Bank Transfer', 'Gói Yoga 3 tháng - combo Nữ'),
(18, 38,  5000000, 'Paid', 'Card',          'Gói VIP nửa năm'),
(18, 39,  1300000, 'Paid', 'Cash',          'Gói Boxing 3 tháng - combo VIP'),
(19, 40,   450000, 'Paid', 'Bank Transfer', 'Gói Yoga Tháng'),
(19, 41,   400000, 'Paid', 'Card',          'Gói Aerobic Tháng - combo Yoga'),
(20, 42, 10000000, 'Paid', 'Bank Transfer', 'Gói VIP 1 năm'),
(20, 43,  1900000, 'Paid', 'Card',          'Gói Aerobic 6 tháng - combo VIP'),
(1,  44,   500000, 'Paid', 'Cash',          'Gia hạn Gói Cơ Bản Tháng (đã hết hạn)'),
(3,  45,   500000, 'Paid', 'Cash',          'Gia hạn Gói Cơ Bản Tháng (đã hết hạn)'),
(5,  46,   500000, 'Paid', 'Card',          'Gia hạn Gói Cơ Bản Tháng (đã hết hạn)'),
(12, 47,   400000, 'Paid', 'Cash',          'Gói Aerobic Tháng (đã hết hạn)'),
(14, 48,  1000000, 'Paid', 'Bank Transfer', 'Gói VIP Tháng (đã hết hạn)');


-- ─── FEEDBACK ────────────────────────────────────────────────────────────────
INSERT INTO "Feedback" ("member_id", "processor_id", "equipment_id", "content", "sent_at", "resolution_note", "status", "rating") VALUES
(1,   1,  1, 'Máy chạy bộ số 1 hay bị kẹt băng tải',           '2026-04-10 08:30:00', 'Đã bảo trì xong, máy chạy mượt',            'Resolved', 4),
(2,   4,  2, 'Tạ đòn Olympic bị trầy xước phần tay cầm',        '2026-04-11 09:15:00', 'Đang đợi thay mới',                          'Pending',  2),
(3,   8,  3, 'Thảm Yoga bị rách ở góc',                         '2026-04-12 10:00:00', 'Đã thay thảm mới cho hội viên',              'Resolved', 5),
(4,   1,  4, 'Dàn âm thanh JBL phát ra tiếng rè',               '2026-04-13 14:20:00', 'Đã kiểm tra và vệ sinh loa',                 'Resolved', 3),
(5,   4,  5, 'Máy Pilates Reformer bị kẹt đường ray',           '2026-04-14 15:45:00', 'Đã tra dầu và căn chỉnh lại',               'Resolved', 4),
(6,   8,  6, 'Phòng xông hơi khô không đủ nóng',                '2026-04-15 16:10:00', 'Chỉnh lại cảm biến nhiệt',                  'Resolved', 4),
(7,   1,  7, 'Máy xông ướt bị rò nước ra sàn',                  '2026-04-16 09:00:00', 'Đang chờ linh kiện sửa chữa',               'Pending',  1),
(8,   4,  8, 'Bao cát Boxing bị móp một bên',                   '2026-05-02 11:30:00', 'Sẽ bọc lại da và thêm bông',                'Pending',  3),
(9,   8,  9, 'Bộ tạ tự do thiếu tạ 20kg',                      '2026-05-10 10:00:00', 'Đã bổ sung tạ còn thiếu',                   'Resolved', 5),
(10,  1, 10, 'Máy chạy bộ NordicTrack phát tiếng kêu lạ',       '2026-05-15 08:45:00', 'Đã vệ sinh và tra dầu băng tải',            'Resolved', 5);


-- ─── TRAINING BOOKINGS ───────────────────────────────────────────────────────
-- completed: tháng 4–5/2026  |  accepted/pending: tháng 6/2026  |  rejected: tháng 5/2026
INSERT INTO "TrainingBooking"
  ("member_id","pt_id","requested_start","requested_end","training_plan_note","status","intensity","roadmap_goal","member_free_schedule","rejection_reason")
VALUES
-- ── PT 2 (Khoa - Strength) ──
(1,  2,'2026-05-03 07:00:00','2026-05-03 08:00:00','Tăng cơ ngực và vai',                    'Completed','High',  'Tăng 5kg cơ trong 3 tháng',               '{"Mon":"07:00","Wed":"07:00","Fri":"07:00"}',''),
(3,  2,'2026-05-08 08:00:00','2026-05-08 09:00:00','Giảm mỡ bụng, tăng cơ lưng',            'Completed','Medium','Giảm 8kg mỡ trong 4 tháng',               '{"Tue":"08:00","Thu":"08:00","Sat":"08:00"}',''),
(12, 2,'2026-05-13 09:00:00','2026-05-13 10:00:00','Phục hồi sau chấn thương vai',           'Completed','Low',   'Phục hồi hoàn toàn và trở lại tập nặng',  '{"Mon":"09:00","Thu":"09:00"}',''),
(18, 2,'2026-06-07 07:00:00','2026-06-07 08:00:00','Strength training cơ bản',               'Accepted', 'Medium','Xây dựng nền tảng sức mạnh',              '{"Mon":"07:00","Wed":"07:00","Fri":"07:00"}',''),
(16, 2,'2026-06-08 17:00:00','2026-06-08 18:00:00','Deadlift và Squat kỹ thuật',             'Accepted', 'High',  'Thi đấu powerlifting',                    '{"Tue":"17:00","Thu":"17:00","Sat":"09:00"}',''),
(5,  2,'2026-06-18 08:00:00','2026-06-18 09:00:00','Chương trình tăng cơ toàn thân',         'Pending',  'High',  'Tăng 10kg cơ trong 6 tháng',              '{"Mon":"08:00","Wed":"08:00","Fri":"08:00"}',''),
(20, 2,'2026-05-18 09:00:00','2026-05-18 10:00:00','Tập theo chương trình VIP',              'Rejected', 'High',  'Tham gia Mr. Vietnam',                    '{"Mon":"09:00"}','PT không có lịch trống giờ này, vui lòng chọn khung giờ khác'),
(9,  2,'2026-06-22 17:00:00','2026-06-22 18:00:00','Olympic lifting - Snatch và Clean&Jerk', 'Pending',  'High',  'Nâng cao kỹ thuật Olympic lifting',       '{"Wed":"17:00","Fri":"17:00"}',''),
-- ── PT 5 (Lan - Yoga/Pilates) ──
(4,  5,'2026-05-05 09:00:00','2026-05-05 10:00:00','Yoga trị liệu đau lưng',                 'Completed','Low',   'Hết đau lưng mãn tính',                   '{"Mon":"09:00","Wed":"09:00","Fri":"09:00"}',''),
(8,  5,'2026-05-11 14:00:00','2026-05-11 15:00:00','Pilates cải thiện tư thế',               'Completed','Low',   'Cải thiện tư thế, giảm gù lưng',          '{"Tue":"14:00","Thu":"14:00"}',''),
(15, 5,'2026-06-06 09:00:00','2026-06-06 10:00:00','Yoga dành cho người mới bắt đầu',        'Accepted', 'Low',   'Cân bằng tâm lý và thể chất',             '{"Mon":"09:00","Wed":"09:00","Fri":"09:00"}',''),
(17, 5,'2026-06-07 14:00:00','2026-06-07 15:00:00','Yoga giảm stress sau công việc',          'Accepted', 'Low',   'Giảm stress, ngủ ngon hơn',               '{"Wed":"14:00","Fri":"14:00","Sat":"10:00"}',''),
(19, 5,'2026-06-19 10:00:00','2026-06-19 11:00:00','Yoga kết hợp thiền định',                 'Pending',  'Low',   'Cải thiện sức khỏe tinh thần',            '{"Mon":"10:00","Wed":"10:00"}',''),
(11, 5,'2026-05-20 14:00:00','2026-05-20 15:00:00','Pilates Reformer cá nhân',               'Rejected', 'Medium','Tăng cơ lõi và linh hoạt',                '{"Sat":"14:00"}','Thiết bị Reformer đang bảo trì, vui lòng chọn ngày khác'),
(13, 5,'2026-06-21 09:00:00','2026-06-21 10:00:00','Yoga dành cho vận động viên',            'Pending',  'Medium','Tăng tính linh hoạt và phục hồi',         '{"Wed":"09:00","Fri":"09:00"}',''),
-- ── PT 9 (Hùng - Calisthenics) ──
(2,  9,'2026-05-01 07:00:00','2026-05-01 08:00:00','Calisthenics cơ bản - muscle up',        'Completed','High',  'Học được muscle up trong 2 tháng',         '{"Tue":"07:00","Thu":"07:00","Sat":"07:00"}',''),
(6,  9,'2026-05-15 19:00:00','2026-05-15 20:00:00','Giảm mỡ kết hợp calisthenics',           'Completed','Medium','Giảm 6kg và tăng sức bền',                '{"Tue":"19:00","Thu":"19:00"}',''),
(14, 9,'2026-06-06 08:00:00','2026-06-06 09:00:00','Handstand và ring training',             'Accepted', 'High',  'Tự đứng được handstand',                  '{"Sat":"07:00","Sun":"09:00"}',''),
(7,  9,'2026-06-08 20:00:00','2026-06-08 21:00:00','Chương trình nâng cao - front lever',    'Accepted', 'High',  'Hoàn thiện front lever và planche',       '{"Tue":"20:00","Thu":"20:00"}',''),
(10, 9,'2026-06-18 07:00:00','2026-06-18 08:00:00','Calisthenics nhẹ cho người cao tuổi',    'Pending',  'Low',   'Duy trì sức khỏe và linh hoạt',           '{"Sat":"09:00","Sun":"10:00"}',''),
(18, 9,'2026-05-21 19:00:00','2026-05-21 20:00:00','Kết hợp Strength và Calisthenics',       'Rejected', 'High',  'Xây dựng cơ thể toàn diện',               '{"Tue":"19:00"}','Member chưa đủ nền tảng cho chương trình này, cần tập thêm 1 tháng cơ bản'),
(20, 9,'2026-06-23 08:00:00','2026-06-23 09:00:00','Chuẩn bị thi đấu Calisthenics',          'Pending',  'High',  'Đạt top 3 giải Calisthenics Hà Nội',      '{"Sat":"07:00","Sun":"09:00"}',''),
-- ── PT 11 (Anh - Aerobic) ──
(2,  11,'2026-04-28 06:00:00','2026-04-28 07:00:00','HIIT cho người mới',                    'Completed','Medium','Tăng sức bền cardio',                     '{"Mon":"06:00","Wed":"06:00","Fri":"06:00"}',''),
(13, 11,'2026-05-09 17:00:00','2026-05-09 18:00:00','Zumba kết hợp Aerobic',                 'Completed','Medium','Giảm 5kg và có dáng đẹp',                 '{"Tue":"17:00","Thu":"17:00","Sat":"08:00"}',''),
(6,  11,'2026-06-06 07:00:00','2026-06-06 08:00:00','HIIT nâng cao giảm mỡ',                 'Accepted', 'High',  'Giảm 10kg trong 3 tháng',                 '{"Mon":"07:00","Tue":"07:00","Thu":"07:00"}',''),
(19, 11,'2026-06-07 17:00:00','2026-06-07 18:00:00','Aerobic kết hợp bài tập tim mạch',      'Accepted', 'Medium','Cải thiện sức khỏe tim mạch',             '{"Tue":"17:00","Thu":"17:00"}',''),
(14, 11,'2026-06-19 18:00:00','2026-06-19 19:00:00','Aerobic và HIIT phối hợp',              'Pending',  'High',  'Tăng sức bền tổng thể',                   '{"Mon":"18:00","Wed":"18:00","Fri":"18:00"}',''),
(20, 11,'2026-05-17 06:00:00','2026-05-17 07:00:00','Cardio dành cho powerlifter',           'Rejected', 'Medium','Tăng sức bền không ảnh hưởng sức mạnh',   '{"Mon":"06:00"}','Lịch của PT đã kín giờ này'),
(16, 11,'2026-06-21 07:00:00','2026-06-21 08:00:00','Cardio kết hợp strength',               'Pending',  'High',  'Cải thiện sức bền và đốt mỡ',             '{"Mon":"07:00","Fri":"07:00"}',''),
(1,  11,'2026-06-24 17:00:00','2026-06-24 18:00:00','Aerobic buổi chiều sau giờ làm',        'Pending',  'Medium','Duy trì cân nặng lý tưởng',               '{"Tue":"17:00","Thu":"17:00"}',''),
-- ── PT 12 (Mai - Yoga) ──
(15, 12,'2026-05-07 08:00:00','2026-05-07 09:00:00','Yoga cơ bản cho người mới',             'Completed','Low',   'Giảm đau lưng và stress',                 '{"Mon":"08:00","Wed":"08:00","Fri":"08:00"}',''),
(10, 12,'2026-05-14 14:00:00','2026-05-14 15:00:00','Dưỡng sinh cho người trung niên',       'Completed','Low',   'Cải thiện sức khỏe tổng thể',             '{"Wed":"14:00","Sat":"09:00"}',''),
(17, 12,'2026-06-06 10:00:00','2026-06-06 11:00:00','Yoga sâu - Yin Yoga',                   'Accepted', 'Low',   'Thư giãn sâu và phục hồi',                '{"Mon":"10:00","Wed":"10:00","Fri":"10:00"}',''),
(4,  12,'2026-06-08 15:00:00','2026-06-08 16:00:00','Yoga tiếp theo sau buổi trị liệu',      'Accepted', 'Low',   'Duy trì không đau lưng',                  '{"Tue":"15:00","Thu":"15:00"}',''),
(11, 12,'2026-06-20 09:00:00','2026-06-20 10:00:00','Power Yoga cho người năng động',        'Pending',  'Medium','Kết hợp yoga và thể lực',                 '{"Mon":"09:00","Thu":"09:00","Sat":"10:00"}',''),
(8,  12,'2026-05-19 14:00:00','2026-05-19 15:00:00','Pilates mat level 2',                   'Rejected', 'Medium','Tăng cường cơ lõi',                       '{"Tue":"14:00"}','Buổi này đã có member khác đặt trước'),
(13, 12,'2026-06-22 16:00:00','2026-06-22 17:00:00','Yoga phục hồi sau tập nặng',            'Pending',  'Low',   'Tăng tính linh hoạt',                     '{"Wed":"16:00","Fri":"16:00"}',''),
-- ── PT 13 (Tuấn - Boxing) ──
(3,  13,'2026-04-25 07:00:00','2026-04-25 08:00:00','Boxing cơ bản - kỹ thuật đấm',          'Completed','Medium','Học boxing để tự vệ',                     '{"Mon":"07:00","Wed":"07:00","Fri":"07:00"}',''),
(7,  13,'2026-05-12 19:00:00','2026-05-12 20:00:00','Kickboxing nâng cao',                   'Completed','High',  'Thi đấu giải nghiệp dư',                  '{"Tue":"19:00","Thu":"19:00","Sat":"09:00"}',''),
(16, 13,'2026-06-06 18:00:00','2026-06-06 19:00:00','Boxing giảm stress',                    'Accepted', 'High',  'Rèn luyện sức mạnh và tư duy chiến thuật','{"Mon":"18:00","Thu":"18:00","Fri":"18:00"}',''),
(12, 13,'2026-06-07 08:00:00','2026-06-07 09:00:00','MMA cơ bản kết hợp Boxing',             'Accepted', 'High',  'Học MMA toàn diện',                       '{"Tue":"08:00","Thu":"08:00","Sat":"08:00"}',''),
(18, 13,'2026-06-19 19:00:00','2026-06-19 20:00:00','Nâng cao kỹ thuật jab-cross-hook',      'Pending',  'High',  'Chuẩn bị thi đấu',                        '{"Mon":"19:00","Wed":"19:00","Fri":"19:00"}',''),
(9,  13,'2026-05-16 07:00:00','2026-05-16 08:00:00','Boxing conditioning cho powerlifter',   'Rejected', 'High',  'Tăng tốc độ và phản xạ',                  '{"Sat":"07:00"}','PT Tuấn đang có giải đấu tuần này, vui lòng đặt lại'),
(20, 13,'2026-06-08 08:00:00','2026-06-08 09:00:00','Chuẩn bị thể lực thi boxing',           'Pending',  'High',  'Đạt HCV Boxing nghiệp dư',                '{"Mon":"08:00","Wed":"08:00","Fri":"08:00"}',''),
(14, 13,'2026-06-21 07:00:00','2026-06-21 08:00:00','Boxing cơ bản buổi sáng',               'Pending',  'Medium','Học boxing để giữ dáng và tự vệ',         '{"Mon":"07:00","Wed":"07:00","Fri":"07:00"}',''),

-- ── Bổ sung lịch PT 2 (Khoa - Strength) ──
(4,  2,'2026-06-05 07:00:00','2026-06-05 08:00:00','Tập chân - Squat và Lunge nâng cao',      'Accepted', 'Medium','Cải thiện sức mạnh chân và tư thế',       '{"Mon":"07:00","Thu":"07:00"}',''),
(8,  2,'2026-06-09 17:00:00','2026-06-09 18:00:00','Tăng cơ vai và tay sau',                  'Accepted', 'High',  'Cơ bắp phần trên cân đối',               '{"Tue":"17:00","Fri":"17:00"}',''),
(6,  2,'2026-06-12 08:00:00','2026-06-12 09:00:00','Full body workout - chương trình 3 tháng', 'Accepted', 'Medium','Tăng cân nặng và sức mạnh tổng thể',      '{"Mon":"08:00","Wed":"08:00","Sat":"08:00"}',''),
(13, 2,'2026-06-20 17:00:00','2026-06-20 18:00:00','Kỹ thuật Bench Press nâng cao',           'Pending',  'High',  'Đạt Bench Press 100kg',                   '{"Tue":"17:00","Fri":"17:00"}',''),
(19, 2,'2026-06-27 08:00:00','2026-06-27 09:00:00','Chương trình tăng cơ lõi',                'Pending',  'Medium','Tăng sức mạnh core và giảm đau lưng',     '{"Wed":"08:00","Sat":"08:00"}',''),

-- ── Bổ sung lịch PT 5 (Lan - Yoga/Pilates) ──
(7,  5,'2026-06-05 09:00:00','2026-06-05 10:00:00','Yoga nâng cao - Arm Balances',            'Accepted', 'Medium','Chinh phục các tư thế cân bằng tay',      '{"Mon":"09:00","Thu":"09:00"}',''),
(6,  5,'2026-06-09 14:00:00','2026-06-09 15:00:00','Yoga phục hồi - Restorative Yoga',        'Accepted', 'Low',   'Giảm căng cơ toàn thân sau tập nặng',    '{"Tue":"14:00","Fri":"14:00"}',''),
(12, 5,'2026-06-12 10:00:00','2026-06-12 11:00:00','Pilates cơ bản cho hội viên mới',         'Accepted', 'Low',   'Làm quen Pilates, tăng cơ lõi',           '{"Thu":"10:00","Sat":"10:00"}',''),
(20, 5,'2026-06-19 09:00:00','2026-06-19 10:00:00','Yoga toàn thân kết hợp dưỡng sinh',       'Pending',  'Low',   'Cân bằng thân tâm, giảm stress',          '{"Wed":"09:00","Sat":"09:00"}',''),
(16, 5,'2026-06-26 14:00:00','2026-06-26 15:00:00','Vinyasa Flow nâng cao',                   'Pending',  'Medium','Liên kết hơi thở và chuyển động',         '{"Mon":"14:00","Thu":"14:00"}',''),

-- ── Bổ sung lịch PT 9 (Hùng - Calisthenics) ──
(1,  9,'2026-06-03 08:00:00','2026-06-03 09:00:00','Pull-up và dip nâng cao',                 'Accepted', 'High',  'Đạt 20 pull-up liên tục',                 '{"Tue":"08:00","Thu":"08:00","Sat":"08:00"}',''),
(3,  9,'2026-06-05 19:00:00','2026-06-05 20:00:00','Calisthenics cơ bản - buổi 2',            'Accepted', 'Medium','Hoàn thiện push-up và squat kỹ thuật',    '{"Mon":"19:00","Wed":"19:00"}',''),
(5,  9,'2026-06-10 08:00:00','2026-06-10 09:00:00','Muscle up và bar training',               'Accepted', 'High',  'Học muscle up trong 6 tuần',              '{"Tue":"08:00","Fri":"08:00"}',''),
(11, 9,'2026-06-12 07:00:00','2026-06-12 08:00:00','Ring training - cơ bản',                  'Accepted', 'High',  'Kiểm soát vòng tốt trong 2 tháng',       '{"Thu":"07:00","Sat":"07:00"}',''),
(9,  9,'2026-06-17 07:00:00','2026-06-17 08:00:00','Planche và front lever',                  'Pending',  'High',  'Thi đấu Calisthenics Hà Nội',             '{"Tue":"07:00","Thu":"07:00"}',''),
(13, 9,'2026-06-20 08:00:00','2026-06-20 09:00:00','Calisthenics giảm mỡ tăng cơ',           'Pending',  'Medium','Giảm 5kg và tăng cơ tay',                 '{"Mon":"08:00","Wed":"08:00","Fri":"08:00"}',''),
(15, 9,'2026-06-24 09:00:00','2026-06-24 10:00:00','Khởi đầu Calisthenics cho người mới',    'Pending',  'Low',   'Xây nền tảng thể lực vững chắc',          '{"Sat":"09:00","Sun":"10:00"}',''),
(17, 9,'2026-06-28 07:00:00','2026-06-28 08:00:00','Dragon flag và L-sit',                    'Pending',  'High',  'Nâng cao kỹ thuật thể dục dụng cụ',      '{"Sat":"07:00","Sun":"08:00"}',''),

-- ── Bổ sung lịch PT 11 (Anh - Aerobic) ──
(4,  11,'2026-06-05 06:00:00','2026-06-05 07:00:00','Tabata training buổi sáng',              'Accepted', 'High',  'Tăng sức bền và đốt mỡ nhanh',            '{"Mon":"06:00","Wed":"06:00","Fri":"06:00"}',''),
(7,  11,'2026-06-10 17:00:00','2026-06-10 18:00:00','Dance Fitness - Zumba nâng cao',         'Accepted', 'Medium','Phối hợp nhịp điệu và đốt calories',     '{"Tue":"17:00","Thu":"17:00","Sat":"09:00"}',''),
(10, 11,'2026-06-12 06:00:00','2026-06-12 07:00:00','Circuit training toàn thân',             'Accepted', 'High',  'Tăng sức bền và sức mạnh đồng thời',     '{"Mon":"06:00","Fri":"06:00"}',''),
(12, 11,'2026-06-20 18:00:00','2026-06-20 19:00:00','Aerobic 45 phút cường độ vừa',           'Pending',  'Medium','Giữ cân nặng lý tưởng dài hạn',           '{"Tue":"18:00","Thu":"18:00"}',''),
(15, 11,'2026-06-27 07:00:00','2026-06-27 08:00:00','HIIT buổi sáng kết hợp stretching',     'Pending',  'Medium','Tăng sức khỏe tim mạch toàn diện',        '{"Mon":"07:00","Wed":"07:00","Fri":"07:00"}',''),

-- ── Bổ sung lịch PT 12 (Mai - Yoga) ──
(5,  12,'2026-06-05 08:00:00','2026-06-05 09:00:00','Ashtanga Yoga - Primary Series',         'Accepted', 'Medium','Luyện tập Yoga liên tục 6 buổi/tuần',     '{"Mon":"08:00","Wed":"08:00","Fri":"08:00"}',''),
(6,  12,'2026-06-10 14:00:00','2026-06-10 15:00:00','Yoga Nidra và thiền định sâu',           'Accepted', 'Low',   'Cải thiện giấc ngủ và giảm stress',      '{"Tue":"14:00","Thu":"14:00"}',''),
(9,  12,'2026-06-12 10:00:00','2026-06-12 11:00:00','Hatha Yoga cho người mới',               'Accepted', 'Low',   'Học Yoga từ đầu, tập thở đúng cách',     '{"Thu":"10:00","Sat":"10:00"}',''),
(18, 12,'2026-06-20 08:00:00','2026-06-20 09:00:00','Power Yoga kết hợp calisthenics nhẹ',   'Pending',  'Medium','Tăng thể lực và linh hoạt tổng thể',     '{"Mon":"08:00","Wed":"08:00"}',''),
(20, 12,'2026-06-27 16:00:00','2026-06-27 17:00:00','Prenatal Yoga - Yoga an toàn',           'Pending',  'Low',   'Duy trì sức khỏe và thư giãn',           '{"Wed":"16:00","Sat":"15:00"}',''),

-- ── Bổ sung lịch PT 13 (Tuấn - Boxing) ──
(1,  13,'2026-06-05 07:00:00','2026-06-05 08:00:00','Shadow boxing và footwork',              'Accepted', 'Medium','Cải thiện phản xạ và di chuyển',          '{"Mon":"07:00","Wed":"07:00","Fri":"07:00"}',''),
(6,  13,'2026-06-10 19:00:00','2026-06-10 20:00:00','Sparring nhẹ - kỹ thuật phòng thủ',     'Accepted', 'High',  'Hoàn thiện kỹ thuật phòng thủ cơ bản',  '{"Tue":"19:00","Thu":"19:00"}',''),
(10, 13,'2026-06-12 18:00:00','2026-06-12 19:00:00','Bag work nâng cao - combo 6 đòn',       'Accepted', 'High',  'Thành thạo các combo cơ bản',            '{"Mon":"18:00","Thu":"18:00","Fri":"18:00"}',''),
(17, 13,'2026-06-20 07:00:00','2026-06-20 08:00:00','Muay Thai cơ bản - đá và gối',          'Pending',  'High',  'Kết hợp kỹ thuật tay và chân',           '{"Tue":"07:00","Thu":"07:00","Sat":"08:00"}',''),
(19, 13,'2026-06-27 18:00:00','2026-06-27 19:00:00','Conditioning và sức bền Boxing',        'Pending',  'High',  'Tăng thể lực thi đấu dài hạn',           '{"Mon":"18:00","Wed":"18:00","Fri":"18:00"}','');


-- ─── TRAINING SESSIONS ───────────────────────────────────────────────────────
INSERT INTO "TrainingSession" ("booking_id","facility_id","session_time","attendance_status","pt_feedback")
SELECT b.id, 1, b.requested_start, 'Present', 'Buổi tập hiệu quả, kỹ thuật tốt, cần chú ý khởi động kỹ hơn'
FROM "TrainingBooking" b WHERE b.status = 'Completed' AND b.pt_id = 2 ORDER BY b.id;

INSERT INTO "TrainingSession" ("booking_id","facility_id","session_time","attendance_status","pt_feedback")
SELECT b.id, 2, b.requested_start, 'Present', 'Học viên tiến bộ rõ rệt, tư thế Yoga cải thiện nhiều'
FROM "TrainingBooking" b WHERE b.status = 'Completed' AND b.pt_id = 5 ORDER BY b.id;

INSERT INTO "TrainingSession" ("booking_id","facility_id","session_time","attendance_status","pt_feedback")
SELECT b.id, 1, b.requested_start,
       CASE WHEN b.member_id % 3 = 0 THEN 'Absent' ELSE 'Present' END,
       CASE WHEN b.member_id % 3 = 0 THEN 'Học viên vắng mặt không báo trước'
            ELSE 'Hoàn thành tốt bài Calisthenics, đang tiến gần đến Muscle Up' END
FROM "TrainingBooking" b WHERE b.status = 'Completed' AND b.pt_id = 9 ORDER BY b.id;

INSERT INTO "TrainingSession" ("booking_id","facility_id","session_time","attendance_status","pt_feedback")
SELECT b.id, 3, b.requested_start, 'Present', 'Cardio tốt, nhịp tim ổn định, cần tăng cường độ thêm ở buổi sau'
FROM "TrainingBooking" b WHERE b.status = 'Completed' AND b.pt_id = 11 ORDER BY b.id;

INSERT INTO "TrainingSession" ("booking_id","facility_id","session_time","attendance_status","pt_feedback")
SELECT b.id, 2, b.requested_start, 'Present', 'Học viên rất chăm chỉ, tư thế đẹp, tiếp tục duy trì'
FROM "TrainingBooking" b WHERE b.status = 'Completed' AND b.pt_id = 12 ORDER BY b.id;

INSERT INTO "TrainingSession" ("booking_id","facility_id","session_time","attendance_status","pt_feedback")
SELECT b.id, 8, b.requested_start,
       CASE WHEN b.member_id % 4 = 0 THEN 'Absent' ELSE 'Present' END,
       CASE WHEN b.member_id % 4 = 0 THEN 'Học viên vắng mặt, cần liên hệ lại'
            ELSE 'Kỹ thuật đấm cải thiện, tiếp tục luyện footwork' END
FROM "TrainingBooking" b WHERE b.status = 'Completed' AND b.pt_id = 13 ORDER BY b.id;

-- Sessions cho booking accepted (sắp diễn ra trong tháng 6)
INSERT INTO "TrainingSession" ("booking_id","facility_id","session_time","attendance_status","pt_feedback")
SELECT b.id, 1, b.requested_start, 'Present', ''
FROM "TrainingBooking" b WHERE b.status = 'Accepted' ORDER BY b.id;
