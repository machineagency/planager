from string import Template
from planager.Tool import Tool
import re

# importing the module
import json
import os.path

# Opening JSON file
with open(os.path.join(os.path.dirname(__file__), "PathTemplate.tool")) as json_file:
    CONFIG = json.load(json_file)


class PathTemplate(Tool, config=CONFIG):
    def setup(self):
        self.extract_slots()

    def state_updated(self, key):
        if key == "templateString":
            self.extract_slots()

    def extract_slots(self):
        template_vars = re.compile(r"[$]\w+")
        slots = list(set(re.findall(template_vars, self.state["templateString"])))
        self.state["slots"] = slots

        for slot in slots:
            if slot not in list(self.inports.ports()):
                print(slot)
                self.addInport(slot, {})

    def inports_updated(self, inportID):

        ranges = self.inports["ranges"]

        if not ranges:
            return

        self.fill()

    def fill(self):
        path_array = []

        data_template = Template(self.inports["template"])
        path_template = Template(
            '<path fill="none" stroke="var(--planager-blue)" stroke-width="1" d="$path_data"/></path>'
        )

        for val in list(self.inports["ranges"].values())[0]:
            path_data = data_template.substitute(x=val)
            path_string = path_template.substitute(path_data=path_data)
            path_array.append(path_string)

        self.outports["pathArray"] = path_array
