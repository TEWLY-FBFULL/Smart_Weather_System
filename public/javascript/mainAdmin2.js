import { getTableWithTableName, getTableWithKeyword } from './adminTableDropdown.js';
import { tableConfig } from './adminTableConfig.js';

const createBtn = document.getElementById("create-btn");
const tableSelect = document.getElementById("tabledb");
const allowedTables = ["roles", "cities", "keywords", "weather_description"];
const searchInput = document.querySelector(".search input");

async function loadData() {
    getTableWithTableName(tableConfig);
    toggleCreateButton();
}

tableSelect.addEventListener("change", function() {
    getTableWithTableName(tableConfig);
    toggleCreateButton();
    searchInput.value = "";
});

searchInput.addEventListener("input", debounce(() => {
    getTableWithKeyword(searchInput, tableConfig);
    toggleCreateButton();
}, 500));

function toggleCreateButton() {
    createBtn.hidden = !allowedTables.includes(tableSelect.value);
}

function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
}

window.onload = loadData;