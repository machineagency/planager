"""actions are called by parglare while parsing a file to reduce the abstract syntax tree as it is processed"""
from typing import Dict, List, Tuple, Union

from app.planager.actionsets.knitting.utils.knitspeak_compiler.knitspeak_interpreter.closures import Operation_Closure, Num_Closure, Num_Variable_Closure, Num_Assignment_Closure, Iterator_Closure, Current_Row_Closure
from parglare import get_collector
from parglare.parser import Context


from app.planager.actionsets.knitting.utils.knitspeak_compiler.knitspeak_interpreter.cable_definitions import Cable_Definition
from app.planager.actionsets.knitting.utils.knitspeak_compiler.knitspeak_interpreter.stitch_definitions import Stitch_Definition


# some boiler plate parglare code
action = get_collector()


@action
def course_ids(context, nodes) -> List[Union[int, Num_Closure, Iterator_Closure]]:
    """
    The action to simplify data in a courseIdDefinition
    :param context: the context to gather symbol table data
    :param nodes: the nodes of the parsed content should be of length 2
    :return: a list of course_id integers
    """
    row_node = 1
    course_range = nodes[0]
    if len(nodes) == 3:
        row_node = 2
        if "rs" == nodes[1]:
            course_range = [1]
        else:
            course_range = [2]
        context.parser.symbolTable[f"all_{nodes[1]}"] = course_range
    assert "ow" in nodes[row_node], "Currently this parser only accepts rows (not rounds)"
    return course_range


@action
def course_statement(_, nodes) -> Dict[str, list]:
    """
    The action that simplifies courseStatements
    :param _: unused context provided by parglare
    :param nodes: the nodes of the parsed content
    expected nodes:
    node[0] is boolean to determine if the row should be reversed operations
    node[1] the course ids
    node[2] the stitch operations
    :return: A dictionary with two keys: "courseIds" to the list of course_ids (ints)
        and "stitch-operations" keyed to the list of stitch operation tuples with repeat data
    """
    if nodes[0] is not None:
        newStitchDefs = _flipStitchList(nodes[2])
        return {"courseIds": nodes[1], "stitch-operations": newStitchDefs}
    return {"courseIds": nodes[1], "stitch-operations": nodes[2]}


def _flipStitchList(operation_tuple_list: List[tuple]) -> list:
    """
    flips the operations in the list as if they were worked from the opposite side (knits vs purls)
    :param operation_tuple_list: the list of operations that need to be flipped
    :return: the flipped operation in the original order
    """
    newStitchDefs = []
    for operation in operation_tuple_list:
        stDef = operation[0]
        if type(stDef) is list:
            newStitchDefs.append((_flipStitchList(stDef), operation[1]))
        else:
            stDef = stDef.copy_and_flip()
            newStitchDefs.append((stDef, operation[1]))
    return newStitchDefs


@action
def side(_, nodes: str) -> str:
    """
    :param _: the unused context provided by action
    :param nodes: should be one node with the side information
    :return: will return "rs" or "ws"
    """
    sideToLower = nodes
    if sideToLower[0:1] == "(":
        sideToLower = sideToLower[1:]
    if sideToLower[-1:] == ")":
        sideToLower = sideToLower[:-1]
    return sideToLower.lower()


@action
def course_id_list(_, nodes: list) -> List[Union[int, Num_Closure, Iterator_Closure]]:
    """
    course_id_list: course_id_list commaAnd course_id | course_id;
    :param _: context data ignored but passed by parglare
    :param nodes: the node data passed by the parser
    :return: a list of course_identifiers processed from the course_id_list
    """
    if len(nodes) == 1:
        if type(nodes[0]) is int or isinstance(nodes[0], Num_Closure) or isinstance(nodes[0], Iterator_Closure):
            course_identifiers = [nodes[0]]
        else:  # nodes is a course_identifiers list already
            course_identifiers = nodes[0]
    else:
        course_identifiers = nodes[0]
        course_identifiers.append(nodes[2])
        topList = []
        for cId in course_identifiers:
            if type(cId) is int or isinstance(cId, Num_Closure) or isinstance(cId, Iterator_Closure):
                topList.append(cId)
            else:  # cID is course_identifiers list
                for subId in cId:
                    topList.append(subId)
        course_identifiers = topList
    courseSet = set()
    unique_c_ids = []
    for cId in course_identifiers:
        if isinstance(nodes[0], Num_Closure) or isinstance(nodes[0], Iterator_Closure):
            unique_c_ids.append(cId)
        elif cId not in courseSet:
            unique_c_ids.append(cId)
            courseSet.add(cId)
    return unique_c_ids


