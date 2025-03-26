import { getTableWithTableName } from './adminTableDropdown.js';

async function loadData() {
    getTableWithTableName();
}

document.getElementById("tabledb").addEventListener("change", function() {
    getTableWithTableName();
});

window.onload = loadData;
