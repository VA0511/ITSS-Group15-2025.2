-- Add is_active column to Member table
ALTER TABLE "Member" ADD COLUMN "is_active" boolean DEFAULT true;

-- Optional: Add index for faster queries on is_active
CREATE INDEX idx_member_is_active ON "Member"("is_active");
