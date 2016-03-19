
I start with the standard imports. I'll bring in new packages as I need them for more advanced analysis after pre-processing, visualization and exploration. 


```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
%matplotlib inline
bnp = pd.read_csv("train.csv")
```

How many observations/features are there in this data set?


```python
bnp.shape
```




    (114321, 133)



With so many features, it will be helpful to get a sense of what the respective datatypes are. 
From the competition's instructions, I know that all strings are categorical variables. 


```python
bnp.dtypes.value_counts()
```




    float64    108
    object      19
    int64        6
    dtype: int64




```python
# Next, I want to rename the features so they are easier to work with. I'll keep the original names (i.e. v1, v2, ...) 
# and append the name of the datatype to the end.
```


```python
data_types = [str(x) for x in bnp.dtypes]
df = pd.DataFrame(data_types)
```


```python
df.columns = ['vals'] 
df["feature_descriptions"] = bnp.columns
df['full_name'] = [df.feature_descriptions[x] + '_' + df.vals[x] for x in df.index]
```


```python
# Next, I rename the columns with the detailed names I generated in my df DataFrame. 

bnp.columns = df.full_name

#Additionally, we can group the features in order to simplifiy data visualization. 
object_columns = [col for col in df.full_name if 'object' in col]
int_columns = [col for col in df.full_name if 'int' in col]
float_columns = [col for col in df.full_name if 'float' in col]
```

There seem to be lots of NaN values in the data. The following histogram shows that most observations are missing either below six feature values, or are missing between 100 and 103 values. 

I'm don't have a strong hypothesis about how NaN values correlate to our target variabe. The features could represent data that a claimant did not submit, or it could be information about a claim that is not available for other reasons. This next section will investigate the relationship between missing values and our target. 


