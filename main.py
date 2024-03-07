import eel
import mysql.connector
import json

with open("config/config.json",'r') as ConfigFile:
    ConfigData = json.load(ConfigFile)
    SqlConn = mysql.connector.connect(
        host = ConfigData['HOST'],
        user = ConfigData['USER'],
        password = ConfigData['PASSWORD']
)
Cursor = SqlConn.cursor()

eel.init("web")

@eel.expose
def GetListOfDatabases() -> list:
    global Cursor
    Cursor.execute('SHOW DATABASES;')
    ListOfDatabases = [row[0] for row in Cursor.fetchall()]
    return ListOfDatabases

@eel.expose
def GetListOfTables(DatabaseName) -> list:
    global Cursor
    Cursor.execute(f"SELECT table_name AS table_name FROM information_schema.tables WHERE table_schema = '{DatabaseName}';")
    ListOfTables = [row[0] for row in Cursor.fetchall()]
    return ListOfTables

eel.start("index.html")
