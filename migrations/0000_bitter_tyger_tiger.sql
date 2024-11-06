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
CREATE TABLE IF NOT EXISTS "admin_prices" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"valid_from" timestamp NOT NULL,
	CONSTRAINT "admin_prices_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_header" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer" text NOT NULL,
	"address" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"assignee" uuid NOT NULL,
	"due_date" timestamp NOT NULL,
	"order_number_part_one" integer DEFAULT 0 NOT NULL,
	"order_number_part_two" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "order_header_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_list_one" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"credit" numeric(10, 2) DEFAULT '0',
	"above_fifty" numeric(10, 2) DEFAULT '0',
	"material" numeric(10, 2) DEFAULT '0',
	CONSTRAINT "order_list_one_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_new_pck" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shipment_zone_one" numeric(10, 2) DEFAULT '0',
	"shipment_zone_two" numeric(10, 2) DEFAULT '0',
	"shipment_zone_three" numeric(10, 2) DEFAULT '0',
	"shipment_zone_four" numeric(10, 2) DEFAULT '0',
	"complete_installation_lockers" numeric(10, 2) DEFAULT '0',
	"complete_atypical" numeric(10, 2) DEFAULT '0',
	"basic_lockers" numeric(10, 2) DEFAULT '0',
	"basic_milled" numeric(10, 2) DEFAULT '0',
	"basic_atypical" numeric(10, 2) DEFAULT '0',
	"installation_digester" numeric(10, 2) DEFAULT '0',
	"installation_hob" numeric(10, 2) DEFAULT '0',
	"installation_gas_hob" numeric(10, 2) DEFAULT '0',
	"installation_lights" numeric(10, 2) DEFAULT '0',
	"installation_microwave" numeric(10, 2) DEFAULT '0',
	"installation_freezer" numeric(10, 2) DEFAULT '0',
	"installation_dishwasher" numeric(10, 2) DEFAULT '0',
	"installation_oven" numeric(10, 2) DEFAULT '0',
	"installation_faucet" numeric(10, 2) DEFAULT '0',
	"installation_milled_joint" numeric(10, 2) DEFAULT '0',
	"installation_worktop" numeric(10, 2) DEFAULT '0',
	"installation_wall_panel" numeric(10, 2) DEFAULT '0',
	"appliance_outside_of_ikea" numeric(10, 2) DEFAULT '0',
	"gas_appliance_outside_of_ikea" numeric(10, 2) DEFAULT '0',
	"tax" boolean DEFAULT false,
	"bail" numeric DEFAULT '0',
	"signature" json,
	CONSTRAINT "order_new_pck_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_pp2" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"another_service" boolean DEFAULT false,
	"time_to_finish" numeric(10, 2) DEFAULT '0',
	"contact_with_ikea" boolean DEFAULT false,
	"num_of_returns" numeric(10, 2) DEFAULT '0',
	"finished" "finished" DEFAULT 'no',
	"reason_of_cancelation" text,
	"reason_of_imposibility" text,
	"water_connection_made" boolean,
	"couplings_and_kitchen_adjustment" boolean,
	"test_dishwasher_faucet" boolean,
	"view_cuts_ok" boolean,
	"electrical_appliances_plugged_in" boolean,
	"cleaning_of_kitchen_and_installation_area" boolean,
	"electrical_test_appliances" boolean,
	"previous_damage_to_the_apartment" boolean,
	"sealing_of_worktops" boolean,
	"damage_to_flat_during_installation" boolean,
	"comment" text,
	"upper_locker" numeric(10, 2) DEFAULT '0',
	"lower_locker" numeric(10, 2) DEFAULT '0',
	"high_locker" numeric(10, 2) DEFAULT '0',
	"milled_joint" numeric(10, 2) DEFAULT '0',
	"worktop" numeric(10, 2) DEFAULT '0',
	"tailored_worktop" numeric(10, 2) DEFAULT '0',
	"wall_panel" numeric(10, 2) DEFAULT '0',
	"atypical" numeric(10, 2) DEFAULT '0',
	"unnecessary" numeric(10, 2) DEFAULT '0',
	"kitchen" numeric(10, 2) DEFAULT '0',
	"lights" numeric(10, 2) DEFAULT '0',
	"ikea" numeric(10, 2) DEFAULT '0',
	"non_ikea" numeric(10, 2) DEFAULT '0',
	"ikea_gas" numeric(10, 2) DEFAULT '0',
	"non_ikea_gas" numeric(10, 2) DEFAULT '0',
	"date" timestamp DEFAULT '2024-10-31 13:11:38.765' NOT NULL,
	"worker_signature" json,
	"custommer_signature" json,
	CONSTRAINT "order_pp2_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prices" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"valid_from" timestamp NOT NULL,
	CONSTRAINT "prices_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"salt" text NOT NULL,
	"role" boolean DEFAULT false,
	CONSTRAINT "user_id_unique" UNIQUE("id"),
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_salt_unique" UNIQUE("salt")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference_date" timestamp DEFAULT '2024-10-31 13:11:38.760' NOT NULL,
	"archived" boolean DEFAULT false,
	"paid" "paid" DEFAULT 'unpaid',
	"order_header" uuid NOT NULL,
	"order_new_pck" uuid NOT NULL,
	"order_pp2" uuid NOT NULL,
	"order_list_one" uuid NOT NULL,
	CONSTRAINT "order_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_header" ADD CONSTRAINT "order_header_assignee_user_id_fk" FOREIGN KEY ("assignee") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE restrict;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE restrict;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_order_header_order_header_id_fk" FOREIGN KEY ("order_header") REFERENCES "public"."order_header"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_order_new_pck_order_new_pck_id_fk" FOREIGN KEY ("order_new_pck") REFERENCES "public"."order_new_pck"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_order_pp2_order_pp2_id_fk" FOREIGN KEY ("order_pp2") REFERENCES "public"."order_pp2"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_order_list_one_order_list_one_id_fk" FOREIGN KEY ("order_list_one") REFERENCES "public"."order_list_one"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
