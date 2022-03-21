from app.planager.workflow.Action import Action

CONFIG = {
    "displayName": "Axidraw",
    "inports": {
        "xPosition": {
            "displayName": "X position",
            "description": "x position",
        },
        "yPosition": {
            "displayName": "Y position",
            "description": "y position",
        },
        "penState": {
            "displayName": "Pen State",
            "description": "TemplateAction",
        },
    },
    "outports": {
        "machineOut": {
            "displayName": "machine out",
            "description": "data from machine",
        }
    },
}


class AxidrawInit(Action, config=CONFIG):
    def init(self):
        self.connected = False
        from pyaxidraw import axidraw  # import module

        self.ad = axidraw.AxiDraw()  # Initialize class
        self.ad.interactive()  # Enter interactive context
        self.xPos = 0
        self.yPos = 0

    def connect(self, args):
        if self.connected:
            return

        self.ad.connect()  # Open serial port to AxiDraw
        self.connected = True
        return {"connected": True}

    def disconnect(self, args):
        if not self.connected:
            return
        self.ad.disconnect()
        return {"connected": False}

    def receivedData(self, inportID):
        if inportID == "penState":
            if self.inports[inportID].value:
                self.ad.penup()
            else:
                self.ad.pendown()

        if inportID == "xPosition":
            self.xPos = int(self.inports["xPosition"].value)
            self.ad.goto(self.xPos, self.yPos)
        if inportID == "yPosition":
            self.yPos = int(self.inports["yPosition"].value)
            self.ad.goto(self.xPos, self.yPos)
