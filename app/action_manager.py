from pathlib import Path
from importlib import import_module
from inspect import getmembers, isclass
from types import ModuleType

from app.planager.workflow.Action import Action
from app.logging import info, error, debug


class ActionManager:
    def __init__(self, action_set_path: str):
        self.actions = {}
        self.action_set_path = action_set_path
        self.ignore = ["__pycache__", "utils", "knitting"]

    def build_action_dict(self):
        p = Path(self.action_set_path)

        action_sets = {}
        # Iterate through the contents of the action set directory
        for action_set in p.iterdir():
            action_set_name = action_set.stem
            # Ignore things that aren't directories or that are in the ignore array
            if not action_set.is_dir() or action_set_name in self.ignore:
                info("Ignoring: ", action_set)
                continue
            # Add the action set to the actions dict with the path
            action_sets[action_set_name] = {
                "action_set_path": action_set,
                "actions": {},
            }

            # Iterate through the contents of the action set
            for action_dir in action_set.iterdir():

                action_name = action_dir.stem
                # Ignore things that aren't directories or that are in the ignore array
                if not action_dir.is_dir() or action_name in self.ignore:
                    info("Ignoring: ", action_dir)
                    continue

                # Look through the contents of the action directory
                for action in action_dir.iterdir():
                    # Ignore things that aren't python files
                    if not action.suffix == ".py":
                        continue

                    # The action path is the action parts joined minus the .py suffix
                    action_path = ".".join(action.parts)[:-3]

                    # Attempt to import the action
                    try:
                        module = import_module(action_path)
                    except:
                        error("Could not import {}".format(action_path))
                        debug(action)
                        debug(action_name)
                        continue

                    try:
                        # Get the members of the module
                        for name, obj in getmembers(module):
                            # Check if the member is a class
                            if isclass(obj):
                                # Check if it is a subclass of Action
                                if issubclass(obj, Action):
                                    if name != "Action":
                                        action_class = obj

                    except BaseException:
                        continue

                    action_sets[action_set_name]["actions"][action_name] = {
                        "action_path": action,
                        "module": module,
                        "class": action_class,
                    }

        self.action_dict = action_sets
        return action_sets

    def get_action_subclass(self, module: ModuleType):
        for name, obj in getmembers(module):
            if isclass(obj) and issubclass(obj, Action) and name != "Action":
                return obj
        return False

    def get_action_class(self, action_set, action_name):
        try:
            action_class = self.action_dict[action_set]["actions"][action_name]["class"]
            return action_class
        except:
            print("Error: action does not exist.")
            return False

    def get_available_actions(self):
        action_hierarchy = {}
        flattened = {}

        for action_set in self.action_dict.keys():
            action_hierarchy[action_set] = [
                a for a in self.action_dict[action_set]["actions"].keys()
            ]
            for action in self.action_dict[action_set]["actions"].keys():
                flattened[action] = {"component": None, "actionSet": action_set}

        return action_hierarchy, flattened

    def get_action_resource(self):
        pass

    def get_action_config(self):
        pass

    def add_action_package(self):
        pass

    def is_loaded(self, action_set, action_name):
        pass

    def report_missing_actions(self):
        pass
