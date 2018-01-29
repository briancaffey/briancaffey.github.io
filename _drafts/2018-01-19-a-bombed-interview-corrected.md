---

layout: post
title: Corrections to a coding screen challenge that I recently bombed
date: 2018-01-19
comments: true

---

Here is a problem set from a recent coding screen that I took. This is one of the harder test I have completed, so I want to go over the question to try to get a better grasp on some of the concepts covered. First, here are the instructions and questions:

*Please answer the following questions. Provide exemplary executable Python code to answer questions 1 through 4 (questions 0 and 5 do not require code). Partial progress towards a solution, either in prose or pseudocode, will be evaluated. Questions can be answered in any order.*


0. What version of Python are you using?


1. Implement a decorator called "timer" that outputs to standard error the run time (in seconds) of the decorated function. Applications of the decorator could look like this:

    ```
    @timer
    def long_running_function():
        pass

    timed_sort = timer(sorted)
    ```

### Solution

Here's a simple way to time each function: 

```python
import sys
import time

def timer(func):

    def wrapper(*args):
        print(args)
        start_time = time.time()
        func(*args)
        end_time = time.time()
        total_time = end_time - start_time
        sys.stderr.write(str(total_time))
        return

    return wrapper

@timer
def some_function(a, b):
    print(a+b)
    time.sleep(3)

some_function(3, 4)
```

2. Implement a decorator that composes the decorated function with an arbitrary number of additional functions passed as arguments to the decorator. All functions take a single argument and return a single value. The decorator should evaluate the decorated function first, and then evaluate the functions passed as arguments in the order they are given. For example:

    ```
    @compose(func1, func2, func3)
    def func0(param):
        return val

    func0(arg)  #=> func3(func2(func1(func0(arg))))
    ```

### Solution

```python
def func():
    pass
```


3. Implement `words()` such that it accepts a path to a text file (of size up to 1TB) and returns an object iterable over the words (where words are defined as a contiguous sequence of letters from the English alphabet) contained within that file. Accessing each word will look like this:

    ```
    for word in words(file_path):
        pass
    ```


4. Let `S` be the set of all integers `x` where `1 <= x <= n`. Implement a callable `f(n)` that accepts a positive integer `n`, returning the number of all sets of distinct subsets `S1` and `S2` that can be extracted from `S` such that `(S1 | S2 == S)` and `(S1 & S2 == set())` and `(sum(S1) == sum(S2))`. For example:

    ```
    INPUT: n=3
    S: {1, 2, 3}
    OUTPUT: 1
    VALID SETS: [{ {1, 2}, {3} }]
    ```

5. What are the time and space efficiencies of your solution?


6. You are investigating the performance of arithmetic operations in Pandas and Numpy using the following function:

    ```
    import time
    import pandas as pd

    def mult(*cols):
        a = pd.Series((100, 1, None, 65), dtype=object)
        b = pd.Series((-85, -234, 32, 104), dtype=int)
        c = pd.Series((205.3, 3.5, 234.3, 8403.32), dtype=float)
        df = pd.DataFrame(dict(a=a, b=b, c=c))
        for _ in range(int(1e4)):
            df[cols[0]] * df[cols[1]]
    ```

    Running the %timeit magic command in IPython, you observe the following. Suggest explanations for these performance differences. Describe how you might investigate further.

    ```
    In [11]: %timeit mult('a', 'b')
    1 loop, best of 3: 1.58 s per loop

    In [12]: %timeit mult('a', 'c')
    1 loop, best of 3: 1.59 s per loop

    In [13]: %timeit mult('b', 'c')
    1 loop, best of 3: 437 ms per loop
    ```
    

# 0

To get the current version of Python we can run the following command: 

```shell 
 $ python -V
Python 3.6.3 :: Anaconda, Inc.
```

Or, from a Python shell we can do: 

```shell
>>> import sys
>>> print(sys.version)
3.6.3 |Anaconda, Inc.| (default, Oct 13 2017, 12:02:49) 
[GCC 7.2.0]
```

# 1

To implement this timer we can write a function that takes in a function, starts a timer, evaluates and saves the result of the decorated function, ends the timer, prints to `std.err` and then returns the saved result of the decorated function: 



# 2

# 3

# 4

# 5

# 6

# 7 