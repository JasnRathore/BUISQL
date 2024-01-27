from PyQt5.QtWidgets import *
from Database import ReloadDB, GetTableData

#C prefix stands for component

class CHeader(QWidget):
    def __init__(self, MainInstance):
        super().__init__(MainInstance.central_widget)

        self.HeaderLayout = QHBoxLayout()
        self.MainInstance = MainInstance

        self.Label = QLabel("Enter DB Name:", self)
        self.DBNameInput = QLineEdit(self)
        self.ReloadButton = QPushButton("Reload DB", self)
        self.ReloadButton.clicked.connect(self.GetTables)

        self.HeaderLayout.addWidget(self.Label)
        self.HeaderLayout.addWidget(self.DBNameInput)
        self.HeaderLayout.addWidget(self.ReloadButton)

        self.setLayout(self.HeaderLayout)
        MainInstance.layout.addWidget(self)

    def GetTables(self):
        DBName = self.DBNameInput.text()
        self.MainInstance.DB = DBName
        ReloadDB(DBName, self.MainInstance.TABLES)
        self.MainInstance.UpdateTableBar()

class CTableBar(QWidget):
    def __init__(self, MainInstance):
        super().__init__(MainInstance.central_widget)
        self.MainInstance = MainInstance
        self.setObjectName("TableBar")
        self.TableBarLayout = QVBoxLayout()

        self.setLayout(self.TableBarLayout)
        MainInstance.layout.addWidget(self)

    def updateTables(self, Tables):
        TableDataComponent = self.MainInstance.TableData
        self.clear_children()
        for Table in Tables:
            Button = QPushButton(Table, self)
            Button.setObjectName(Table)
            Button.clicked.connect(lambda: TableDataComponent.UpdateTableData(Table))
            self.TableBarLayout.addWidget(Button)

    def clear_children(self):
        for i in reversed(range(self.TableBarLayout.count())):
            # Get the widget at index i
            widget = self.TableBarLayout.itemAt(i).widget()

            self.TableBarLayout.removeWidget(widget)

            widget.deleteLater()

class CTableData(QTableWidget):
    def __init__(self, MainInstance):
        super().__init__(MainInstance.central_widget)
        self.MainInstance = MainInstance
        MainInstance.layout.addWidget(self)
    def UpdateTableData(self, TableName):
        NewData = GetTableData(self.MainInstance.DB,TableName)
        self.clearContents()
        if len(NewData) == 0:
            return
        self.setRowCount(len(NewData))
        self.setColumnCount(len(NewData[0]))
        for RowI in range(len(NewData)):
            Row = NewData[RowI]
            for Column in range(len(Row)):
                item = QTableWidgetItem(Row[Column])
                self.setItem(RowI,Column, item)
        self.resizeColumnsToContents()
        self.resizeRowsToContents()


