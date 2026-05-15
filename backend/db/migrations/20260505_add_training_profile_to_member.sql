-- Add training profile fields to Member table
ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "roadmap_goal" text;
ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "member_free_schedule" text;
