// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use std::fmt::format;

use sqlx::{query_as, Connection, MySqlConnection};

#[derive(Debug, sqlx::FromRow)]
struct DatabaseName {
    Database: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>>  {

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![terminal_log, get_list_of_databases])
        //.invoke_handler(tauri::generate_handler![GetDBS])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}

#[tauri::command]
async fn get_list_of_databases() -> Vec<String>{
    let mut list_of_database = Vec::new();
    let database_url: &str = "mysql://root:root@localhost:3306";

    let mut connection: MySqlConnection = MySqlConnection::connect(database_url)
        .await
        .expect("Failed to connect to MySQL");

    let query = "SHOW DATABASES";

    let result: Result<Vec<DatabaseName>, sqlx::Error> = query_as::<_,DatabaseName>(query)
        .fetch_all(&mut connection)
        .await;
    match result {
        Ok(databases) => {
            for database in databases {
                list_of_database.push(database.Database);
            }
            return list_of_database;
        }
        Err(err) => {
            eprintln!("Error: {}", err);
            list_of_database.push(format!("Rust\nError: {}",err));
            return list_of_database;
        },
    }
}


#[tauri::command]
fn terminal_log(message: &str){
    println!("{}", message);
}