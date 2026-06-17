-- ============================================================
-- FILE 5: MIGRATION CẬP NHẬT SCHEMA MỚI NHẤT
-- Dành cho các thành viên trong team đã có sẵn DB và chỉ cần cập nhật
-- Chạy file này trong pgAdmin4 > Query Tool > F5
-- ============================================================

-- Thêm cột vào bảng Member (nếu chưa có)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Member' AND column_name='avatar') THEN
        ALTER TABLE "Member" ADD COLUMN "avatar" varchar;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Member' AND column_name='roadmap_goal') THEN
        ALTER TABLE "Member" ADD COLUMN "roadmap_goal" text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Member' AND column_name='member_free_schedule') THEN
        ALTER TABLE "Member" ADD COLUMN "member_free_schedule" text;
    END IF;
END $$;

-- Thêm cột vào bảng ServiceCategory
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ServiceCategory' AND column_name='category_type') THEN
        ALTER TABLE "ServiceCategory" ADD COLUMN "category_type" varchar;
    END IF;
END $$;

-- Thêm cột vào bảng MembershipPackage
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='MembershipPackage' AND column_name='pricing_type') THEN
        ALTER TABLE "MembershipPackage" ADD COLUMN "pricing_type" varchar DEFAULT 'time_based';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='MembershipPackage' AND column_name='total_sessions') THEN
        ALTER TABLE "MembershipPackage" ADD COLUMN "total_sessions" int;
    END IF;
END $$;

-- Thêm cột vào bảng Subscription
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Subscription' AND column_name='remaining_sessions') THEN
        ALTER TABLE "Subscription" ADD COLUMN "remaining_sessions" int DEFAULT 0;
    END IF;
END $$;

-- Cập nhật dữ liệu cho các Subscription của gói theo buổi (nếu cần)
UPDATE "Subscription" s
SET remaining_sessions = mp.total_sessions
FROM "MembershipPackage" mp
WHERE s.package_id = mp.id 
  AND mp.pricing_type = 'session_based'
  AND s.remaining_sessions = 0;
