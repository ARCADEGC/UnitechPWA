DO $$
BEGIN
    CREATE TYPE "public"."paid" AS ENUM('card', 'cash', 'unpaid');
    EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$
BEGIN
    CREATE TYPE "public"."finished" AS ENUM('no', 'yes', 'canceled');
    EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint