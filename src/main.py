import sys
from PyQt5.QtWidgets import *
from components import *

class MyWindow(QMainWindow):
    def __init__(self):
        super(MyWindow, self).__init__()

        self.TABLES = []
        self.Var = "bye"
        self.setWindowTitle("PyQt5 Boilerplate")
        self.setGeometry(100, 100, 400, 300)

        self.central_widget = QWidget(self)
        self.setCentralWidget(self.central_widget)
        self.layout = QVBoxLayout()
        self.label = QLabel(self.Var, self.central_widget)
        self.layout.addWidget(self.label)
        #CHeader(self.central_widget, self.layout, self.TABLES)
        #CTableBar(self.central_widget, self.layout, self.TABLES)

        self.button = QPushButton("reload App", self.central_widget)
        self.button.clicked.connect(self.Update)
        self.layout.addWidget(self.button)

        self.central_widget.setLayout(self.layout)
    def Update(self):
        self.Var = "heelo"
        print(self.Var)




if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MyWindow()
    window.show()
    sys.exit(app.exec_())
