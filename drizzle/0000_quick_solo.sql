CREATE SCHEMA "motos_schema";
--> statement-breakpoint
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
CREATE TABLE IF NOT EXISTS "motos_schema"."item_province" (
	"item_id" varchar(50),
	"province_id" integer,
	CONSTRAINT "item_province_item_id_province_id_pk" PRIMARY KEY("item_id","province_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "motos_schema"."item" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"creation_date" date DEFAULT now() NOT NULL,
	"title" varchar(255) NOT NULL,
	"url" text NOT NULL,
	"price_id" integer,
	"seller_id" integer,
	"km" integer,
	"year" integer,
	"main_province" varchar(255),
	"location_id" integer,
	"make_id" integer,
	"model_id" integer,
	"fuel_type_id" integer,
	"is_financed" boolean DEFAULT false NOT NULL,
	"is_certified" boolean DEFAULT false NOT NULL,
	"is_professional" boolean DEFAULT false NOT NULL,
	"published_date" date DEFAULT now() NOT NULL,
	"has_urge" boolean DEFAULT false NOT NULL,
	"offer_type_id" integer,
	"phone" varchar(50),
	"contract_id" varchar(50),
	"cubic_capacity" integer,
	"body_type_id" integer,
	"warranty" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "motos_schema"."location" (
	"id" serial PRIMARY KEY NOT NULL,
	"province_ids" integer[] NOT NULL,
	"main_province" varchar(255) NOT NULL,
	"main_province_id" integer NOT NULL,
	"city_id" integer,
	"city_literal" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "motos_schema"."offer_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"literal" "literal" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "motos_schema"."price" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" integer NOT NULL,
	"item_id" varchar(50) NOT NULL,
	"current_time_of_price" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "motos_schema"."resource" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "resource_type" NOT NULL,
	"url" text NOT NULL,
	"item_id" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "motos_schema"."seller" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"is_professional" boolean NOT NULL,
	"contract_id" varchar(50) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "motos_schema"."item_province" ADD CONSTRAINT "item_province_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "motos_schema"."item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "motos_schema"."item" ADD CONSTRAINT "item_seller_id_seller_id_fk" FOREIGN KEY ("seller_id") REFERENCES "motos_schema"."seller"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "motos_schema"."item" ADD CONSTRAINT "item_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "motos_schema"."location"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "motos_schema"."item" ADD CONSTRAINT "item_offer_type_id_offer_type_id_fk" FOREIGN KEY ("offer_type_id") REFERENCES "motos_schema"."offer_type"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "motos_schema"."price" ADD CONSTRAINT "price_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "motos_schema"."item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "motos_schema"."resource" ADD CONSTRAINT "resource_item_id_item_id_fk" FOREIGN KEY ("item_id") REFERENCES "motos_schema"."item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
