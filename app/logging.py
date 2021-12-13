from rich.console import Console
from rich.text import Text
from rich.traceback import install


install()

console = Console()


def info(prefix, message):
    m = Text()
    m.append(prefix, style="bold yellow")
    m.append(str(message))
    console.print(m)


def error(message):
    m = Text()
    m.append("ERROR: ", style="bold red")
    m.append(str(message))
    console.print(m)


def debug(message):
    m = Text(str(message), style="bold cyan")
    console.print(m)
