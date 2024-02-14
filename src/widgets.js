const { invoke } = window.__TAURI__.tauri;

export function createDatabaseWidget(databaseName) {
    const newDatabaseWidget = document.createElement("div");
    newDatabaseWidget.classList.add("DB");
    newDatabaseWidget.id = databaseName;
    const NewDBbutton = document.createElement("button");
}

function createTableContainerWidget(listOfTableNames) {
    const tableContainerClassList = ["TABLES" ,"flex", "flex-row", "hidden"];
    const newTableContainer = document.createElement("div");
    Newtable.classList.add(...tableContainerClassList);
    listOfTableNames.forEach(tabelName => {
        const tempTable = createTableWidget(tabelName)
        newTableContainer.appendChild(tempTable);
    });
}

function createTableWidget(tabelName) {
    const newTable = document.createElement("button");
    newTable.textContent(tabelName);
    newTable.id = tabelName;
    const treeChildIndicator = document.createElement("div");
    treeChildIndicator.classList.add("TreeSub");
    newTable.appendChild(treeChildIndicator);
    return newTable;
}