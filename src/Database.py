import mysql.connector
import json

def ConnectToDB():
    global SqlConn
    with open("config/config.json",'r') as ConfigFile:
        ConfigData = json.load(ConfigFile)
        SqlConn = mysql.connector.connect(
            host = ConfigData['HOST'],
            user = ConfigData['USER'],
            password = ConfigData['PASSWORD']
        )
    return SqlConn.cursor()

def ReloadDB(DBName, TableNames):
    Cursor = ConnectToDB()
    Cursor.execute(f"USE {DBName}")
    Cursor.execute("SHOW TABLES;")
    Tables = [Row[0] for Row in Cursor.fetchall()]
    TableNames.clear()
    TableNames.extend(Tables)