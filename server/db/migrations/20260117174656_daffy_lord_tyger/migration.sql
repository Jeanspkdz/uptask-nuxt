ALTER TABLE "project_tasks" DROP CONSTRAINT "project_tasks_user_id_users_id_fkey";--> statement-breakpoint
ALTER TABLE "project_tasks" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "project_tasks" ALTER COLUMN "project_id" SET NOT NULL;