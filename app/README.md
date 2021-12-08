# Planager backend initialization and imports

## Using Objects from the Imported Module or Package

There are 4 different syntaxes for writing import statements.

    import <package>
    import <module>
    from <package> import <module or subpackage or object>
    from <module> import <object>

Let X be whatever name comes after import.

    If X is the name of a module or package, then to use objects defined in X, you have to write X.object.
    If X is a variable name, then it can be used directly.
    If X is a function name, then it can be invoked with X()

Optionally, as Y can be added after any import X statement: import X as Y. This
renames X to Y within the script. Note that the name X itself is no longer
valid. A common example is import numpy as np.

The argument to the import function can be a single name, or a list of multiple
names. Each of these names can be optionally renamed via as. For example, this
would be a valid import statement in `start.py`: import packA as pA, packA.a1,
packA.subA.sa1 as sa1

Example: `start.py` needs to import the `helloWorld()` function in `sa1.py`

Solution 1: `from packA.subA.sa1 import helloWorld`

- we can call the function directly by name: `x = helloWorld()`

Solution 2: `from packA.subA import sa1` or equivalently
`import packA.subA.sa1 as sa1`

- We have to prefix the function name with the name of the module:
  `x = sa1.helloWorld()`
- This is sometimes preferred over Solution 1 in order to make it explicit that
  we are calling the helloWorld function from the sa1 module.

Solution 3: `import packA.subA.sa1`

- we need to use the full path: `x = packA.subA.sa1.helloWorld()`

Note: The official syntax for import statements can be found in the
documentation (Python 2 and 3). I find it difficult to parse the context-free
grammar notation, and I have tried my best to summarize the key points here.
However, this post does not cover details such as importing multiple identifiers
from the same module.
