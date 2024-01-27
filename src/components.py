from PyQt5.QtWidgets import *
from Database import ReloadDB
from PyQt5.QtCore import QObject, pyqtSignal
#C prefix stands for component

class SignalEmitter(QObject):
    updateComplete = pyqtSignal(list)

def CHeader(Parent, Layout, tables):
    Header = QWidget(Parent)
    HeaderLayout = QHBoxLayout()

    Label = QLabel("Enter DB Name:", Header)
    DBNameInput = QLineEdit(Header)
    ReloadButton = QPushButton("Reload DB",Header)
    ReloadButton.clicked.connect(lambda: ReloadDB(DBNameInput.text(), tables))
    HeaderLayout.addWidget(Label)
    HeaderLayout.addWidget(DBNameInput)
    HeaderLayout.addWidget(ReloadButton)
    Header.setLayout(HeaderLayout)
    Layout.addWidget(Header)

def CTableBar(Parent, Layout, Tables):
    TableBar = QWidget(Parent)
    TableBar.setObjectName("TableBar")
    TableBarLayout = QVBoxLayout()

    for Table in Tables:
        print(Table)
        Button = QPushButton(Table,TableBar)
        Button.setObjectName(Table)
        TableBarLayout.addWidget(Button)

    TableBar.setLayout(TableBarLayout)
    Layout.addWidget(TableBar)
