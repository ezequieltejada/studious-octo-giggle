import axios from "axios";
import { logger } from "./src/utils/logger";
import type {
  Item,
  Response,
} from "./src/common/interfaces/baseResponse.interface";
import { addItem } from "./src/db/scripts/addItem";
import { db } from "./src/db/db";
import { defaults } from "./src/defaults";

const url = Bun.env.BASE_URL || defaults.BASE_URL;

// Headers
const headers = {
  "X-Schibsted-Tenant": "motos",
  "Content-Type": "application/json",
};

async function fetchData(page: number = 1): Promise<void> {
  try {
    logger.info(`Fetching data for page ${page}`);

    const payload = {
      pagination: {
        page,
        size: 20,
      },
      sort: {
        order: "desc",
        term: "relevance",
      },
      filters: {},
    };

    const response = await axios.post<Response>(url, payload, { headers });
    const { items, meta } = response.data;

    const totalPages = Bun.env.TOTAL_PAGES || meta.totalPages;

    logger.info(`Received ${items.length} items for page ${page}`);
    logger.info(`Total pages: ${totalPages}`);

    for (const item of items) {
      try {
        logger.info(`Adding item: ${item.title} (${item.id})`);
        await addItem(item, db);
      } catch (error) {
        logger.error(`Error adding item ${item.id}:`, error);
      }
    }

    if (page < totalPages) {
      // Generate a random delay between 7 and 10 seconds to avoid rate limiting
      const delay = Math.floor(Math.random() * (10 - 7 + 1) + 7) * 1000;
      logger.info(`Waiting ${delay / 1000} seconds before fetching next page`);
      await Bun.sleep(delay);
      await fetchData(page + 1);
    } else {
      logger.info("All pages processed successfully");
      process.exit(0);
    }
  } catch (error) {
    logger.error(`Error fetching data for page ${page}:`, error);
    process.exit(1);
  }
}

// Start the fetching process
fetchData();
