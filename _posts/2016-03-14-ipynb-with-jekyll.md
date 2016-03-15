---

layout: post
title: "Including Jupyter Notebooks in Jekyll blog posts"
date: 2016-03-14 
comments: true

---

I've been looking for ways to incorporate Jupyter notebooks into my new blog. This post explains a process that I've come across, although there may be other ways to blog directly from iPython Notebooks. 

This methods allows you to include styled cell input and output (including graphs, Data Frames, etc.) 

When you have completed your iPython Notebook (`jekyll_test.ipynb` in this example), run the following command in your terminal to convert your `jekyll_test.ipynb` file into Markdown:  

`$ ipython nbconvert jekyll_test.ipynb --to markdown`  

You can read more about converting iPython Notebooks [here](https://ipython.org/ipython-doc/3/notebook/nbconvert.html). In your terminal you should see the following: 

```terminal
$ ipython nbconvert jekyll_test.ipynb --to markdown
[NbConvertApp] Converting notebook jekyll_test.ipynb to markdown
[NbConvertApp] Support files will be in jekyll_test_files/
[NbConvertApp] Making directory jekyll_test_files
[NbConvertApp] Writing 286 bytes to jekyll_test.md
```

This puts related image files from graphs into a new folder, `jekyll_test_files/`, so you will have to make sure the path matches up. I have created a top-level folder named `ipynb` to keep things orderly.

Next, copy the contents from the resulting Markdown folder into your blog post. I had to change the image file path so that images display properly.  

`![png](jekyll_test_files/jekyll_test_2_1.png)`  

I added `/ipynb/` to the beginning of the path:

`![png](/ipynb/jekyll_test_files/jekyll_test_2_1.png)`  

# Result 

Here is the result from a simple notebook that I used here: 

```python
import matplotlib.pyplot as plt
%matplotlib inline
```


```python
x = [1,2,3,4,5]
y = [5,4,3,2,1]
```


```python
plt.plot(x,y)
```




    [<matplotlib.lines.Line2D at 0x10dde4610>]




![png](/ipynb/jekyll_test_files/jekyll_test_2_1.png)

I hope you found this helpful, thanks for reading!