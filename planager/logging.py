from rich.console import Console
from rich.text import Text
from rich.traceback import install


install()

console = Console()

# TODO: Investigate ways to build a logger with rich


def message(prefix, message):
    m = Text()
    m.append(prefix, style="bold cyan")
    m.append(str(message))
    console.print(m)


def error(message):
    m = Text()
    m.append("ERROR: ", style="bold red")
    m.append(str(message))
    console.print(m)


def debug(message):
    m = Text(str(message), style="bold yellow")
    console.print(m)
