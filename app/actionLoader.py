import os
import fnmatch
import inspect
import platform

from importlib import import_module

from app.planager.workflow.Action import Action

from collections import defaultdict

# Create a list of planager packages and actions and import them
# Actions must inherit from the Action base class in order to be imported
action_Dict = defaultdict(dict)
actions = []
package_dir = "./app/planager/actionsets"
operating_system = platform.system()


def buildActionDict():
    for root, directories, files in os.walk(package_dir, topdown=True):
        print(root, directories, files)
        for file in files:
            # Look for all the python files
            if fnmatch.fnmatch(file, "*.py"):
                full_path = os.path.normpath(os.path.join(root, file))
                module_filename, _ = os.path.splitext(os.path.split(full_path)[1])
                # Ignore any __init__.py files
                if module_filename == "__init__":
                    continue

                # Create the module path by replacing slashes with periods
                module_path = os.path.splitext(full_path)[0].replace("\\", ".")
                # TODO: Don't actually import the module here, only import it if you need it. maybe use import_lib.find_loader later on.
                module = import_module(module_path)

                # Build the list of actions
                try:
                    # Get the members of the module
                    for name, obj in inspect.getmembers(module):
                        # Check if the member is a class
                        if inspect.isclass(obj):
                            # Check if it is a subclass of Action
                            if issubclass(obj, Action):
                                # Append to the actions list
                                dir_list = module_path.split(".")

                                if dir_list[-3] == "actionsets":
                                    action_set = dir_list[-2]
                                else:
                                    action_set = dir_list[-3]

                                if name != "Action":
                                    action_Dict[action_set][module_filename] = obj
                except BaseException:
                    continue
    return action_Dict


if __name__ == "__main__":
    import planager.actionsets.camera.PlanagerWebcam.PlanagerWebcam as web

    # asdf = web.PlanagerWebcam()
    print(dir(web))
