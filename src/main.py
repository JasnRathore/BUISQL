import sys
from PyQt5.QtWidgets import *
from components import *

class MyWindow(QMainWindow):
    def __init__(self):
        super(MyWindow, self).__init__()

        self.TABLES = []
        self.DB = ''
        self.setWindowTitle("PyQt5 Boilerplate")
        self.setGeometry(100, 100, 400, 300)

        self.central_widget = QWidget(self)
        self.setCentralWidget(self.central_widget)
        self.layout = QVBoxLayout()

        self.Header = CHeader(self)
        self.TableBar = CTableBar(self)
        self.TableData = CTableData(self)

        self.central_widget.setLayout(self.layout)

    def UpdateTableBar(self):
        self.TableBar.updateTables(self.TABLES)


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MyWindow()
    window.show()
    sys.exit(app.exec_())
