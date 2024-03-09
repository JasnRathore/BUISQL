import eel
import mysql.connector
import json
import datetime

with open("config/config.json",'r') as ConfigFile:
    ConfigData: dict = json.load(ConfigFile)
    SqlConn = mysql.connector.connect(
        host = ConfigData['HOST'],
        user = ConfigData['USER'],
        password = ConfigData['PASSWORD']
        )
Cursor  = SqlConn.cursor()

def CheckForDate(TableData: list) -> list:
    FirstRow: tuple = TableData[0]
    flag: bool = False
    Indexes: list = []

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
def GetListOfDatabases() -> list:
    global Cursor
    Cursor.execute('SHOW DATABASES;')
    ListOfDatabases = [row[0] for row in Cursor.fetchall()]
    return ListOfDatabases

@eel.expose
def GetListOfTables(DatabaseName: str) -> list:
    global Cursor
    Cursor.execute(f"SELECT table_name AS table_name FROM information_schema.tables WHERE table_schema = '{DatabaseName}'; ")
    ListOfTables = [row[0] for row in Cursor.fetchall()]
    return ListOfTables

@eel.expose
def GetTableData(DatabaseName: str,TableName: str)-> tuple:
    global Cursor
    Cursor.execute(f"USE {DatabaseName}")
    Cursor.execute(f"""SELECT column_name
FROM information_schema.columns
WHERE table_name = '{TableName}'
AND table_schema = '{DatabaseName}'
ORDER BY ordinal_position;""")
    Headers: list = [row[0] for row in Cursor.fetchall()]
    Cursor.execute(f"SELECT * FROM {TableName}")
    TableData: list = Cursor.fetchall()
    TableData = CheckForDate(TableData)
    return (Headers, TableData)


eel.start("index.html")
