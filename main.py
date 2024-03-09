import eel
import mysql.connector
import json
import datetime

with open("config/config.json",'r') as ConfigFile:
    ConfigData: dict = json.load(ConfigFile)
    SqlConn: mysql.connector.connection_cext.CMySQLConnection = mysql.connector.connect(
        host = ConfigData['HOST'],
        user = ConfigData['USER'],
        password = ConfigData['PASSWORD']
        )
Cursor: mysql.connector.cursor_cext.CMySQLCursor = SqlConn.cursor()

def CheckForDate(TableData: list[tuple]) -> list[tuple]:
    FirstRow: tuple = TableData[0]
    flag: bool = False
    Indexes: list[int] = []

    for Item in FirstRow:
        if isinstance(Item, datetime.date):
            if flag is False:
                flag = True
            Indexes.append(FirstRow.index(Item))
        elif isinstance(Item, datetime.time):
            if flag is False:
                flag = True
            Indexes.append(FirstRow.index(Item))
        elif isinstance(Item, datetime.datetime):
            if flag is False:
                flag = True
            Indexes.append(FirstRow.index(Item))

    if flag is True:
        for RowIndex in range(len(TableData)):
            Temp = list(TableData[RowIndex])
            for index in Indexes:
                Temp[index] = str(Temp[index])
            TableData[RowIndex] = tuple(Temp)

    return TableData


eel.init("web")

@eel.expose
def TerminalLog(data):
    print(data)

@eel.expose
def GetListOfDatabases() -> list[str]:
    global Cursor
    Cursor.execute('SHOW DATABASES;')
    ListOfDatabases = [row[0] for row in Cursor.fetchall()]
    return ListOfDatabases

@eel.expose
def GetListOfTables(DatabaseName: str) -> list[str]:
    global Cursor
    Cursor.execute(f"SELECT table_name AS table_name FROM information_schema.tables WHERE table_schema = '{DatabaseName}';")
    ListOfTables = [row[0] for row in Cursor.fetchall()]
    return ListOfTables

@eel.expose
def GetTableData(DatabaseName: str,TableName: str)-> tuple[list[str], list[tuple]]:
    global Cursor
    Cursor.execute(f"USE {DatabaseName}")
    Cursor.execute(f"select column_name from information_schema.columns where table_name='{TableName}'")
    Headers: list[str] = [row[0] for row in Cursor.fetchall()]
    Cursor.execute(f"SELECT * FROM {TableName}")
    TableData: list[tuple] = Cursor.fetchall()
    TableData = CheckForDate(TableData)
    return (Headers, TableData)


eel.start("index.html")
