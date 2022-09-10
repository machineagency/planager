from pathlib import Path
from importlib import import_module
from inspect import getmembers, isclass
from types import ModuleType

from planager.Tool import Tool
from planager.logging import message, error, debug


class ToolLibrary:
    def __init__(self, tool_library_path: str):
        self.tools = {}
        self.tool_library_path = tool_library_path
        self.ignore = ["__pycache__", "utils", "knitting"]

    def build_index(self):
        p = Path(self.tool_library_path)

        tool_sets = {}
        # Iterate through the contents of the tool set directory
        for tool_set in p.iterdir():
            tool_set_name = tool_set.stem
            # Ignore things that aren't directories or that are in the ignore array
            if not tool_set.is_dir() or tool_set_name in self.ignore:
                debug("Ignoring: ", tool_set)
                continue
            # Add the tool set to the tools dict with the path
            tool_sets[tool_set_name] = {
                "tool_library_path": tool_set,
                "tools": {},
            }

            # Iterate through the contents of the tool set
            for tool_dir in tool_set.iterdir():

                tool_name = tool_dir.stem
                # Ignore things that aren't directories or that are in the ignore array
                if not tool_dir.is_dir() or tool_name in self.ignore:
                    debug("Ignoring: ", tool_dir)
                    continue

                # Look through the contents of the tool directory
                for tool in tool_dir.iterdir():
                    # Ignore things that aren't python files
                    if not tool.suffix == ".py":
                        continue

                    # The tool path is the tool parts joined minus the .py suffix
                    tool_path = ".".join(tool.parts)[:-3]

                    # Attempt to import the tool
                    try:
                        module = import_module(tool_path)
                    except Exception as e:
                        error("Could not import {}".format(tool_path))
                        error(e)
                        continue

                    try:
                        # Get the members of the module
                        for name, obj in getmembers(module):
                            # Check if the member is a class
                            if isclass(obj):
                                # Check if it is a subclass of tool
                                if issubclass(obj, Tool):
                                    if name != "Tool":
                                        tool_class = obj

                    except BaseException:
                        continue

                    tool_sets[tool_set_name]["tools"][tool_name] = {
                        "tool_path": tool,
                        "module": module,
                        "class": tool_class,
                    }

        self.tool_dict = tool_sets
        return tool_sets

    def get_tool_subclass(self, module: ModuleType):
        for name, obj in getmembers(module):
            if isclass(obj) and issubclass(obj, Tool) and name != "Tool":
                return obj
        return False

    def get_tool_class(self, tool_category, tool_name):
        try:
            tool_class = self.tool_dict[tool_category]["tools"][tool_name]["class"]
            return tool_class
        except:
            print("Error: Tool not found in this library.")
            return False

    def get_tools(self):
        tool_hierarchy = {}

        for tool_category in self.tool_dict.keys():
            category_dict = {"expanded": False, "members": {}}
            for tool in self.tool_dict[tool_category]["tools"].keys():
                category_dict["members"][tool] = {
                    "component": None,
                    "category": tool_category,
                }
            tool_hierarchy[tool_category] = category_dict

        return tool_hierarchy

    def get_tool_resource(self):
        pass

    def get_tool_config(self):
        pass

    def add_tool_package(self):
        pass

    def is_loaded(self, tool_set, tool_name):
        pass

    def report_missing_tools(self):
        pass
