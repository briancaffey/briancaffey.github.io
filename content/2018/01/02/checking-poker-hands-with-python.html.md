---
layout: post
title: Finding the best poker hand in five-card draw with python
date: 2018-01-02
comments: true
image: /static/poker.jpg
tags:
  - python
  - poker
---

![png](/static/poker.jpg)

I recently took a Hackerrank challenge for a job application that involved poker. I'm not a poker player, so I had a brief moment of panic as I read over the problem the description. In this article I want to do some reflection on how I approached the problem.

# The Problem

The hackerrank question asked me to write a program that would determine the best poker hand possible in [five-card draw](https://en.wikipedia.org/wiki/Five-card_draw) poker. We are given 10 cards, the first 5 are the current hand, and the second 5 are the next five cards in the deck. We assume that we can see the next five cards (they are not hidden). We want to exchange any `n` number of cards (where `n <= 5`) in our hand for the next `n` cards in the deck. For example, we can take out any combination of 2 cards from the hand we are given, but we must replace these two cards with the next two cards from the deck (we can't pick any two cards from the deck).

# Evaluating hands

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

Here are the hands of poker

1. Royal flush (the problem didn't ask me to consider Royal Flush)

   > A, K, Q, J, 10, all the same suit.

2. Straight flush

   > Five cards in a sequence, all in the same suit. **Ace can either come before 2 or come after King.**

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
    > In the example below, the jack plays as the highest card.

## Evaluating a hand of cards

A hand is five cards. The first thing I did was write out functions to evaluate if a group of 5 cards satisfies the conditions of one of the ten hands.

Here's a sample hand:

```python
hand = ["3S", "JC", "QD", "5D", "AH"]
```

To write functions, I reached for using 2 important python features: `set` and `defaultdict`.

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

This function starts checking the most valuable hands. After it checks the second to lowest hand (pair), it returns a value of 1. This value of 1 corresponds to the "highest card" hand. Since I'm not comparing the relative value of hands, it doesn't matter what the highest card is, so the number just represents the _type_ of hand that is the strongest.

## Other hands

Here are the all of the functions I used to detect hands:

```python
card_order_dict = {"2":2, "3":3, "4":4, "5":5, "6":6, "7":7, "8":8, "9":9, "T":10,"J":11, "Q":12, "K":13, "A":14}

def check_straight_flush(hand):
    if check_flush(hand) and check_straight(hand):
        return True
    else:
        return False

def check_four_of_a_kind(hand):
    values = [i[0] for i in hand]
    value_counts = defaultdict(lambda:0)
    for v in values:
        value_counts[v]+=1
    if sorted(value_counts.values()) == [1,4]:
        return True
    return False

def check_full_house(hand):
    values = [i[0] for i in hand]
    value_counts = defaultdict(lambda:0)
    for v in values:
        value_counts[v]+=1
    if sorted(value_counts.values()) == [2,3]:
        return True
    return False

def check_flush(hand):
    suits = [i[1] for i in hand]
    if len(set(suits))==1:
        return True
    else:
        return False

def check_straight(hand):
    values = [i[0] for i in hand]
    value_counts = defaultdict(lambda:0)
    for v in values:
        value_counts[v] += 1
    rank_values = [card_order_dict[i] for i in values]
    value_range = max(rank_values) - min(rank_values)
    if len(set(value_counts.values())) == 1 and (value_range==4):
        return True
    else:
        #check straight with low Ace
        if set(values) == set(["A", "2", "3", "4", "5"]):
            return True
        return False

def check_three_of_a_kind(hand):
    values = [i[0] for i in hand]
    value_counts = defaultdict(lambda:0)
    for v in values:
        value_counts[v]+=1
    if set(value_counts.values()) == set([3,1]):
        return True
    else:
        return False

def check_two_pairs(hand):
    values = [i[0] for i in hand]
    value_counts = defaultdict(lambda:0)
    for v in values:
        value_counts[v]+=1
    if sorted(value_counts.values())==[1,2,2]:
        return True
    else:
        return False

def check_one_pairs(hand):
    values = [i[0] for i in hand]
    value_counts = defaultdict(lambda:0)
    for v in values:
        value_counts[v]+=1
    if 2 in value_counts.values():
        return True
    else:
        return False
```

`defaultdict` is a great built-in that is good to use when you don't know what elements will be in your dictionary, but you know what the initial values of any key that could be added should be. We don't need it here, but the alternative would be to write a very long dictionary where keys are the possible card values and the values of each key is 0.

# Finding the best hand

It would certainly be cleaner and more efficient to write out the above functions into one large function, but I wanted to keep things simple as I was under time constraints.

The next step in the problem is to determine the best possible hand we can get given the hand we are dealt and the 5 cards on top of the deck. I decided to first solve this problem with brute force. Here was my logic for this part: use `itertools` to get all combinations of groups of 0, 1, 2, 3, 4 and 5 cards from my hand and add the first `5 - n` cards from the deck so we get a five card deck. For each combination of cards we can run `check_hand()` and keep track of the highest rank hand, and then return that hand as the best hand. Here's the code I wrote for this part of the problem:

```python
from itertools import combinations

hand_dict = {9:"straight-flush", 8:"four-of-a-kind", 7:"full-house", 6:"flush", 5:"straight", 4:"three-of-a-kind", 3:"two-pairs", 2:"one-pair", 1:"highest-card"}

#exhaustive search using itertools.combinations
def play(cards):
    hand = cards[:5]
    deck = cards[5:]
    best_hand = 0
    for i in range(6):
        possible_combos = combinations(hand, 5-i)
        for c in possible_combos:
            current_hand = list(c) + deck[:i]
            hand_value = check_hand(current_hand)
            if hand_value > best_hand:
                best_hand = hand_value

    return hand_dict[best_hand]
```

# Checking test cases

Lastly, I need to check each hand and print out the best hand possible. Here's the loop I wrote to do this:

```python
for i in sys.stdin.readlines():
    cards = list(map(lambda x:x, i.split()))
    hand = cards[:5]
    deck = cards[5:]
    print("Hand:", " ".join(hand), "Deck:", " ".join(deck), "Best hand:", play(cards))
```

This will accept one round of cards per line:

```
2C 3D 4S 5D 7H KD QH 6C JH 2D
```

and it will output the following:

```
Hand: 2C 3D 4S 5D 7H Deck: KD QH 6C JH 2D Best hand: straight
```

# Optimization

This was an interesting problem to deal with as the solution contained several parts that worked together. While solving the problem I aimed worked through to the end leaving some parts to come back to that I felt confident in solving. Instead of writing each function to check differnt hands at the beginning, I filled most of these functions with `pass` and moved on to write the next part that involves checking each different combination of cards. Recently having worked through python's `itertools` exercises on Hackerrank, the `combinations` functions was fresh in my mind.

While I was able to arrive at a solution that satisfied the test cases, I did not have time to think about the efficiency or Big O analysis of the problem.

There is obviously some refactoring that I could do to make things cleaner. With more time I would take an object oriented approach by making classes for cards and hands, and adding class methods to evaluate the hands.

For each round, we have to run `check_hand()` on each hand combination. Let's think about how many hands we have to evaluate:

We have to consider combinations of cards formed by taking out groups of 0, 1, 2, 3, 4 and 5 cards and adding the next number of cards in the deck that bring the total card count to 5, which means we have to do 5C0 + 5C1 + 5C2 + 5C3 + 5C4 + 5C5 calls to `check_hand()`. So the sum of total calls is 1 + 5 + 10 + 10 + 5 + 1 = **32**.

For each of these 32 calls that happen when we run `play()`, `check_hands()` runs through each of the `check_` functions starting with the highest value hand. As soon as it finds a "match", `check_hands()` returns a number value (`hand_value`) corresponding to straight flush, four of a kind, etc. This value is then compared with the highest value that has been previously found (`best_hand`) and replaces that value if the current hand's hand rank has a higher value.

I'm not sure if there is faster way to find the best hand than the brute force method I implemented.
