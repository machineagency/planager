import os
import fnmatch
import inspect
from pathlib import Path

from importlib import import_module

from app.planager.workflow.Action import Action

from rich import print

# Create a list of planager packages and actions and import them
# Actions must inherit from the Action base class in order to be imported

ignore = ["__pycache__"]


def buildActionDict(package_dir):
    p = Path(package_dir)

    action_sets = {}
    # Iterate through the contents of the action set directory
    for action_set in p.iterdir():
        action_set_name = action_set.stem
        # Ignore things that aren't directories or that are in the ignore array
        if not action_set.is_dir() or action_set.stem in ignore:
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
            if not action_dir.is_dir() or action_name in ignore:
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
                    print("Path {} not found".format(action_path))
                    continue

                action_sets[action_set_name]["actions"][action_name] = {
                    "action_path": action,
                    "module": module,
                }

    print(action_sets)

    # for action_set in action_Dict.keys():
    # print(action_set)

    # for root, directories, files in os.walk(package_dir, topdown=True):
    #     # print(directories)
    #     for file in files:
    #         # Look for all the python files
    #         if fnmatch.fnmatch(file, "*.py"):
    #             full_path = os.path.normpath(os.path.join(root, file))
    #             module_filename, _ = os.path.splitext(os.path.split(full_path)[1])
    #             # Ignore any __init__.py files
    #             if module_filename == "__init__":
    #                 continue

    #             # Create the module path by replacing slashes with periods
    #             module_path = os.path.splitext(full_path)[0].replace("\\", ".")
    #             # TODO: Don't actually import the module here, only import it if you need it. maybe use import_lib.find_loader later on.
    #             module = import_module(module_path)

    #             # Build the list of actions
    #             try:
    #                 # Get the members of the module
    #                 for name, obj in inspect.getmembers(module):
    #                     # Check if the member is a class
    #                     if inspect.isclass(obj):
    #                         # Check if it is a subclass of Action
    #                         if issubclass(obj, Action):
    #                             # Append to the actions list
    #                             dir_list = module_path.split(".")

    #                             if dir_list[-3] == "actionsets":
    #                                 action_set = dir_list[-2]
    #                             else:
    #                                 action_set = dir_list[-3]

    #                             if name != "Action":
    #                                 action_Dict[action_set][module_filename] = obj
    #             except BaseException:
    #                 continue
    return action_sets
