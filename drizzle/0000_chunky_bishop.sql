CREATE TYPE "public"."drop_status" AS ENUM('draft', 'scheduled', 'live', 'ended');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending_confirmation', 'confirmed', 'shipped', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."quality_tier" AS ENUM('premium', 'primera', 'original');--> statement-breakpoint
CREATE TYPE "public"."stock_movement_type" AS ENUM('restock', 'reserve', 'release', 'sale', 'adjustment');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"slug" varchar(64) NOT NULL,
	"name" varchar(120) NOT NULL,
	"description" text NOT NULL,
	"icon_name" varchar(64) DEFAULT 'Package' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "drop_subscribers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" varchar(64) NOT NULL,
	"drop_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "drops" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(160) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"status" "drop_status" DEFAULT 'draft' NOT NULL,
	"starts_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "drops_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "fardos" (
	"id" varchar(120) PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"category_id" varchar(64) NOT NULL,
	"drop_id" uuid,
	"quality" "quality_tier" NOT NULL,
	"weight_kg" integer NOT NULL,
	"estimated_units_min" integer NOT NULL,
	"estimated_units_max" integer NOT NULL,
	"price_ars" integer NOT NULL,
	"available_stock" integer DEFAULT 0 NOT NULL,
	"reserved_stock" integer DEFAULT 0 NOT NULL,
	"is_popular" boolean DEFAULT false NOT NULL,
	"is_new_drop" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"image" text NOT NULL,
	"highlights" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "fardos_available_stock_non_negative" CHECK ("fardos"."available_stock" >= 0),
	CONSTRAINT "fardos_reserved_stock_non_negative" CHECK ("fardos"."reserved_stock" >= 0),
	CONSTRAINT "fardos_price_non_negative" CHECK ("fardos"."price_ars" >= 0),
	CONSTRAINT "fardos_weight_positive" CHECK ("fardos"."weight_kg" > 0)
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"fardo_id" varchar(120) NOT NULL,
	"fardo_title_snapshot" varchar(200) NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price_ars" integer NOT NULL,
	"subtotal_ars" integer NOT NULL,
	CONSTRAINT "order_items_quantity_positive" CHECK ("order_items"."quantity" > 0)
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_code" varchar(48) NOT NULL,
	"user_id" varchar(128),
	"customer_name" varchar(160),
	"customer_phone" varchar(64),
	"shipping_city" varchar(160),
	"status" "order_status" DEFAULT 'pending_confirmation' NOT NULL,
	"total_ars" integer NOT NULL,
	"total_weight_kg" integer NOT NULL,
	"total_estimated_units_min" integer NOT NULL,
	"total_estimated_units_max" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_code_unique" UNIQUE("order_code")
);
--> statement-breakpoint
CREATE TABLE "stock_movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fardo_id" varchar(120) NOT NULL,
	"order_id" uuid,
	"type" "stock_movement_type" NOT NULL,
	"quantity_delta" integer NOT NULL,
	"stock_before" integer NOT NULL,
	"stock_after" integer NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "drop_subscribers" ADD CONSTRAINT "drop_subscribers_drop_id_drops_id_fk" FOREIGN KEY ("drop_id") REFERENCES "public"."drops"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fardos" ADD CONSTRAINT "fardos_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fardos" ADD CONSTRAINT "fardos_drop_id_drops_id_fk" FOREIGN KEY ("drop_id") REFERENCES "public"."drops"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_fardo_id_fardos_id_fk" FOREIGN KEY ("fardo_id") REFERENCES "public"."fardos"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_fardo_id_fardos_id_fk" FOREIGN KEY ("fardo_id") REFERENCES "public"."fardos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "drop_subscribers_phone_idx" ON "drop_subscribers" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "drops_status_idx" ON "drops" USING btree ("status");--> statement-breakpoint
CREATE INDEX "fardos_category_idx" ON "fardos" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "fardos_drop_idx" ON "fardos" USING btree ("drop_id");--> statement-breakpoint
CREATE INDEX "fardos_quality_idx" ON "fardos" USING btree ("quality");--> statement-breakpoint
CREATE INDEX "order_items_order_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "orders_user_id_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "stock_movements_fardo_idx" ON "stock_movements" USING btree ("fardo_id");--> statement-breakpoint
CREATE INDEX "stock_movements_created_idx" ON "stock_movements" USING btree ("created_at");