const { invoke } = window.__TAURI__.tauri;

async function getListOfDatabases() {
  let data = await invoke("get_list_of_databases");
  return data;
}

function ToggletTree(DBid) {
  const Parts = document.getElementById(DBid).children;
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

async function Terminal_log(Message) {
    console.log(Message);
    const Data = JSON.stringify(Message);
    try {
      await invoke("terminal_log", { message: Data});
    } catch (error) {
      console.log(error);
    }
}


window.addEventListener("DOMContentLoaded", () => {

  document.getElementById("SUB").addEventListener("click", (e) => {
    e.preventDefault();
    let listOfDatabases = getListOfDatabases();
  });

  const tempDBS = document.querySelectorAll(".DB");
  for (let i = 0; i < tempDBS.length; i+=1 ) {
    const DB = tempDBS[i];
    const Parts = DB.children
    Parts[0].addEventListener("click", (e) => {
      ToggletTree((e.target).id);
      e.preventDefault();
    })
  }


  console.log("DOMContentLoaded");
});

