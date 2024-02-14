#![allow(non_snake_case)]
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command


#[tauri::command]
fn RustLog(message: &str){
    println!("{}", message);
}

#[tauri::command]
fn GetDBS() -> Vec<String> {
    let mut data: Vec<String> = Vec::new();
    data.push("Jasn".to_owned());
    data.push("Jordan".to_owned());
    data.push("Wick".to_owned());
    return data
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![RustLog])
        .invoke_handler(tauri::generate_handler![GetDBS])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

