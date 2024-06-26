import axios from 'axios';
import { logger } from '../../utils/logger';
import type { IPInfo } from '../../common/interfaces/ipInfo.interface';

export async function getCurrentIpInfo() {
    try {
        const response = await axios.get<IPInfo>("https://ipinfo.io/json");
        logger.info(
          `🌍 IP Location: City - ${response.data.city}, Country - ${response.data.country}`
        );
    } catch (error) {
        logger.error('❌ Error fetching IP info:', error);
    }
}
