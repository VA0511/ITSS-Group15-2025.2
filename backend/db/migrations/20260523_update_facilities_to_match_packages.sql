-- Migration: Replace tennis courts and pool with rooms that match gym packages
-- Packages: VIP (1), Normal (2), Female-only (3), Aerobic (4), Yoga (5), Boxing (6), Pilates (7), Duong sinh (8)

-- ============================================================
-- UPDATE FACILITIES (keep IDs to avoid breaking foreign keys)
-- ============================================================

UPDATE "Facility" SET
  facility_name    = 'Phòng Gym VIP',
  facility_type    = 'Gym',
  description      = 'Khu tập cao cấp dành riêng cho hội viên VIP. Trang bị đầy đủ máy móc hiện đại, không gian rộng rãi, ánh sáng chuyên nghiệp và hệ thống điều hòa inverter tiêu chuẩn quốc tế.',
  max_capacity     = 40,
  current_capacity = 12,
  amenities        = 'Điều hòa inverter, WiFi tốc độ cao, Nước uống miễn phí, Tủ khóa VIP, Phòng thay đồ riêng, Màn hình tivi, Gương toàn thân'
WHERE id = 1;

UPDATE "Facility" SET
  facility_name    = 'Phòng Yoga',
  facility_type    = 'Studio',
  description      = 'Không gian yoga tĩnh lặng, rộng rãi với ánh sáng tự nhiên và sàn gỗ ấm áp. Thích hợp cho các lớp Hatha, Vinyasa và Yin Yoga. Học viên được cung cấp đầy đủ dụng cụ khi tham gia.',
  max_capacity     = 20,
  current_capacity = 6,
  amenities        = 'Thảm Yoga cao cấp, Gạch Yoga, Dây đai tập, Gương toàn thân, Hệ thống âm thanh, Điều hòa, Khóa tủ đồ'
WHERE id = 2;

UPDATE "Facility" SET
  facility_name    = 'Phòng Aerobic',
  facility_type    = 'Studio',
  description      = 'Phòng tập Aerobic rộng rãi với sàn gỗ chuyên dụng giảm chấn, hệ thống âm thanh sống động và gương toàn thân. Không gian lý tưởng cho các lớp Aerobic, Zumba và Dance Fitness.',
  max_capacity     = 30,
  current_capacity = 8,
  amenities        = 'Sàn gỗ chuyên dụng, Gương toàn thân, Hệ thống âm thanh JBL, Điều hòa, Quạt thông gió, Thảm Aerobic'
WHERE id = 3;

UPDATE "Facility" SET
  facility_name    = 'Phòng Pilates',
  facility_type    = 'Studio',
  description      = 'Phòng Pilates chuyên nghiệp trang bị máy Reformer cao cấp nhập khẩu từ Đức. Phù hợp cho cả người mới bắt đầu lẫn học viên nâng cao. Giảng viên được chứng nhận quốc tế STOTT Pilates.',
  max_capacity     = 12,
  current_capacity = 4,
  amenities        = 'Máy Pilates Reformer, Vòng Magic Circle, Thảm Pilates, Gương toàn thân, Điều hòa, Khóa tủ đồ'
WHERE id = 4;

UPDATE "Facility" SET
  facility_name    = 'Phòng Dưỡng sinh',
  facility_type    = 'Studio',
  description      = 'Không gian yên tĩnh, thoáng đãng dành cho các bài tập dưỡng sinh, thái cực quyền và khí công. Sàn gỗ tự nhiên, âm nhạc thiền định nhẹ nhàng giúp tâm thể thư giãn hoàn toàn.',
  max_capacity     = 20,
  current_capacity = 5,
  amenities        = 'Sàn gỗ tự nhiên, Nhạc thiền định, Gậy thể dục, Thảm tập, Quạt gió tự nhiên, Cây xanh trang trí'
WHERE id = 5;

