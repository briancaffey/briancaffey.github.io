---

layout: post
title: "BNP Paribas Cardif Claims Management Competition"
date: 2016-03-15

---

In order to apply the tools and concepts I have learned about in DAT-DC-11, I have decided to participate in a Kaggle Competition for my final project. 

The competition is hosted by the European Insurance company BNP Paribas Cardif, and the goal of the competition is to classify insurance claims into one of two categories: claims which for which the process can be accelerated, and claims for which the process cannot be accelerated. 


```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
%matplotlib inline
bnp = pd.read_csv("train.csv")
```

{% include BNP-Copy1.md %}