@action
def stitch_statement_List(_, nodes) -> List[tuple]:
    """
    :param _: parglare context provided but not needed
    :param nodes: the nodes passed by parglare
    :return: processes a list of stitch statements into the needed tuples
    """
    if len(nodes) == 1:
        if type(nodes[0]) is list:
            return nodes[0]
        else:
            return [nodes[0]]
    else:
        stitchList = nodes[0]
        if type(nodes[2]) is list:
            stitchList.extend(nodes[2])
        else:
            stitchList.append(nodes[2])
        topList = []
        for stitch in stitchList:
            if type(stitch) is list:
                for subStitch in stitch:
                    topList.append(subStitch)
            else:
                topList.append(stitch)
        return stitchList


@action
def repeated_Stitch(_, nodes: list) -> Tuple[Union[Stitch_Definition, Cable_Definition], Tuple[bool, int]]:
    """
    :param _: context provided by parglare but not used
    :param nodes:
    node[0] the stitch operation to be repeated
    node[1], if exists, the number of repeats. Defaults to 1
    :return: returns the repeated stitch tuple. the operation followed by a tuple declaring the repeat structure
    """
    if nodes[1] is None:
        nodes[1] = 1
    return nodes[0], (True, nodes[1])


@action
def repeated_stitch_group(_, nodes):
    """
    :param _:
    :param nodes:
    :return:
    """
    if nodes[1] is None:
        nodes[1] = 1
    return nodes[0], nodes[1]
    # todo may be deprecated?


@action
def static_stitch_group(_, nodes) -> Tuple[List[tuple], Tuple[bool, int]]:
    """
    :param _: the context passed by parglare but not used
    :param nodes:nodes[1] the stitch statement list to be repeated, nodes[3] the repetition count
    :return: a tuple of the list of stitch operations to be repeated
    """
    if nodes[3] is None:
        nodes[3] = 1
    return nodes[1], (True, nodes[3])


@action
def conditional_stitch_group(_, nodes: list) -> Tuple[List[Tuple], Tuple[bool, int]]:
    """
    :param _: the context passed by parglare but not used
    :param nodes: nodes[1] the stitch statement list to be repeated, nodes[3] the repetition instructions
    :return: the stitch statement list to be repeated and the repeat instruction in a tuple
    """
    return nodes[1], nodes[3]


@action
def between_courses(context, nodes) -> Union[Iterator_Closure, List[int]]:
    """
    process statement iterated courses to a list of course_ids
    :param context: context passed by parglare, but not used
    :param nodes: the nodes from the statement to process
    :return: list of course ids
    """
    start_num = nodes[2]
    end_num = nodes[4]
    include_ws = True
    include_rs = True
    side_exclusion = nodes[1]
    if side_exclusion is not None:
        if side_exclusion == "ws":
            include_rs = False
        elif side_exclusion == "rs":
            include_ws = False
    if isinstance(start_num, Num_Closure) or isinstance(end_num, Num_Closure):
        return Iterator_Closure(context.parser.symbolTable, include_rs, include_ws, start_num, end_num)
    else:
        ints = []
        for i in range(start_num, end_num + 1):
            if i % 2 == 1 and include_rs:
                ints.append(i)
            elif i % 2 == 0 and include_ws:
                ints.append(i)
        return ints


