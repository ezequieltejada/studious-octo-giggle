DO $$ BEGIN
 CREATE TYPE "public"."fuel_type" AS ENUM('Eléctrico', 'Gasolina');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."literal" AS ENUM('Nuevo', 'Ocasión');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."resource_type" AS ENUM('IMAGE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item_province" (
	"item_id" varchar(50),
	"province_id" integer,
	CONSTRAINT "item_province_item_id_province_id_pk" PRIMARY KEY("item_id","province_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "item" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"creation_date" date NOT NULL,
	"title" varchar(255) NOT NULL,
	"url" text NOT NULL,
	"price_id" integer,
	"seller_id" integer,
	"km" integer,
	"year" integer NOT NULL,
	"main_province" varchar(255) NOT NULL,
	"location_id" integer,
	"make_id" integer NOT NULL,
	"model_id" integer NOT NULL,
	"fuel_type_id" integer,
	"is_financed" boolean NOT NULL,
	"is_certified" boolean NOT NULL,
	"is_professional" boolean NOT NULL,
	"published_date" date NOT NULL,
	"has_urge" boolean NOT NULL,
	"offer_type_id" integer,
	"phone" varchar(50) NOT NULL,
	"contract_id" varchar(50) NOT NULL,
	"cubic_capacity" integer,
	"body_type_id" integer,
	"warranty" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "location" (
	"id" serial PRIMARY KEY NOT NULL,
	"province_ids" integer[] NOT NULL,
	"main_province" varchar(255) NOT NULL,
	"main_province_id" integer NOT NULL,
	"city_id" integer NOT NULL,
	"city_literal" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "offer_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"literal" "literal" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "price" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" integer NOT NULL,
	"item_id" varchar(50) NOT NULL,
	"current_time_of_price" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resource" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "resource_type" NOT NULL,
	"url" text NOT NULL,
	"item_id" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "seller" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"is_professional" boolean NOT NULL,
	"contract_id" varchar(50) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item_province" ADD CONSTRAINT "item_province_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item" ADD CONSTRAINT "item_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."seller"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item" ADD CONSTRAINT "item_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "item" ADD CONSTRAINT "item_offer_type_id_offer_type_id_fk" FOREIGN KEY ("offer_type_id") REFERENCES "public"."offer_type"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "price" ADD CONSTRAINT "price_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resource" ADD CONSTRAINT "resource_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
