CREATE TABLE "task-note" (
	"id" text,
	"description" text NOT NULL,
	"task_id" text NOT NULL,
	"user_id" text NOT NULL,
	"createdAt" timestamp(4) with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp(4) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_tasks" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "collaborators" ALTER COLUMN "createdAt" SET DATA TYPE timestamp(4) with time zone USING "createdAt"::timestamp(4) with time zone;--> statement-breakpoint
ALTER TABLE "collaborators" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp(4) with time zone USING "updatedAt"::timestamp(4) with time zone;--> statement-breakpoint
ALTER TABLE "collaborators" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_tasks" ALTER COLUMN "createdAt" SET DATA TYPE timestamp(4) with time zone USING "createdAt"::timestamp(4) with time zone;--> statement-breakpoint
ALTER TABLE "project_tasks" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp(4) with time zone USING "updatedAt"::timestamp(4) with time zone;--> statement-breakpoint
ALTER TABLE "project_tasks" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "createdAt" SET DATA TYPE timestamp(4) with time zone USING "createdAt"::timestamp(4) with time zone;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp(4) with time zone USING "updatedAt"::timestamp(4) with time zone;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "updatedAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_tasks" ADD CONSTRAINT "project_tasks_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "task-note" ADD CONSTRAINT "task-note_task_id_project_tasks_id_fkey" FOREIGN KEY ("task_id") REFERENCES "project_tasks"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "task-note" ADD CONSTRAINT "task-note_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;