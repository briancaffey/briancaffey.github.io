---

layout: post
title: Fixing IPython module import errors
date: 2017-11-07
comments: true

---

This is a short article discussing a fix for an issue I recently had with module imports failing in IPython and Jupyter notebooks. The module I wanted to import in my Jupyter notebook, `geopandas`, was able to be successfully imported in the terminal, but was failing in both the IPython interactive terminal and in my Jupyter notebook environment. 

I came across the following suggestion on [this](https://github.com/jupyter/notebook/issues/1524) issue discussion on Github:

```
$ /Users/abc/anaconda/bin/python -m pip install ipykernel
$ /Users/abc/anaconda/bin/python -m  ipykernel install
```

Running this command told me that the package was already installed. Since I am using a virtual environment (with Anaconda), I need to install this in the virtual environment. To get the path we can run the following in IPython: 

```python
import sys
sys.executable
```

For me this prints out the following: 

```terminal
/home/brian/anaconda3/envs/c4dc/bin/python
```

Finally, what worked for me was to run the following commands: 

```terminal
/home/brian/anaconda3/envs/c4dc/bin/python -m pip install ipykernel
```

This installed the IPython kernal and I was able to successfully import `geopandas` into my Jupyter notebook. Hopefully this helps you if you are having an trouble making imports with IPython or Jupyter notebooks. 