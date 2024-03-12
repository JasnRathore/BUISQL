async function terminalLog(Message) {
  console.log(Message);
  const Data = JSON.stringify(Message);
  try {
    eel.TerminalLog(Data);
  } catch (error) {
    console.log(error);
  }
}

async function getConfigData() {
  const response = await eel.GetConfigData()();
  return response;
}

async function setConfigData(data) {
  await eel.SetConfigData(data);
}

async function connectToMysql() {
  await eel.ConnectToMysql();
}

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
      UpdateTableView(databaseName, tableName);
  });

    return newTableWidget;
}

async function UpdateTableView(databaseName, tableName) {
    const newTable = document.createElement("table");
    newTable.classList.add('table-auto');
    const [headers, tableData] = await getTableData(databaseName, tableName);
    const headersRowWidget = document.createElement("thead");
    const tempheadersRowWidget = document.createElement("tr");

    headers.forEach(header => {
      const headerWidget = document.createElement("th");
      headerWidget.classList.add('p-2');
      headerWidget.innerHTML = header;
      tempheadersRowWidget.appendChild(headerWidget);
    });

    headersRowWidget.appendChild(tempheadersRowWidget);
    newTable.appendChild(headersRowWidget);
    const tableBody = document.createElement('tbody');
    tableData.forEach(row => {
      const rowWidget = document.createElement("tr");
      row.forEach(item => {
        const itemWidget = document.createElement("td");
        itemWidget.classList.add('p-2');
        itemWidget.innerHTML += item;
        rowWidget.appendChild(itemWidget);
      });
      tableBody.appendChild(rowWidget);
    });
    newTable.appendChild(tableBody);
    const viewer = document.getElementById("viewer");
    const tableHeader = document.getElementById("tableheader");
    tableHeader.innerHTML = tableName;
    viewer.innerHTML = '';
    viewer.appendChild(newTable);
}

async function init() {
  await connectToMysql();
  const listOfDatabases = await getListOfDatabases();
  listOfDatabases.forEach((databaseName) => {
    createDatabaseWidget(databaseName);
  })
}

window.addEventListener("DOMContentLoaded", () => {

  // comment out to use right click and open context menu
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });


  const openSettingsButton = document.querySelector('#opensettingsbutton');
  const closeSettingsButton = document.querySelector('#closesettingsbutton');
  const settingsModal = document.querySelector('#settingsmodal');
  openSettingsButton.addEventListener('click', () => {
    settingsModal.showModal();
  });
  closeSettingsButton.addEventListener('click', () => {
    settingsModal.close();
  });
  const reloadButton = document.querySelector('#reloadbutton');
  reloadButton.addEventListener('click', () =>{
    location.reload();
  });

  settings();

  getConfigData().then((data) => {
    if ((data['HOST'] === "")  || (data['USER'] === "") || (data['PASSWORD'] === "")) {
      settingsModal.showModal()
    }
    else {
      init();
    }
  });
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

async function settings() {
  const settingsMenu = document.querySelector("#settingsmodal");
  const hostInput = settingsMenu.querySelector("#host");
  const userInput = settingsMenu.querySelector("#user");
  const passwordInput = settingsMenu.querySelector("#password");
  const saveButton = settingsMenu.querySelector("#savebutton");

  saveButton.addEventListener('click', () => {
    const data = {
      HOST: hostInput.value,
      USER: userInput.value,
      PASSWORD: passwordInput.value
    };
    setConfigData(data);
    location.reload();
  });
}

async function toast(message) {

}