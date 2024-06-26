import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Item } from "../../common/interfaces/baseResponse.interface";
import * as schema from "../schemas/schema";
import { eq, and } from "drizzle-orm";
import { logger } from "../../utils/logger";

export async function addItem(item: Item, db: NodePgDatabase) {
  try {
    await db.transaction(async (tx) => {
      // Step 1: Check if item exists
      logger.info(`Checking if item ${item.id} exists`);
      const existingItem = await tx
        .select({ id: schema.itemTable.id })
        .from(schema.itemTable)
        .where(eq(schema.itemTable.id, item.id))
        .limit(1)
        .execute();

      let itemResult;
      if (existingItem.length === 0) {
        logger.info(`Item ${item.id} does not exist. Inserting new item.`);
        itemResult = await tx.insert(schema.itemTable).values({
          id: item.id,
          creationDate: getCurrentOrFormattedDate(item.creationDate),
          title: item.title,
          url: item.url,
          contractId: item.contractId,
          hasUrge: item.hasUrge,
          isCertified: item.isCertified,
          isFinanced: item.isFinanced,
          isProfessional: item.seller.isProfessional,
          km: item.km,
          mainProvince: item.mainProvince,
          makeId: item.makeId,
          modelId: item.modelId,
          year: item.year,
          phone: item.phone,
          publishedDate: getCurrentOrFormattedDate(item.publishedDate),
        }).returning().execute();
      } else {
        logger.info(`Item ${item.id} already exists.`);
        itemResult = existingItem;
      }

      // Step 2: Check and update price
      logger.info(`Checking price for item ${item.id}`);
      const existingPrice = await tx
        .select({
          id: schema.priceTable.id,
          amount: schema.priceTable.amount,
        })
        .from(schema.priceTable)
        .where(and(
          eq(schema.priceTable.itemId, item.id),
          eq(schema.priceTable.amount, item.price.amount)
        ))
        .limit(1)
        .execute();

      let priceResult;
      if (existingPrice.length === 0) {
        logger.info(`Inserting new price for item ${item.id}`);
        priceResult = await tx.insert(schema.priceTable).values({
          amount: item.price.amount,
          itemId: item.id,
          currentTimeOfPrice: getCurrentOrFormattedDate(undefined),
        }).returning().execute();
      } else {
        logger.info(`Price for item ${item.id} already up to date`);
        priceResult = existingPrice;
      }

      // Step 3: Insert resources
      logger.info(`Inserting resources for item ${item.id}`);
      for (const resource of item.resources) {
        try {
          await tx
            .insert(schema.resourceTable)
            .values({ ...resource, itemId: item.id })
            .onConflictDoNothing()
            .execute();
        } catch (error) {
          logger.error(`Error inserting resource for item ${item.id}:`, error);
        }
      }

      // Step 4: Check and insert seller
      logger.info(`Checking seller for item ${item.id}`);
      const existingSeller = await tx
        .select({ id: schema.sellerTable.id })
        .from(schema.sellerTable)
        .where(eq(schema.sellerTable.contractId, item.seller.contractId))
        .limit(1)
        .execute();

      let sellerResult;
      if (existingSeller.length === 0) {
        logger.info(`Inserting new seller for item ${item.id}`);
        sellerResult = await tx.insert(schema.sellerTable).values(item.seller).returning().execute();
      } else {
        logger.info(`Seller for item ${item.id} already exists`);
        sellerResult = existingSeller;
      }

      // Step 5: Check and insert location
      logger.info(`Checking location for item ${item.id}`);
      const locationQuery = tx
        .select({
          id: schema.locationTable.id,
          provinceIds: schema.locationTable.provinceIds,
          mainProvince: schema.locationTable.mainProvince,
          mainProvinceId: schema.locationTable.mainProvinceId,
          cityId: schema.locationTable.cityId,
          cityLiteral: schema.locationTable.cityLiteral,
        })
        .from(schema.locationTable);

      if (item.location.cityId) {
        locationQuery.where(eq(schema.locationTable.cityId, item.location.cityId));
      } else {
        locationQuery.where(eq(schema.locationTable.mainProvinceId, item.location.mainProvinceId));
      }

      const existingLocation = await locationQuery.limit(1).execute();

      let locationResult;
      if (existingLocation.length === 0) {
        logger.info(`Inserting new location for item ${item.id}`);
        locationResult = await tx.insert(schema.locationTable).values(item.location).returning().execute();
      } else {
        logger.info(`Location for item ${item.id} already exists`);
        locationResult = existingLocation;
      }

      // Insert or update offer type
      logger.info(`Upserting offer type for item ${item.id}`);
      const offerTypeResult = await tx.insert(schema.offerTypeTable)
        .values(item.offerType)
        .onConflictDoUpdate({
          target: [schema.offerTypeTable.id],
          set: { id: item.offerType.id },
        })
        .returning()
        .execute();

      // Update item with all related IDs
      logger.info(`Updating item ${item.id} with related IDs`);
      await tx.update(schema.itemTable)
        .set({
          priceId: priceResult[0].id,
          sellerId: sellerResult[0].id,
          locationId: locationResult[0].id,
          offerTypeId: offerTypeResult[0].id,
          warranty: item.warranty?.literal ?? null,
        })
        .where(eq(schema.itemTable.id, item.id))
        .execute();

      logger.info(`Item ${item.id} successfully processed and updated`);
    });
  } catch (error) {
    logger.error(`Error processing item ${item.id}:`, error);
    throw error;
  }
}

function getCurrentOrFormattedDate(date: string | undefined): string {
  if (date) {
    return new Date(date).toISOString();
  }
  return new Date().toISOString();
}