// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use sqlx::{query_as, Connection, MySqlConnection};

#[derive(Debug, sqlx::FromRow)]
struct DatabaseName {
    database_name: String,
}

#[derive(Debug, sqlx::FromRow)]
struct TableName {
    table_name: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>>  {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![terminal_log, get_list_of_databases, get_list_of_tables])
        //.invoke_handler(tauri::generate_handler![GetDBS])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}

#[tauri::command]
async fn get_list_of_databases() -> Vec<String> {
    let mut list_of_database: Vec<String> = Vec::new();
    let database_url: &str = "mysql://root:root@localhost:3306";

    let mut connection: MySqlConnection = MySqlConnection::connect(database_url)
        .await
        .expect("Failed to connect to MySQL");

    let query = "SELECT schema_name AS database_name FROM information_schema.schemata";

    let result: Result<Vec<DatabaseName>, sqlx::Error> = query_as::<_,DatabaseName>(query)
        .fetch_all(&mut connection)
        .await;
    match result {
        Ok(databases) => {
            for database in databases {
                list_of_database.push(database.database_name);
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
async fn get_list_of_tables(database_name: &str) -> Result<Vec<String>, String>{
    let mut list_of_tables: Vec<String> = Vec::new();

    let database_url: String = format!("mysql://root:root@localhost:3306/{}",database_name);

    let mut connection: MySqlConnection = MySqlConnection::connect(&database_url)
        .await
        .expect("Failed to connect to MySQL");
    let query = format!("SELECT table_name AS table_name
    FROM information_schema.tables
    WHERE table_schema = '{}';
    ", &database_name);

    let result = sqlx::query_as::<_, TableName>(&query)
        .fetch_all(&mut connection)
        .await;
    match result {
        Ok(tables) => {
            for row in tables {
                list_of_tables.push(row.table_name);
            }
        },
        Err(err) => println!("Error: {}", err)
    }

    Ok(list_of_tables)
}


#[tauri::command]
fn terminal_log(message: &str){
    println!("{}", message);
}