UPDATE "Facility" SET
  facility_name    = 'Phòng Xông hơi khô',
  facility_type    = 'Spa',
  description      = 'Phòng xông hơi khô (Sauna) nhiệt độ 80–100°C, hỗ trợ giải độc cơ thể, thư giãn cơ bắp sau luyện tập và cải thiện tuần hoàn máu. Phục vụ hội viên VIP và Female-only.',
  max_capacity     = 10,
  current_capacity = 2,
  amenities        = 'Máy xông hơi khô Nhật Bản, Khăn tắm, Tinh dầu thư giãn, Nước uống, Đồng hồ hẹn giờ'
WHERE id = 6;

UPDATE "Facility" SET
  facility_name    = 'Phòng Xông hơi ướt',
  facility_type    = 'Spa',
  description      = 'Phòng xông hơi ướt (Steam Room) với hơi nước ở 45–50°C. Hỗ trợ làm sạch lỗ chân lông, cải thiện hô hấp và giảm căng thẳng. Sử dụng sau mỗi buổi tập để phục hồi hiệu quả.',
  max_capacity     = 10,
  current_capacity = 1,
  amenities        = 'Máy sinh hơi nước Nhật Bản, Khăn tắm, Ghế đá tự nhiên, Nước uống, Đèn UV khử khuẩn'
WHERE id = 7;

UPDATE "Facility" SET
  facility_name    = 'Phòng Boxing',
  facility_type    = 'Studio',
  description      = 'Phòng tập Boxing chuyên nghiệp với sàn cao su chống chấn, đầy đủ bao cát và vòng boxing tiêu chuẩn. Phù hợp cho luyện tập Boxing, Kickboxing và Muay Thai cơ bản.',
  max_capacity     = 15,
  current_capacity = 4,
  amenities        = 'Bao cát Boxing, Vòng Boxing, Găng tay (cho mượn), Sàn cao su, Gương toàn thân, Điều hòa'
WHERE id = 8;

UPDATE "Facility" SET
  facility_name    = 'Phòng Gym Cơ Bản',
  facility_type    = 'Gym',
  description      = 'Khu tập gym tiêu chuẩn dành cho hội viên gói Cơ Bản. Trang bị tạ tự do, máy chạy bộ và các thiết bị gym phổ biến. Không gian thoải mái, phù hợp với mọi trình độ.',
  max_capacity     = 35,
  current_capacity = 10,
  amenities        = 'Tạ tự do (2–40kg), Máy chạy bộ, Xe đạp tập, Điều hòa, Gương, Nước uống'
WHERE id = 9;

UPDATE "Facility" SET
  facility_name    = 'Phòng Gym Nữ',
  facility_type    = 'Gym',
  description      = 'Khu tập gym dành riêng cho hội viên nữ — không gian riêng tư, an toàn và thân thiện. Trang bị thiết bị phù hợp với nhu cầu tập luyện của phụ nữ như giảm mỡ, định hình vóc dáng.',
  max_capacity     = 25,
  current_capacity = 7,
  amenities        = 'Tạ tay (1–15kg), Thảm tập, Máy chạy bộ nhỏ, Gương toàn thân, Điều hòa, Không gian riêng tư'
WHERE id = 10;

-- ============================================================
-- UPDATE EXISTING EQUIPMENT (adjust to new rooms)
-- ============================================================

-- Equipment id=4: was "Hệ thống lọc nước hồ" (facility 3 = pool) → Aerobic room
UPDATE "Equipment" SET
  equipment_name       = 'Dàn âm thanh JBL',
  serial_number        = 'JBL-003',
  quantity             = 1,
  status               = 'Operating',
  purchase_date        = '2026-02-01',
  maintenance_deadline = '2027-02-01',
  origin               = 'Mỹ'
WHERE id = 4;

-- Equipment id=5: was "Lưới Tennis tiêu chuẩn" (facility 4 = tennis 1) → Pilates room
UPDATE "Equipment" SET
  equipment_name       = 'Máy Pilates Reformer',
  serial_number        = 'PLT-004',
  quantity             = 4,
  status               = 'New',
  purchase_date        = '2026-03-01',
  maintenance_deadline = '2028-03-01',
  origin               = 'Đức'
