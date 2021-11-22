"""Components of the parglare parser for knitspeak"""

import os
from typing import List, Dict, Union

from .symbol_table import Symbol_Table
from parglare import Grammar, Parser


class KnitSpeak_Interpreter:
    """
    A class to manage parsing a knit speak file with parglare
    ...

    Attributes
    ----------
    parser: the parglare Parser that we add a symbol table to
    """

    def __init__(self, debugGrammar: bool = False, debugParser: bool = False, debugParserLayout: bool = False):
        """
        Initializes a parser
        :param debugGrammar: If true, parglare is set to debug mode
        :param debugParser: if true, parglare parser is set to debug mod
        :param debugParserLayout: if true, parser layout is debuggable
        """
        directory = os.path.dirname(__file__)
        pg_loc = directory + f"{os.path.sep}knitspeak.pg"
        self._grammar = Grammar.from_file(pg_loc, debug=debugGrammar, ignore_case=True)
        self.parser = Parser(self._grammar, debug=debugParser, debug_layout=debugParserLayout)
        self.parser.symbolTable = Symbol_Table()

    def parse(self, pattern: str, pattern_is_file: bool = False) -> List[Dict[str, Union[List[int], List[tuple]]]]:
        """
        Executes the parsing code for the parglare parser
        :param pattern: either a file or the knitspeak string to be parsed
        :param pattern_is_file: if true, assumes that the pattern is parsed from a file
        :return:
        """
        if pattern_is_file:
            result = self.parser.parse_file(pattern)
        else:
            result = self.parser.parse(pattern)
        return result
