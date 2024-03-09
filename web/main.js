async function getListOfDatabases() {
  const response = await eel.GetListOfDatabases()();
  return response;
}

async function getListOfTables(databaseName) {
    const response = await eel.GetListOfTables(databaseName)();
    return response;
  }

async function getTableData(databaseName, tableName) {
  const response = await eel.GetTableData(databaseName, tableName)();
  return response;
}

async function terminalLog(Message) {
    console.log(Message);
    const Data = JSON.stringify(Message);
    try {
      eel.TerminalLog(Data);
    } catch (error) {
      console.log(error);
    }
}

async function createDatabaseWidget(databaseName) {
    const SideBar = document.getElementById("SIDEBAR");
    const newDatabaseWidget = document.createElement("div");
    newDatabaseWidget.classList.add(...["DB"]);
    newDatabaseWidget.id = databaseName;

    const newDBicon = document.createElement('img');
    newDBicon.id = databaseName;
    newDBicon.src = "./assets/chevron-right.svg"
    newDBicon.classList.add("SideBarIcons");
    newDBicon.addEventListener("click", (e) => {
        ToggletTree((e.target).id);
        e.preventDefault();
    });

    const newDBbutton = document.createElement("button");
    newDBbutton.id = databaseName;
    newDBbutton.addEventListener("click", (e) => {
        ToggletTree((e.target).id);
        e.preventDefault();
    });
    newDBbutton.classList.add("DBButton");
    newDBbutton.appendChild(newDBicon);
    newDBbutton.innerHTML += databaseName;

    newDatabaseWidget.appendChild(newDBbutton);

    const listOfTableNames = await getListOfTables(databaseName);
    const newTableContainer = createTableContainerWidget(databaseName, listOfTableNames);
    newDatabaseWidget.appendChild(newTableContainer);

    SideBar.appendChild(newDatabaseWidget);
}

function createTableContainerWidget(databaseName, listOfTableNames) {
    const tableContainerClassList = ["TABLES" ,"flex", "flex-col", "hidden"];
    const newTableContainer = document.createElement("div");
    newTableContainer.classList.add(...tableContainerClassList);
    listOfTableNames.forEach(tableName => {
        const tempTable = createTableWidget(databaseName,tableName)
        newTableContainer.appendChild(tempTable);
    });
    return newTableContainer;
}

function createTableWidget(databaseName, tableName) {
    const newTableWidget = document.createElement("button");
    newTableWidget.setAttribute("DB", databaseName);
    newTableWidget.setAttribute("table", tableName);
    newTableWidget.classList.add("TableButton");
    const treeChildIndicator = document.createElement("div");
    treeChildIndicator.classList.add("TreeSub");
    treeChildIndicator.innerHTML += "  ";

    const newTableIcon = document.createElement("img");
    newTableIcon.src = "./assets/table.svg";
    newTableIcon.classList.add(...["SideBarIcons", "mr-1", "h-5"]);

    newTableWidget.appendChild(treeChildIndicator);
    newTableWidget.appendChild(newTableIcon);
    newTableWidget.innerHTML+= tableName;

    newTableWidget.addEventListener('click', (e) => {
      const databaseName = e.target.getAttribute('DB')
      const tableName = e.target.getAttribute('table')
      terminalLog(databaseName);
  });

    return newTableWidget;
}

function UpdateTableView(databaseName, tableName) {
    const newTable = document.createElement("table");
    const [headers, tableData] = getTableData(databaseName, tableName);
    const headersRowWidget = document.createElement("tr");
    headers.forEach(header => {
      const headerWidget = document.createElement("th");
      headerWidget.innerHTML = header;
      headersRowWidget.appendChild(headerWidget);
    });
    newTable.appendChild(headersRowWidget);
    tableData.forEach(row => {
      const rowWidget = document.createElement("tr");
      row.forEach(item => {
        const itemWidget = document.createElement("td");
        itemWidget.innerHTML += item;
        rowWidget.appendChild(itemWidget);
      });
      newTable.appendChild(rowWidget);
    });
    const viewer = document.getElementById("viewer");
    viewer.innerHTML = newTable;
}


async function init() {
  const listOfDatabases = await getListOfDatabases();
  listOfDatabases.forEach((databaseName) => {
    createDatabaseWidget(databaseName);
  })
}

window.addEventListener("DOMContentLoaded", () => {

  init();

})

function ToggletTree(DBid) {
    const Parts = document.getElementById(DBid).children
    const Icon = Parts[0].children[0];
    const Tables = Parts[1];
    if (Icon.classList.contains("rotate-90")){
      Icon.classList.remove("rotate-90");
      Tables.classList.add("hidden");
    } else {
      Icon.classList.add("rotate-90");
      Tables.classList.remove("hidden");
    }
}