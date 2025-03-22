import { getServerStats } from './adminGetServerStats.js';
import { getUser } from './adminGetUser.js';

async function loadData() {
    await getServerStats();
    await getUser();
    await getAdminLog();
}

window.onload = loadData;