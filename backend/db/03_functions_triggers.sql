-- ============================================================
-- FILE 3: HÀM VÀ TRIGGER
-- Chạy sau file 02_constraints_indexes.sql
-- ============================================================

-- ─── FUNCTION: Kiểm tra nhân viên có vị trí PT ───────────
CREATE OR REPLACE FUNCTION check_pt_position()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM "Employee"
        WHERE "id" = NEW.employee_id AND UPPER("position") IN ('PT', 'TRAINER')
    ) THEN
        RAISE EXCEPTION 'Chi nhan vien co vi tri PT moi duoc them vao bang PT_Detail';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── TRIGGER: Gắn vào PT_Detail ──────────────────────────
CREATE TRIGGER trg_check_pt_position
BEFORE INSERT OR UPDATE ON "PT_Detail"
FOR EACH ROW EXECUTE FUNCTION check_pt_position();
