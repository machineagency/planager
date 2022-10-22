""""Closures for managing numerical variables in knitspeak"""

from typing import Union, List

from .symbol_table import Symbol_Table


class Num_Closure:
    """
    class for closures of numerical variables in knit speak
    """

    def __init__(self, symbol_table: Symbol_Table):
        self.symbol_table = symbol_table

    def to_int(self) -> int:
        """
        :return: the integer at the current knit speak context
        """
        raise NotImplementedError

    def __repr__(self):
        return str(self)


class Current_Row_Closure(Num_Closure):
    """A closure subtype for accessing the current row value"""
    def __init__(self, symbol_table: Symbol_Table):
        super().__init__(symbol_table)

    def to_int(self) -> int:
        """
        :return: the current row in the knitspeak context
        """
        return self.symbol_table["current_row"]

    def __str__(self):
        return "current_row"


class Num_Assignment_Closure(Num_Closure):
    """
    Closure sub type for numerical assignment
    """

    def __init__(self, symbol_table: Symbol_Table, var_name: str, assignment: Union[Num_Closure, int]):
        super().__init__(symbol_table)
        self.assignment = assignment
        self.var_name = var_name

    def to_int(self) -> int:
        """
        assigns the integer result of this assignment to the symbol table
        :return: the integer result of assignment
        """
        if isinstance(self.assignment, Num_Closure):
            val = self.assignment.to_int()
        else:
            val = self.assignment
        self.symbol_table[self.var_name] = val
        assert val >= 0, f"Non Negative Numbers:{val}"
        return val

    def __str__(self):
        return f"assign {self.var_name} to {self.assignment}"


class Num_Variable_Closure(Num_Closure):
    """
    A Closure sub-class to access symbol table for number variable in knit speak context
    """

    def __init__(self, symbol_table: Symbol_Table, var_name: str):
        super().__init__(symbol_table)
        self.var_name = var_name

    def to_int(self) -> int:
        """
        :return: the integer assigned to that var_name
        """
        assert self.var_name in self.symbol_table, f"KnitSpeak Error: No number assigned to \"{self.var_name}\""
        return self.symbol_table[self.var_name]

    def __str__(self):
        return f"var {self.var_name}"


class Operation_Closure(Num_Closure):
    """
    Closure sub type for numerical operations
    """

    def __init__(self, symbol_table: Symbol_Table, first_num: Union[Num_Closure, int], op: str, second_num: Union[Num_Closure, int]):
        super().__init__(symbol_table)
        self.first_num = first_num
        self.op = op
        self.second_num = second_num

    def to_int(self) -> int:
        """
        :return: the integer result at the current context of this operation
        """
        if isinstance(self.first_num, Num_Closure):
            first = self.first_num.to_int()
        else:
            first = self.first_num
        if isinstance(self.second_num, Num_Closure):
            second = self.second_num.to_int()
        else:
            second = self.second_num
        result = 0
        if self.op == "+":
            result = first + second
        elif self.op == "-":
            result = first - second
        elif self.op == "*":
            result = first * second
        elif self.op == "/":
            result = int(first / second)
        elif self.op == "^":
            result = first ** second
        assert result >= 0, f"Non Negative Numbers:{result}"
        return result

    def __str__(self):
        return f"{self.first_num} {self.op} {self.second_num}"


class Iterator_Closure:
    """
    A closure class to get iterator over set of course ids at given knit speak context
    """

    def __init__(self, symbol_table: Symbol_Table, include_rs: bool, include_ws: bool, start_num: Union[int, Num_Closure], end_num: Union[int, Num_Closure]):
        self.include_rs = include_rs
        self.include_ws = include_ws
        self.end_num = end_num
        self.start_num = start_num
        self.symbol_table = symbol_table

    def to_int_list(self) -> List[int]:
        """
        Start and End closures will be executed
        :return: the list of integers between start and end considering rs/ws restrictions
        """
        if isinstance(self.start_num, Num_Closure):
            first = self.start_num.to_int()
        else:
            first = self.start_num
        if isinstance(self.end_num, Num_Closure):
            second = self.end_num.to_int()
        else:
            second = self.end_num
        ints = []
        for i in range(first, second + 1):
            if i % 2 == 1 and self.include_rs:
                ints.append(i)
            elif i % 2 == 0 and self.include_ws:
                ints.append(i)
        return ints

    def __str__(self):
        return f"from {self.start_num} to {self.end_num}"

    def __repr__(self):
        return str(self)
