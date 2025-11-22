ALTER TABLE "project_tasks" ALTER COLUMN "name" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "project_tasks" ALTER COLUMN "state" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_tasks" ADD COLUMN "order" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "project_tasks" ADD CONSTRAINT "project_tasks_project_id_order_unique" UNIQUE("project_id","order");