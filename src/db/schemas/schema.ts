import { arrayContains, relations, sql } from "drizzle-orm";
import {
    boolean,
    date,
    integer,
    pgEnum,
    pgTable,
    primaryKey,
    serial,
    text,
    varchar
} from "drizzle-orm/pg-core";

// Define enums
export const fuelTypeEnum = pgEnum("fuel_type", ["Eléctrico", "Gasolina"]);
export const literalEnum = pgEnum("literal", ["Nuevo", "Ocasión"]);
export const resourceTypeEnum = pgEnum("resource_type", ["IMAGE"]);

// Define tables
export const priceTable = pgTable("price", {
  id: serial("id").primaryKey(),
  amount: integer("amount").notNull(),
  itemId: varchar("item_id", { length: 50 }).notNull().references(() => itemTable.id),
  currentTimeOfPrice: date("current_time_of_price").notNull(),
});

export const resourceTable = pgTable("resource", {
  id: serial("id").primaryKey(),
  type: resourceTypeEnum("type").notNull(),
  url: text("url").notNull(),
  itemId: varchar("item_id", { length: 50 }).notNull().references(() => itemTable.id),
});

export const sellerTable = pgTable("seller", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  isProfessional: boolean("is_professional").notNull(),
  contractId: varchar("contract_id", { length: 50 }).notNull(),
});

export const locationTable = pgTable("location", {
  id: serial("id").primaryKey(),
  provinceIds: integer("province_ids").array().notNull(),
  mainProvince: varchar("main_province", { length: 255 }).notNull(),
  mainProvinceId: integer("main_province_id").notNull(),
  cityId: integer("city_id"),
  cityLiteral: varchar("city_literal", { length: 255 }),
});

export const offerTypeTable = pgTable("offer_type", {
  id: serial("id").primaryKey(),
  literal: literalEnum("literal").notNull(),
});

export const itemTable = pgTable("item", {
  id: varchar("id", { length: 50 }).primaryKey(),
  creationDate: date("creation_date").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  url: text("url").notNull(),
  priceId: integer("price_id"),
  sellerId: integer("seller_id").references(() => sellerTable.id),
  km: integer("km"),
  year: integer("year").notNull(),
  mainProvince: varchar("main_province", { length: 255 }).notNull(),
  locationId: integer("location_id").references(() => locationTable.id),
  makeId: integer("make_id").notNull(),
  modelId: integer("model_id").notNull(),
  fuelTypeId: integer("fuel_type_id"),
  isFinanced: boolean("is_financed").notNull(),
  isCertified: boolean("is_certified").notNull(),
  isProfessional: boolean("is_professional").notNull(),
  publishedDate: date("published_date").notNull(),
  hasUrge: boolean("has_urge").notNull(),
  offerTypeId: integer("offer_type_id").references(() => offerTypeTable.id),
  phone: varchar("phone", { length: 50 }).notNull(),
  contractId: varchar("contract_id", { length: 50 }).notNull(),
  cubicCapacity: integer("cubic_capacity"),
  bodyTypeId: integer("body_type_id"),
  warranty: varchar("warranty", { length: 255 }),
});

export const itemProvinceTable = pgTable(
  "item_province",
  {
    itemId: varchar("item_id", { length: 50 }).references(() => itemTable.id),
    provinceId: integer("province_id"),
  },
  (table) => {
    return {
      primaryKey: primaryKey({ columns: [table.itemId, table.provinceId] }),
    };
  }
);

export const itemPricesRelations = relations(itemTable, ({ many }) => ({
  prices: many(priceTable),
}));

export const pricesItemRelations = relations(priceTable, ({ one }) => ({
  item: one(itemTable, {
    fields: [priceTable.itemId],
    references: [itemTable.id],
  }),
}));

export const itemResourcesRelations = relations(itemTable, ({ many }) => ({
  resources: many(resourceTable),
}));

export const resourcesItemRelations = relations(resourceTable, ({ one }) => ({
  item: one(itemTable, {
    fields: [resourceTable.itemId],
    references: [itemTable.id],
  }),
}));
