"""
Methods and support for writing knitout commands and updating a machine state
"""
from typing import List, Tuple, Optional

from .Machine_State import Machine_State, Yarn_Carrier, Pass_Direction, Needle


def rack(machine_state: Machine_State, racking: int, comment: str = "") -> str:
    """
    :param machine_state: the current machine model to update
    :param racking: the new racking to set the machine to
    :param comment: additional details to document in the knitout
    :return: the racking instruction
    """
    machine_state.racking = racking
    return f"rack {racking} ;{comment}\n"


def make_carrier_set(carrier_set: List[Yarn_Carrier], needle: Optional[Needle] = None) -> str:
    """
    :param carrier_set: the set of carriers to be converted to a carrier set command parameter
    :param needle: the needle to move the carriers to
    :return: the spaced carrier set parameter to be used in instructions
    """
    carriers = ""
    for carrier in carrier_set:
        carriers += f" {carrier}"
        if needle is not None:
            carrier.move_to_position(needle.position)
    return carriers


def miss(direction: Pass_Direction, needle: Needle, carrier_set: List[Yarn_Carrier], comment: str = "") -> str:
    """
    Move the specified carriers as if they had just formed a loop in direction D at location N.
    (Not generally needed, used when performing explicit kickbacks or purposeful yarn capture.)
    :param direction: the direction to pull the yarn across the needle from
    :param needle: the needle to pull the carrier set to
    :param carrier_set: the set of carriers being used
    :param comment: additional details to document in the knitout
    :return: the mis instruction
    """
    carriers = make_carrier_set(carrier_set, needle)
    return f"miss {direction} {needle}{carriers} ;{comment}\n"


def knit(machine_state: Machine_State, direction: Pass_Direction, needle: Needle, carrier_set: List[Yarn_Carrier],
         loop_id: int, comment: str = ""):
    """
    Pull a loop formed in direction D by the yarns in carriers CS through the loops on needle N,
    dropping them in the process.
    Knitting with an empty carrier set will drop.
    :param machine_state: the current machine model to update
    :param direction: the direction to pull the yarn across the needle from
    :param needle: the needle to make the loop on
    :param carrier_set: the set of carriers being used
    :param loop_id: the new loop being created and put on the needle
    :param comment: additional details to document in the knitout
    :return: the knit instruction
    """
    machine_state.add_loop(loop_id, needle.position, needle.is_front, carrier_set)
    carriers = make_carrier_set(carrier_set, needle)
    return f"knit {direction} {needle}{carriers} ; knit loop {loop_id}, {comment}\n"


def tuck(machine_state: Machine_State, direction: Pass_Direction, needle: Needle, carrier_set: List[Yarn_Carrier],
         loop_id: int, comment: str = "") -> str:
    """
    Add a loop formed in direction D by the yarns held by carriers in CS to those already on needle N.
    Tucking with an empty carrier set will pull on the stitches without doing anything else (an "a-miss").
    :param machine_state: the current machine model to update
    :param direction: the direction to pull the yarn across the needle from
    :param needle: the needle to make the loop on
    :param carrier_set: the set of carriers being used
    :param loop_id: the id of the new loop created
    :param comment: additional details to document in the knitout
    :return: the tuck instruction
    """
    machine_state.add_loop(loop_id, needle.position, needle.is_front, carrier_set, drop_prior_loops=False)
    carriers = make_carrier_set(carrier_set, needle)
    return f"tuck {direction} {needle}{carriers} ; tuck loop {loop_id}, {comment}\n"


def split(machine_state: Machine_State, direction: Pass_Direction, needle_1: Needle, needle_2,
          carrier_set: List[Yarn_Carrier], loop_id: int, comment: str = "") -> str:
    """
    Pull a loop formed in direction D by the yarns in carriers CS through the loops on needle N,
    transferring the old loops to opposite-bed needle N2 in the process.
    Splitting with an empty carrier set will transfer.
    :param machine_state: the current machine model to update
    :param direction: the direction to pull the yarn across the needle from
    :param needle_1: the first needle to make the loop on and transfer from
    :param needle_2: the second needle to transfer the original loops from
    :param carrier_set: the set of carriers being used
    :param loop_id: the new loop being created
    :param comment: additional details to document in the knitout
    :return: the split instruction
    """
    front_to_back, racking = _prepare_xfer(machine_state, needle_1, needle_2)
    machine_state.add_loop(loop_id, needle_1.position, on_front=front_to_back, carrier_set=carrier_set)
    carriers = make_carrier_set(carrier_set, needle_1)
    return f"{racking}split {direction} {needle_1} {needle_2}{carriers} ; split loop {loop_id}, {comment}\n"