WHERE id = 5;

-- Equipment id=9: was "Xe đạp tập Impulse" (facility 9 = Cardio A) → Basic gym
UPDATE "Equipment" SET
  equipment_name       = 'Bộ tạ tự do (2–40kg)',
  serial_number        = 'TAT-009',
  quantity             = 3,
  status               = 'Operating',
  purchase_date        = '2026-01-15',
  maintenance_deadline = '2027-06-15',
  origin               = 'Việt Nam'
WHERE id = 9;

-- Equipment id=10: was "Máy chèo thuyền" (facility 10 = Cardio B) → Women's gym
UPDATE "Equipment" SET
  equipment_name       = 'Máy chạy bộ thương mại NordicTrack',
  serial_number        = 'NRT-010',
  quantity             = 5,
  status               = 'New',
  purchase_date        = '2026-03-05',
  maintenance_deadline = '2028-03-05',
  origin               = 'Mỹ'
WHERE id = 10;

-- ============================================================
-- INSERT NEW EQUIPMENT
-- ============================================================

INSERT INTO "Equipment" ("facility_id", "equipment_name", "serial_number", "quantity", "status", "purchase_date", "maintenance_deadline", "origin") VALUES
-- Phòng Gym VIP (id=1)
(1, 'Bộ tạ đòn Olympic đầy đủ',      'OLY-011', 2, 'Operating', '2026-01-01', '2027-06-01', 'Mỹ'),
(1, 'Ghế tập đa năng (Adjustable)',   'ADJ-012', 5, 'Operating', '2026-01-01', '2027-06-01', 'Đức'),
(1, 'Máy kéo cáp đa năng',            'CAB-013', 2, 'Operating', '2026-01-15', '2027-06-15', 'Mỹ'),

-- Phòng Yoga (id=2)
(2, 'Gạch Yoga (Yoga Block)',          'YBK-014', 30, 'New',     '2026-02-01', '2028-02-01', 'Đài Loan'),
(2, 'Dây đai Yoga (Yoga Strap)',       'YST-015', 25, 'New',     '2026-02-01', '2028-02-01', 'Đài Loan'),

-- Phòng Aerobic (id=3)
(3, 'Thảm Aerobic chống trượt',        'TAR-016', 25, 'New',     '2026-02-15', '2027-08-15', 'Hàn Quốc'),

-- Phòng Pilates (id=4)
(4, 'Vòng Magic Circle',               'VMC-017', 10, 'New',     '2026-03-01', '2028-03-01', 'Nhật Bản'),

-- Phòng Dưỡng sinh (id=5)
(5, 'Gậy thể dục (Wooden Stick)',      'GAY-018', 15, 'Operating','2026-02-01', '2027-08-01','Việt Nam'),
(5, 'Thảm tập dưỡng sinh',             'THD-019', 15, 'New',     '2026-02-01', '2028-02-01', 'Đài Loan'),

-- Phòng Boxing (id=8)
(8, 'Vòng Boxing tiêu chuẩn',          'VBX-020', 1, 'Operating','2026-01-15', '2027-06-15', 'Thái Lan'),
(8, 'Găng tay Boxing (cho mượn)',       'GBX-021',10, 'Operating','2026-01-15', '2027-01-15', 'Thái Lan'),

-- Phòng Gym Cơ Bản (id=9)
(9, 'Xe đạp tập thẳng',                'XDC-022', 4, 'Operating','2026-02-10', '2027-08-10', 'Trung Quốc'),

-- Phòng Gym Nữ (id=10)
(10,'Tạ tay bộ (1–15kg)',              'TAY-023', 3, 'New',      '2026-03-05', '2027-09-05', 'Hàn Quốc'),
(10,'Thảm tập yoga/fitness',           'TMN-024', 10,'New',      '2026-03-05', '2027-09-05', 'Đài Loan');
