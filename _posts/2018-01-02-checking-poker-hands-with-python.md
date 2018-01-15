---

layout: post
title: Checking poker hands with Python
date: 2018-01-02
comments: true
image: /static/poker.jpg
---

![png](/static/poker.jpg)

I recently took a Hackerrank challenge for a job application that involved poker. I'm not a poker player, so I had a brief moment of panic as I read over the problem the description. In this article I want to do some reflection on how I approached the problem. I'll focus on the evaluation of poker hands. Cards are represented as follows:

Suit and value make up the value of playing cards. For example, you can have a 3 of clubs. 3 is the value, clubs is the suit. We can represent this as `3C`.

**Suits**

Clubs C
Spades S
Heart H
Diamonds D

**Value (Rank)**

2, 3, 4, 5, 6, 7, 8, 9, 10, Jack, Queen, King, Ace

```
values = {"2":2, "3":3, "4":4, "5":5, "6":6, "7":7, "8":8, "9":9, "10":10, "J":11, "Q":12, "K":13, "A":14}
```

## Hands

1. Royal flush
> A, K, Q, J, 10, all the same suit.

2. Straight flush
> Five cards in a sequence, all in the same suit.

3. Four of a kind
> All four cards of the same rank.

4. Full house
> Three of a kind with a pair.

5. Flush
> Any five cards of the same suit, but not in a sequence.

6. Straight
> Five cards in a sequence, but not of the same suit.

7. Three of a kind
> Three cards of the same rank.

8. Two pair
> Two different pairs.

9. Pair
> Two cards of the same rank.

10. High Card
> When you haven't made any of the hands above, the highest card plays.
In the example below, the jack plays as the highest card.

## Evaluating a hand of cards

A hand is five cards. The first thing I did was write out functions to evaluate if a group of 5 cards satisfies the conditions of one of the ten hands.

Hands are lists that look like this:

```python
hand = ["3S", "JC", "QD", "5D", "AH"]
```

To write functions, I reached for using 2 important python features: sets and defaultdicts.

Here's an example of a simple function to detect a flush, a hand with cards of all the same suit:

## Checking a flush

```python
def check_flush(hand):
    suits = [h[1] for h in hand]
    if len(set(suits)) == 1:
      return True
    else:
      return False
```

This function creates a list of the suits in our hand, and then counts the unique elements in that list by making it a set. If the length of the set is 1, then all the cards in the hand must be of the same suit.

But wait, what if we have a straight flush? Also, a hand that satisfies a flush could also be described as a two pair hand. The problem asked me to find the highest possible hand for a given set of cards, so I tried to keep things simple by writing a `check_hand()` function that checks each hand starting from straight flush down to high card. As soon as a condition for a hand was satisfied, I returned a number that corresponded to the strength of the hand (1 for high card up to 10 for straight flush). The problem didn't include Royal flush, so I will not include that here.

Here's the `check_hand` function:

```python
def check_hand(hand):
    if check_straight_flush(hand):
        return 9
    if check_four_of_a_kind(hand):
        return 8

    [...]
    if check_two_pair(hand):
        return 3
    if check_pair(hand):
        return 2
    return 1
```

This function starts checking the most valuable hands. After it checks the second to lowest hand (pair), it returns a value of 1. This value of 1 corresponds to the "highest card" hand. Since I'm not comparing the relative value of hands, it doesn't matter what the highest card is, so the number just represents the *type* of hand that is the strongest.

## Other hands

Here are some of the other functions for checking hands. For "Full house", three of a kind with one pair, I couldn't simply use the previous trick of checking the lengths of the sets of the values.

```python
from collections import defaultdict
def check_full_house(hand):
    value_counts = defaultdict(lambda:0)
    values = [h[0] for h in hand]
    for v in values:
        value_counts[v] += 1
    if (2 in value_counts.values()) and (3 in value_counts.values()):
        return True
    else:
        return False
```

`defaultdict` is a great built-in that is good to use when you don't know what elements will be in your dictionary, but you know what the initial values of any key that could be added should be. We don't need it here, but the alternative would be to write a very long dictionary where keys are the possible card values and the values of each key is 0.

We then check if there is a 2 and a 3 in the values of the `value_counts` dictionary.