def _prepare_xfer(machine_state, needle_1, needle_2) -> Tuple[bool, str]:
    """
    :param machine_state: the current machine model to update
    :param needle_1: the first needle to xfer from
    :param needle_2: the second needle to xfer to
    :return: True if the transfer is from front to back, the racking instruction needed to make the xfer
    """
    assert needle_1.is_front != needle_2.is_front, f"Cannot split to needles on same bed, {needle_1} to {needle_2}"
    if needle_1.is_front:
        front_needle = needle_1
        back_needle = needle_2
        front_to_back = True
    else:
        front_needle = needle_2
        back_needle = needle_1
        front_to_back = False
    updated_racking, original_racking = machine_state.update_rack(front_needle.position, back_needle.position)
    if original_racking:
        racking = ""
    else:
        racking = rack(machine_state, updated_racking, comment=f"rack to xfer {needle_1} to {needle_2}")
    machine_state.xfer_loops(needle_1.position, needle_2.position, front_to_back)
    return front_to_back, racking


def drop(machine_state: Machine_State, needle: Needle, comment: str = "") -> str:
    """
    Synonym for "knit + N".
    Drops the loops on the needle
    :param machine_state: the current machine model to update
    :param needle: the needle to drop loops from
    :param comment: additional details to document in the knitout
    :return: the drop instruction
    """
    machine_state.drop_loop(needle.position, needle.is_front)
    return f"drop {needle} ;{comment}\n"


def xfer(machine_state: Machine_State, needle_1: Needle, needle_2: Needle, comment: str = "") -> str:
    """
    Synonym for "split + N N2".
    transfers loops from needle 1 to needle 2, leaving needle 1 empty
    :param machine_state: the current machine model to update
    :param needle_1: the first needle to xfer from
    :param needle_2: the second needle to xfer to
    :param comment: additional details to document in the knitout
    :return: the xfer instruction
    """
    _, racking = _prepare_xfer(machine_state, needle_1, needle_2)
    return f"{racking}xfer {needle_1} {needle_2} ;{comment}\n"


def inhook(machine_state: Machine_State, carrier_set: List[Yarn_Carrier], comment: str = "") -> str:
    """
    Indicate that the given carrier set should be brought into action using the yarn inserting hook when next used.
    The inserting hook will be parked just before the first stitch made with the carriers.
    :param machine_state: the current machine model to update
    :param carrier_set: the set of carriers to bring in
    :param comment: additional details to document in the knitout
    :return: the inhook instruction
    """
    for carrier in carrier_set:
        machine_state.in_hook(carrier)
    return f"inhook {make_carrier_set(carrier_set)} ;{comment}\n"


def releasehook(machine_state: Machine_State, carrier_set: List[Yarn_Carrier], comment: str = "") -> str:
    """
    Release the yarns currently held in the yarn inserting hook.
    Must be proceeded by a call to inhook with the same carrier set and at least one knitting operation.
    :param machine_state: the current machine model to update
    :param carrier_set: the set of carriers to release
    :param comment: additional details to document in the knitout
    :return: the releasehook instruction
    """
    for carrier in carrier_set:
        machine_state.release_hook(carrier)
    return f"releasehook {make_carrier_set(carrier_set)} ;{comment}\n"


def outhook(machine_state: Machine_State, carrier_set: List[Yarn_Carrier], comment: str = "") -> str:
    """
    Release the yarns currently held in the yarn inserting hook.
    Must be proceeded by a call to inhook with the same carrier set and at least one knitting operation.
    :param machine_state: the current machine model to update
    :param carrier_set: the set of carriers to bring out
    :param comment: additional details to document in the knitout
    :return: the outhook instruction
    """
    for carrier in carrier_set:
        machine_state.out_hook(carrier)
    return f"outhook {make_carrier_set(carrier_set)} ;{comment}\n"
