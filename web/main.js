async function getListOfDatabases() {
  const data = await eel.GetListOfDatabases()();
  return data;
}

async function getListOfTables(databaseName) {
    let response = await eel.GetListOfTables(databaseName)();
    return response;
  }

async function Terminal_log(Message) {
    console.log(Message);
    const Data = JSON.stringify(Message);
    try {
      await invoke("terminal_log", { message: Data});
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
    const newTableContainer = createTableContainerWidget(listOfTableNames);
    newDatabaseWidget.appendChild(newTableContainer);

    SideBar.appendChild(newDatabaseWidget);
}

function createTableContainerWidget(listOfTableNames) {
    const tableContainerClassList = ["TABLES" ,"flex", "flex-col", "hidden"];
    const newTableContainer = document.createElement("div");
    newTableContainer.classList.add(...tableContainerClassList);
    listOfTableNames.forEach(tabelName => {
        const tempTable = createTableWidget(tabelName)
        newTableContainer.appendChild(tempTable);
    });
    return newTableContainer;
}

function createTableWidget(tabelName) {
    const newTable = document.createElement("button");
    newTable.classList.add("TableButton");
    newTable.id = tabelName;

    const treeChildIndicator = document.createElement("div");
    treeChildIndicator.classList.add("TreeSub");
    treeChildIndicator.innerHTML += "  ";

    const newTableIcon = document.createElement("img");
    newTableIcon.id = tabelName;
    newTableIcon.src = "./assets/table.svg";
    newTableIcon.classList.add(...["SideBarIcons", "mr-1", "h-5"]);

    newTable.appendChild(treeChildIndicator);
    newTable.appendChild(newTableIcon);
    newTable.innerHTML+= tabelName;
    return newTable;
}

async function init() {
  const listOfDatabases = await getListOfDatabases();
  listOfDatabases.forEach((databaseName) => {
    createDatabaseWidget(databaseName);
  })
}

window.addEventListener("DOMContentLoaded", () => {

    document.getElementById("SUB").addEventListener("click", (e) => {
        e.preventDefault();
        getListOfDatabases();
      });

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