ALTER TABLE "collaborators" DROP CONSTRAINT "collaborators_project_id_projects_id_fk";--> statement-breakpoint
ALTER TABLE "collaborators" DROP CONSTRAINT "collaborators_user_id_users_id_fk";--> statement-breakpoint
ALTER TABLE "project_tasks" DROP CONSTRAINT "project_tasks_project_id_projects_id_fk";--> statement-breakpoint
ALTER TABLE "projects" DROP CONSTRAINT "projects_user_id_users_id_fk";--> statement-breakpoint

ALTER TABLE "projects" ALTER COLUMN "id" DROP IDENTITY IF EXISTS;--> statement-breakpoint
ALTER TABLE "project_tasks" ALTER COLUMN "id" DROP IDENTITY IF EXISTS;--> statement-breakpoint

ALTER TABLE "projects" ALTER COLUMN "id" TYPE text USING id::text;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "project_tasks" ALTER COLUMN "id" TYPE text USING id::text;--> statement-breakpoint
ALTER TABLE "project_tasks" ALTER COLUMN "project_id" TYPE text USING project_id::text;--> statement-breakpoint
ALTER TABLE "collaborators" ALTER COLUMN "project_id" TYPE text USING project_id::text;--> statement-breakpoint

ALTER TABLE "projects" 
  ADD CONSTRAINT "projects_user_id_users_id_fk" 
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint

ALTER TABLE "collaborators" 
  ADD CONSTRAINT "collaborators_project_id_projects_id_fk" 
  FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE;--> statement-breakpoint

ALTER TABLE "collaborators" 
  ADD CONSTRAINT "collaborators_user_id_users_id_fk" 
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint

ALTER TABLE "project_tasks" 
  ADD CONSTRAINT "project_tasks_project_id_projects_id_fk" 
  FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE;