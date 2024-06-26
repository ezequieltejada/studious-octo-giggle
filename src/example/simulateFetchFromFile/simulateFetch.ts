import path from "path";
import { config } from "../../config";
import { logger } from "../../utils/logger";
import { addItem } from "../../db/scripts/addItem";
import { db } from "../../db/db";

const dataPath = path.join(".", config.OUTPUT_DIR, "data.json");
const bunFile = Bun.file(dataPath, { type: "application/json" });
const jsonData = await bunFile.json();

// Function to simulate the API call
export async function simulateFetch() {
  try {
    const dataItems = jsonData.items;
    logger.info(`Response data length:, ${dataItems.length}`);
    // For each item, call addItem method.
    for (let index = 0; index < dataItems.length; index++) {
      const element = dataItems[index];
      logger.info(`Adding item: ${element.title} (${element.id})`);
      // Call the addItem methodBun.sleep(delay);
      logger.info(`⌛ Waiting: 150`);
      Bun.sleep(150);
      await addItem(element, db);
    }
    logger.info("Data inserted successfully");
    process.exit(0);
  } catch (error) {
    logger.error("Error fetching data:", error);
    process.exit(1);
  }
}

await simulateFetch();