```python
# Explore NaN values
bnp['nan_count'] = bnp.isnull().sum(axis=1)
plt.figure(figsize=(20,8))
plt.hist(bnp.nan_count, bins = 133)
```




    (array([  1.77560000e+04,   2.84880000e+04,   1.41790000e+04,
              1.69000000e+03,   1.37700000e+03,   4.10000000e+01,
              3.30000000e+01,   1.60000000e+01,   0.00000000e+00,
              5.00000000e+00,   5.00000000e+00,   4.00000000e+00,
              1.00000000e+00,   3.00000000e+00,   4.00000000e+00,
              1.00000000e+00,   0.00000000e+00,   0.00000000e+00,
              4.00000000e+00,   1.00000000e+00,   3.00000000e+00,
              0.00000000e+00,   0.00000000e+00,   0.00000000e+00,
              0.00000000e+00,   0.00000000e+00,   0.00000000e+00,
              0.00000000e+00,   5.70000000e+02,   2.54000000e+02,
              4.70000000e+01,   2.00000000e+00,   1.00000000e+00,
              0.00000000e+00,   0.00000000e+00,   0.00000000e+00,
              1.00000000e+00,   1.00000000e+00,   0.00000000e+00,
              0.00000000e+00,   0.00000000e+00,   1.00000000e+00,
              1.00000000e+00,   0.00000000e+00,   0.00000000e+00,
              0.00000000e+00,   0.00000000e+00,   0.00000000e+00,
              0.00000000e+00,   0.00000000e+00,   0.00000000e+00,
              0.00000000e+00,   0.00000000e+00,   0.00000000e+00,
              0.00000000e+00,   0.00000000e+00,   0.00000000e+00,
              0.00000000e+00,   0.00000000e+00,   0.00000000e+00,
              0.00000000e+00,   0.00000000e+00,   0.00000000e+00,
              0.00000000e+00,   0.00000000e+00,   0.00000000e+00,
              0.00000000e+00,   0.00000000e+00,   0.00000000e+00,
              0.00000000e+00,   0.00000000e+00,   0.00000000e+00,
              1.10000000e+01,   1.90000000e+01,   5.00000000e+00,
              0.00000000e+00,   1.00000000e+00,   0.00000000e+00,
              0.00000000e+00,   0.00000000e+00,   0.00000000e+00,
              0.00000000e+00,   0.00000000e+00,   0.00000000e+00,
              0.00000000e+00,   0.00000000e+00,   0.00000000e+00,
              0.00000000e+00,   0.00000000e+00,   0.00000000e+00,
              0.00000000e+00,   4.57000000e+02,   1.04900000e+03,
              4.58000000e+02,   4.30000000e+01,   4.10000000e+01,
              1.00000000e+00,   0.00000000e+00,   1.00000000e+00,
              1.00000000e+00,   0.00000000e+00,   0.00000000e+00,
              0.00000000e+00,   0.00000000e+00,   0.00000000e+00,
              0.00000000e+00,   0.00000000e+00,   0.00000000e+00,
              0.00000000e+00,   0.00000000e+00,   0.00000000e+00,
              0.00000000e+00,   4.41700000e+03,   2.69670000e+04,
              1.52620000e+04,   0.00000000e+00,   7.08000000e+02,
              2.16000000e+02,   8.30000000e+01,   2.30000000e+01,
              3.50000000e+01,   2.60000000e+01,   6.00000000e+00,
              1.00000000e+00,   0.00000000e+00,   0.00000000e+00,
              0.00000000e+00,   0.00000000e+00,   0.00000000e+00,
              0.00000000e+00,   0.00000000e+00,   0.00000000e+00,
              1.00000000e+00]),
     array([   0.        ,    0.88721805,    1.77443609,    2.66165414,
               3.54887218,    4.43609023,    5.32330827,    6.21052632,
               7.09774436,    7.98496241,    8.87218045,    9.7593985 ,
              10.64661654,   11.53383459,   12.42105263,   13.30827068,
              14.19548872,   15.08270677,   15.96992481,   16.85714286,
              17.7443609 ,   18.63157895,   19.51879699,   20.40601504,
              21.29323308,   22.18045113,   23.06766917,   23.95488722,
              24.84210526,   25.72932331,   26.61654135,   27.5037594 ,
              28.39097744,   29.27819549,   30.16541353,   31.05263158,
              31.93984962,   32.82706767,   33.71428571,   34.60150376,
              35.4887218 ,   36.37593985,   37.26315789,   38.15037594,
              39.03759398,   39.92481203,   40.81203008,   41.69924812,
              42.58646617,   43.47368421,   44.36090226,   45.2481203 ,
              46.13533835,   47.02255639,   47.90977444,   48.79699248,
              49.68421053,   50.57142857,   51.45864662,   52.34586466,
              53.23308271,   54.12030075,   55.0075188 ,   55.89473684,
              56.78195489,   57.66917293,   58.55639098,   59.44360902,
              60.33082707,   61.21804511,   62.10526316,   62.9924812 ,
              63.87969925,   64.76691729,   65.65413534,   66.54135338,
              67.42857143,   68.31578947,   69.20300752,   70.09022556,
              70.97744361,   71.86466165,   72.7518797 ,   73.63909774,
              74.52631579,   75.41353383,   76.30075188,   77.18796992,
              78.07518797,   78.96240602,   79.84962406,   80.73684211,
              81.62406015,   82.5112782 ,   83.39849624,   84.28571429,
              85.17293233,   86.06015038,   86.94736842,   87.83458647,
              88.72180451,   89.60902256,   90.4962406 ,   91.38345865,
              92.27067669,   93.15789474,   94.04511278,   94.93233083,
              95.81954887,   96.70676692,   97.59398496,   98.48120301,
              99.36842105,  100.2556391 ,  101.14285714,  102.03007519,
             102.91729323,  103.80451128,  104.69172932,  105.57894737,
             106.46616541,  107.35338346,  108.2406015 ,  109.12781955,
             110.01503759,  110.90225564,  111.78947368,  112.67669173,
             113.56390977,  114.45112782,  115.33834586,  116.22556391,
             117.11278195,  118.        ]),
     <a list of 133 Patch objects>)




![png](BNP-Copy1_files/BNP-Copy1_11_1.png)

