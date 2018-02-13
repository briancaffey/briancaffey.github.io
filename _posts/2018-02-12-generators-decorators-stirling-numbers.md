---

layout: post
title: Generators, decorators and Stirling Numbers of the Second Kind
date: 2018-02-12
comments: true
image: /static/stirlingii.png

---

Here is a problem set from a recent coding screen that I took. I want to go over the questions to try to get a better grasp on some of the concepts covered. 

*Please answer the following questions. Provide exemplary executable Python code to answer questions 1 through 4 (questions 0 and 5 do not require code). Partial progress towards a solution, either in prose or pseudocode, will be evaluated. Questions can be answered in any order.*


## Question 0: 

**What version of Python are you using?**

```shell
>>> import sys
>>> print(sys.version)
3.6.3 |Anaconda, Inc.| (default, Oct 13 2017, 12:02:49) 
[GCC 7.2.0]
```

## Question 1

**Implement a decorator called "timer" that outputs to standard error the run time (in seconds) of the decorated function. Applications of the decorator could look like this:**

```python
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
        start_time = time.time()
        func(*args)
        end_time = time.time()
        total_time = end_time - start_time
        sys.stderr.write(str(total_time))
        return

    return wrapper

@timer
def some_function(a, b):
    time.sleep(3)
    return a+b

some_function(3, 4)
```

This results in:

```
3.003056764602661
```

## Question 2

**Implement a decorator that composes the decorated function with an arbitrary number of additional functions passed as arguments to the decorator.**

All functions take a single argument and return a single value. The decorator should evaluate the decorated function first, and then evaluate the functions passed as arguments in the order they are given. For example:


```python
@compose(func1, func2, func3)
def func0(param):
    return val

func0(arg)  #=> func3(func2(func1(func0(arg))))
```

### Solution

To work out this problem I started with a simple, concrete example: a decorator that formats text. This decorator accepts functions that format text, such as adding punctuation and changing case. Here are the examples I used:

```python
def lc(s):
    s = s.lower()
    return s

def punc(s):
    if s[-1] != ".":
        s = s + "."
        return s
    else:
        return s

def cap(s):
    s = s[0].upper() + s[1:]
    return s
```

