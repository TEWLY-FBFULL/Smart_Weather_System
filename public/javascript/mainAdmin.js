import { getServerStats } from './adminGetServerStats.js';
import { getUser } from './adminGetUser.js';
import { getAdminLog } from './adminGetAdminLog.js';

async function loadData() {
    await getServerStats();
    await getUser();
    await getAdminLog();
}

window.onload = loadData;