from planager.ToolLibrary import ToolLibrary
import importlib
import importlib.resources
from modulefinder import ModuleFinder
import pkgutil

# tl = ToolLibrary("tools")

# tl.find_tools()

pck = "tools.svg_tools.circle"
mod = "tools.svg_tools.circle.Circle"
tooll = "Circle.tool"

# print(importlib.resources.files("tools"))
# print(importlib.resources.contents(pck))
# print(importlib.resources.read_text(pck, tooll))


# spec = importlib.util.find_spec(mod)
# print(spec.origin)

print(pkgutil.walk_packages())
