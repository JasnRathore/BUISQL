const { invoke } = window.__TAURI__.tauri;

let DBS= {};

//async function greet() {
//  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
//
//  greetMsgEl.textContent = await invoke("beet", { name: greetInputEl.value });
//}

async function getListOfDatabases() {
  let data = await invoke("get_list_of_databases");
  Terminal_log(data);
}

function ToggletTree(DBElm) {
  const Parts = DBElm.children
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
    getListOfDatabases();
  });

  const tempDBS = document.querySelectorAll(".DB");
  for (let i = 0; i < tempDBS.length; i+=1 ) {
    const DB = tempDBS[i];
    const Parts = DB.children
    Parts[0].addEventListener("click", (e) => {
      const DBElm = DBS[(e.target).id];
      ToggletTree(DBElm);
      e.preventDefault();
    })
    DBS[DB.id] = DB;
  }
  console.log("DOMContentLoaded");
});

const viewer = document.getElementById("viewer");
const tempicon = document.createElement("i");