@action
def rep_condition(_, nodes: list) -> Tuple[bool, Union[int, Num_Closure]]:
    """
    :param _: the context passed by parglare but not used
    :param nodes: the nodes needed to parse the rep_condition and repeat information
    :return: the type of repetition policy "stitches", the number of loops that must remain to follow this replications
    """
    if len(nodes) == 2:
        assert nodes[1] == "end"
        remaining_sts = 0
    elif len(nodes) == 3:
        assert nodes[2] == "st"
        remaining_sts = 1
    else:
        assert len(nodes) == 4 and nodes[3] == "sts"
        remaining_sts = nodes[2]
    return False, remaining_sts


@action
def rowOrRound(_, nodes: str) -> str:
    """
    :param _: context passed by parglare but not used
    :param nodes: the string marking the type of construction
    :return: will return "row" or "rows" and error otherwise
    """
    if "round" in nodes:
        assert False, "Rounds not yet supported in KS2.0"
    return nodes


@action
def num_assign(context: Context, nodes: list) -> Num_Assignment_Closure:
    """
    parses a definition of a variable number and adds it to the symbol table
    :param context: context used to access symbol table for storing the definition
    :param nodes: nodes used to parse numerical definition
    :return: the string keyed to the numerical expression
    """
    symbol = nodes[0]
    data = nodes[2]
    return Num_Assignment_Closure(context.parser.symbolTable, symbol, data)


@action
def num_id(context: Context, nodes: list) -> Num_Variable_Closure:
    """
    gathers number by keyword from symbol table
    :param context: used to access symbol table
    :param nodes: the keyword to access the numerical value
    :return: the numerical value that that keyword processes to
    """
    symbol = nodes[0]
    symbol_table = context.parser.symbolTable
    return Num_Variable_Closure(symbol_table, symbol)


@action
def num_exp(context, nodes: list) -> Union[int, Num_Closure]:
    """
    :param context: used to get current row state
    :param nodes: the nodes used to create an integer
    :return: the integer processed from the nodes
    """
    if type(nodes[0]) is int:
        assert nodes[0] >= 0, f"Non Negative Numbers:{nodes[0]}"
    elif type(nodes[0]) is str and nodes[0] == "currow":
        return Current_Row_Closure(context.parser.symbolTable)
    return nodes[0]


@action
def num_op(context, nodes: list) -> Union[int, Operation_Closure]:
    """
    :param context: context not used
    :param nodes: the nodes involved in teh operation
    :return: the integer resulting from the operation
    """
    firstIndex = 0
    secondIndex = 2
    opIndex = 1
    if nodes[0] == "(":
        firstIndex += 1
        secondIndex += 1
        opIndex += 1
    first_num = nodes[firstIndex]
    second_num = nodes[secondIndex]
    op = nodes[opIndex]
    if type(first_num) is int and type(second_num) is int:  # no closure needed
        if op == "+":
            return first_num + second_num
        elif op == "-":
            return first_num - second_num
        elif op == "*":
            return first_num * second_num
        elif op == "/":
            return first_num / second_num
    else:
        symbol_table = context.parser.symbolTable
        return Operation_Closure(symbol_table, first_num, op, second_num)


def _stripToDigits(text: str) -> str:
    digits = ""
    for c in text:
        if c.isdigit():
            digits += c
    return digits


@action
def integer(_, node: str) -> int:
    """
    :param _: context not used
    :param node: the number string
    :return: the integer specified
    """
    string = _stripToDigits(node)
    i = int(string)
    return i


@action
def opId(context: Context, nodes: List[str]) -> Union[Stitch_Definition, Cable_Definition]:
    """
    :param context: context used to access symbol table
    :param nodes: node used to identify stitch type
    :return: the stitch definition or cable definition keyed to this term
    """
    currentSymbolTable = context.parser.symbolTable
    assert nodes[0] in currentSymbolTable, "No stitch defined ID={}".format(nodes[0])
    return currentSymbolTable[nodes[0]]
