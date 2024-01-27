import mysql.connector
import json

def ConnectToDB(DBName):
    global SqlConn
    with open("config/config.json",'r') as ConfigFile:
        ConfigData = json.load(ConfigFile)
        SqlConn = mysql.connector.connect(
            host = ConfigData['HOST'],
            user = ConfigData['USER'],
            password = ConfigData['PASSWORD'],
            database=DBName
        )
    return SqlConn.cursor()

def ReloadDB(DBName, TableNames):
    Cursor = ConnectToDB(DBName)
    Cursor.execute("SHOW TABLES;")
    Tables = [Row[0] for Row in Cursor.fetchall()]
    TableNames.clear()
    TableNames.extend(Tables)

def GetTableData(DBName, TableName):
    Cursor = ConnectToDB(DBName)
    Cursor.execute(f"SELECT * FROM {TableName};")
    Data = [Row for Row in Cursor.fetchall()]
    return Data