For the answer, I turned to Stack Overflow and got a [very helpful answer](https://stackoverflow.com/questions/48511794/python-decorator-that-takes-arbitrary-number-of-functions-as-arguments-and-retur).

Here's the approach that was suggested:

```python
def format(*fs):
    def deco(f):
        def wrapper(x):
            val = f(x)
            for func in fs:
                val = func(val)
            return val
        return wrapper
    return deco
```

Finally, we can test this decorator on a simple function that simply accepts a string and returns it: 

```python

@format(lc, punc, cap)
def example_func(param):
    return param

print(example_func("MY TEST STRING"))
```

We get:

```
My test string.
```

## Question 3

**Implement `words()` such that it accepts a path to a text file (of size up to 1TB) and returns an object iterable over the words (where words are defined as a contiguous sequence of letters from the English alphabet) contained within that file. Accessing each word will look like this:**

```
for word in words(file_path):
    pass
```

### Solution

We can use a generator to accomplish this:

```python
text = """This is a large file.
It contains many lines.
Each line contains many words."""

with open("sample_text.txt", 'w') as f:
    f.write(text)

def file_word_generator(path):
    with open(path) as f:
        for line in f:
            for word in line.split():
                yield word
                
for word in file_word_generator('sample_text.txt'):
    print(word)
```

```
This
is
a
large
file.
It
contains
many
lines.
Each
line
contains
many
words.
```

## Question 4

**Let `S` be the set of all integers `x` where `1 <= x <= n`. Implement a callable `f(n)` that accepts a positive integer `n`, returning the number of all sets of distinct subsets `S1` and `S2` that can be extracted from `S` such that `(S1 | S2 == S)` and `(S1 & S2 == set())` and `(sum(S1) == sum(S2))`. For example:**

```
INPUT: n=3
S: {1, 2, 3}
OUTPUT: 1
VALID SETS: [{ {1, 2}, {3} }]
```

### Solution

This problem presented an interesting problem that I haven't came across yet in Python: how do you handle a set of sets? Here's a simple description of python sets:

> A set contains an unordered collection of unique and immutable objects.

But sets are mutable, so we can't do anything like `set(set(), set())`. To get around this constraint, we can use [`frozenset`](https://docs.python.org/3/library/stdtypes.html#frozenset). 

Here is a bit on `frozenset` from the Python documentation:

> Return a new set or frozenset object whose elements are taken from iterable. The elements of a set must be hashable. To represent sets of sets, the inner sets must be frozenset objects. If iterable is not specified, a new empty set is returned.

Here's a brute force solution I came up with for this problem: 

```python
from itertools import combinations
def f(n):
    s = set([i+1 for i in range(n)])
    valid_partitions = []
    for i in range(1,n + 1):
        combos = combinations(s,i)
        for c in combos:
            p1 = frozenset(c)
            p2 = set(range(1,n+1)) - p1
            p2 = frozenset(p2)
            if sum(p1) == sum(p2):
                valid_partitions.append(frozenset((p1,p2)))

    return len(set(valid_partitions))
```

Here's a surprising result: 

```python
f(15)
```

```
361
```

This problem can be thought of as finding the [Stirling Number of the Second Kind](), but instead of finding all paritions, we only want to find partitions invovling two sets where the sums of the sets are equal. 

This seemed like a clunky solution at first, so I posted it on the [Code Reivew Stack Exhange](https://codereview.stackexchange.com/questions/187067/finding-the-number-of-ways-to-partition-1-2-n-into-p1-and-p2-such-that-s) and got some great pointers. 

First, compare my solution with this:

```python
def f(n):
    s = set([i+1 for i in range(n)])
    target_sum, rem = divmod(sum(s), 2)
    if rem:
        return 0
    return sum(sum(c) == target_sum for i in range(1, n) for c in combinations(s, i)) // 2
```

Much more elegant! 

## Question 4b

**What are the time and space efficiencies of your solution?**

Let's go over `f(n)` line by line. 

We start by forming `s` to be the set of integers 1 to \\( n \\). We then define an empty array `valid_partitions` to represent the number of partitions that will satisfy our equality condition. 

Next, we loop over integers \\(1,...,n\\) and for each integer in this loop we define `combos` to be `combinations(s,i)`. This is taking all \\(j\\)-sized subsets of s and storing them in `combos`. 

Next we iterate over each of these sets. 

We define `p1` to be the first partition by using `frozenset` (so it can be hashed), and then finding the complement of \\(s\\) and `p1` and saving it to `p2`. 

Finally, we check to see if the sum of the elements of `p1` and `p2` are equal, and if they are equal we append the set (a `frozenset`) of \{p1,p2\} to `valid_sets`. Finally, we take the length of the set of `valid_sets` to obtain our output value. 

Let's think about time efficiency.
This algorithm loops over \\( {1, ..., N} \\), and for each \\( i \\) in this loop it also loops over \\( \binom{N}{i} \\) combinations, checking to see if the sum of integer elements in the set formed by that combination and the sum of integer elements formed by that set's complement are equal. If I did this correctly, we could express the time efficiency with [Stirling's Number of the Second Kind]() where the number of partitions is 2, or \\(S(n,2)\\), also denoted \\(n\brace 2 \\).

Here is the full equation for Stirling Numbers of the Second Kind:

$$S(n,k) =
\begin{equation*}
\begin{Bmatrix}
n\\
k
\end{Bmatrix}
=\frac{1}{k!}\sum\limits_{j=0}^k(-1)^{k-j}\binom{k}{j}j^n
\end{equation*}
$$

I'm always surprised at how fast these numbers grow for any n and k. 

For more discussion, have a look at the thread for the same question that I posted in the Computer Science Stack Exchange [here](https://cs.stackexchange.com/questions/87840/finding-the-number-of-ways-to-partition-1-n-into-p-1-and-p-2-such).

## Question 5

**You are investigating the performance of arithmetic operations in Pandas and Numpy using the following function:**

```python
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

```python
In [11]: %timeit mult('a', 'b')
1 loop, best of 3: 1.58 s per loop

In [12]: %timeit mult('a', 'c')
1 loop, best of 3: 1.59 s per loop

In [13]: %timeit mult('b', 'c')
1 loop, best of 3: 437 ms per loop
```

I'm still not sure about this question, but I think the answer has to do with thte fact that `a` has `dtype` of `object`. My understanding is that the underlying Cython code in pandas helps gives major perfomance gains to numpy. This code may depend on declaring the type of variables in the numpy series defined in the function. Calculations involving `a` are slower than calculations not involving `a`. 