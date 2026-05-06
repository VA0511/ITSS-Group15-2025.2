-- Migration to enhance training booking and session management
-- Date: 2026-05-04

-- Enhancements for TrainingBooking
ALTER TABLE "TrainingBooking" ADD COLUMN "intensity" varchar;
ALTER TABLE "TrainingBooking" ADD COLUMN "roadmap_goal" text;
ALTER TABLE "TrainingBooking" ADD COLUMN "member_free_schedule" text;

-- Enhancements for TrainingSession
ALTER TABLE "TrainingSession" ADD COLUMN "member_confirmed_at" timestamp;
ALTER TABLE "TrainingSession" ADD COLUMN "physical_condition" text;
ALTER TABLE "TrainingSession" ADD COLUMN "session_result" text;
ALTER TABLE "TrainingSession" ADD COLUMN "nutrition_advice" text;
