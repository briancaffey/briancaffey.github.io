---
layout: post
title: A binary clock written in bash
date: 2017-10-31
comments: true
image: /static/binaryclock.png
tags:
  - bash
---

![png](/static/binaryclock.png)

Configuring the i3 window manager on my laptop has got me interested in learning more about bash scripting. As an exercise for getting more familiar with bash, I set out to write a simple [binary clock](https://en.wikipedia.org/wiki/Binary_clock) application that runs in the terminal.

To simplifiy my clock, I decided to display Unix time as a binary number with ones and zeros represented as the unicode symbols ● and ○, respectively. [Unix time](https://en.wikipedia.org/wiki/Unix_time) is the number of second that have passed since January 1, 1970. Here's what I had in mind when I started out:

```
 ○ ○ ● ● ○
 ○ ● ● ● ●
 ○ ● ● ○ ●
 ● ● ○ ● ○
 ● ○ ○ ● ●
 ● ● ○ ● ○
```

In this representation, the lower right cell represents the one's place, the next cell to the left represents the two's place, the next over the four's place, the next the eight's, and so on.

Here's the code that I ended up using for my clock program:

```bash
#!/bin/bash
resize -s 8 19

function decToBin { echo "ibase=10; obase=2; $1" | bc; };

draw() {
  binstring=$(decToBin {$(date '+%s')})

  for i in {31..6..-5}
    do
      echo $binstring | tail -c $i | head -c 5
      printf "\n"
    done
}

printf '\e[?25l'
clear

while true ; do
  printf '\033[;H'
  offset_v=$(( $(( $(tput lines)  / 2  ))  - 3  ))
  v=$(( $offset_v > 0 ? $offset_v : 0 ));
  for i in `seq 1 $v`;
    do
        printf "\n"
    done
  offset_h=$(( $(( $(tput cols)  / 2  ))  - 7  ))
  h=$(( $offset_h > 0 ? $offset_h : 0 ));
  $(echo draw) | sed "s/1/ $(tput setaf 6)● /g" |
                 sed "s/0/ $(tput setaf 6)○ /g" |
                 sed "s/^/$(head -c $h < /dev/zero | tr '\0' '\ ';)/"
  sleep 1
done
```

The program uses two function and one while loop to display the time.

`decToBin` is a simple helper function to convert decimal numbers to binary representations.

`draw` structures the the string of ones and zeros into 6 rows and five columns of ones and zeros. This function uses `head` and `tail` in combination with a `for` loop to iterate over a string. Notice the `-c` flag on `tail` and `head`. The following is from the `man head`:

```bash
       -c, --bytes=[-]NUM
              print the first NUM bytes of each file;
```

This gets `NUM` number of ones and zeros (each being one byte) from the string of ones and zeros that results from `decToBin`.

In the `while` loop, I measure the length and width of the terminal window to center the position of the clock in case it has been changed with the following lines of code:

```bash
[...]
  offset_v=$(( $(( $(tput lines)  / 2  ))  - 3  ))
  v=$(( $offset_v > 0 ? $offset_v : 0 ));
  for i in `seq 1 $v`;
    do
        printf "\n"
    done
  offset_h=$(( $(( $(tput cols)  / 2  ))  - 7  ))
  h=$(( $offset_h > 0 ? $offset_h : 0 ));
[...]
```

Finally, I convert the ones and zeros to the colored unicode circles with the following lines of code:

```bash
  $(echo draw) | sed "s/1/ $(tput setaf 6)● /g" |
                 sed "s/0/ $(tput setaf 6)○ /g" |
                 sed "s/^/$(head -c $h < /dev/zero | tr '\0' '\ ';)/"
```

Piping the output of `draw` to `sed` lets us do some simple substition using the pattern:

```bash
sed "s/<what you want to swap out>/<what you want to swap in>/g"
```

The `"../g"` at the end of the `sed` argument specifies that we want to make the substition globally.

The last `sed` command inserts spaces to the right of each row for the horizontal offset (in order to center the clock on our terminal window). This uses another interesting pattern that I came across on StackOverflow:

```bash
sed "s/^/$(head -c $h < /dev/zero | tr '\0' '\ ';)/"
```

The `^` is a regular expression that represents the beginning of a line. So with this `sed` substitution we will be adding to the beginning of each line. What we are adding is the following:

```bash
$(head -c $h < /dev/zero | tr '\0' '\ ';)/
```

This takes the number of columns that we want to shift our clock as `$h` and reads the first `$h` bytes from `/dev/zero`. `/dev/zero` produces a continuous stream of NULL (zero value) bytes, so the first `$h` bytes will be something like `\0, \0, \0, \0, \0`. We then pipe this output to `tr` which translates the null bytes into spaces (`'\ '`) which help us pad our clock.

Here's a screenshot of the clock in action:

![png](/static/binaryclock.png)

Here's the script on my github account:

[https://github.com/briancaffey/binaryclock/blob/master/binaryclock](https://github.com/briancaffey/binaryclock/blob/master/binaryclock)

The clock works well on `rxvt-unicode`, but I need to make some small changes to make it work on other terminal emulators.
