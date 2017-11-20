---

layout: post
title: Using Tensorflow and Tensorboard with Docker
date: 2017-11-20
comments: true

---

In my last article we set up Tensorflow with Docker. Next I want to try to get Tensorboard running. 

When we opened the Jupyter notebook, our command included port mapping. Here is that command: 

```terminal
$ sudo nvidia-docker run -it -p 8888:8888 tensorflow/tensorflow:latest-gpu
```

Tensorboard will be served in our browser on port `6006`, so we will want to do that port mapping in our `nvidia-docker` command:


```terminal
sudo nvidia-docker run -p 0.0.0.0:6006:6006 -it tensorflow/tensorflow:latest-gpu bash
```

I want to run [this script](https://github.com/tensorflow/tensorflow/blob/master/tensorflow/examples/tutorials/mnist/mnist_with_summaries.py) from the Tensorflow github repo. It is an example of MNIST with summaries. Summaries are logs that are captured from script and they provide the data that runs Tensorboard. In this case they are recorded in `/tmp/tensorflow/mnist/logs/`. 

To start with this script let's just copy and paste it into a file. We will need to add vim to our docker container for that: 

```terminal
# apt-get update
# apt-get install vim
```

Now we can copy and paste the script and run it:

```python
root@eb9e069064d7:~# python tb.py 
Successfully downloaded train-images-idx3-ubyte.gz 9912422 bytes.
Extracting /tmp/tensorflow/mnist/input_data/train-images-idx3-ubyte.gz
Successfully downloaded train-labels-idx1-ubyte.gz 28881 bytes.
Extracting /tmp/tensorflow/mnist/input_data/train-labels-idx1-ubyte.gz
Successfully downloaded t10k-images-idx3-ubyte.gz 1648877 bytes.
Extracting /tmp/tensorflow/mnist/input_data/t10k-images-idx3-ubyte.gz
Successfully downloaded t10k-labels-idx1-ubyte.gz 4542 bytes.
Extracting /tmp/tensorflow/mnist/input_data/t10k-labels-idx1-ubyte.gz
2017-11-20 03:52:53.792141: I tensorflow/core/platform/cpu_feature_guard.cc:137] Your CPU supports instructions that this TensorFlow binary was not compiled to use: SSE4.1 SSE4.2 AVX AVX2 FMA
2017-11-20 03:52:53.878640: I tensorflow/stream_executor/cuda/cuda_gpu_executor.cc:892] successful NUMA node read from SysFS had negative value (-1), but there must be at least one NUMA node, so returning NUMA node zero
2017-11-20 03:52:53.878892: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1030] Found device 0 with properties: 
name: GeForce GTX 1080 major: 6 minor: 1 memoryClockRate(GHz): 1.7335
pciBusID: 0000:01:00.0
totalMemory: 7.92GiB freeMemory: 7.43GiB
2017-11-20 03:52:53.878904: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1120] Creating TensorFlow device (/device:GPU:0) -> (device: 0, name: GeForce GTX 1080, pci bus id: 0000:01:00.0, compute capability: 6.1)
Accuracy at step 0: 0.1235
Accuracy at step 10: 0.7297
Accuracy at step 20: 0.8414
Accuracy at step 30: 0.8717
Accuracy at step 40: 0.886
Accuracy at step 50: 0.896
Accuracy at step 60: 0.9027
Accuracy at step 70: 0.9068
Accuracy at step 80: 0.9101
Accuracy at step 90: 0.9121
2017-11-20 03:52:57.583676: I tensorflow/stream_executor/dso_loader.cc:139] successfully opened CUDA library libcupti.so.8.0 locally
Adding run metadata for 99
Accuracy at step 100: 0.9124
Accuracy at step 110: 0.9164
Accuracy at step 120: 0.9198
Accuracy at step 130: 0.9205
Accuracy at step 140: 0.9142
Accuracy at step 150: 0.9224
Accuracy at step 160: 0.9294
Accuracy at step 170: 0.928
Accuracy at step 180: 0.9312
Accuracy at step 190: 0.9301
Adding run metadata for 199
Accuracy at step 200: 0.9346
Accuracy at step 210: 0.9381
Accuracy at step 220: 0.9396
Accuracy at step 230: 0.9406
Accuracy at step 240: 0.9273
Accuracy at step 250: 0.941
Accuracy at step 260: 0.9369
Accuracy at step 270: 0.9329
Accuracy at step 280: 0.9404
Accuracy at step 290: 0.9444
Adding run metadata for 299
Accuracy at step 300: 0.9438
Accuracy at step 310: 0.9426
Accuracy at step 320: 0.9462
Accuracy at step 330: 0.9449
Accuracy at step 340: 0.9478
Accuracy at step 350: 0.9458
Accuracy at step 360: 0.9464
Accuracy at step 370: 0.9474
Accuracy at step 380: 0.9528
Accuracy at step 390: 0.9499
Adding run metadata for 399
Accuracy at step 400: 0.9507
Accuracy at step 410: 0.9501
Accuracy at step 420: 0.9513
Accuracy at step 430: 0.9483
Accuracy at step 440: 0.9518
Accuracy at step 450: 0.949
Accuracy at step 460: 0.9543
Accuracy at step 470: 0.9552
Accuracy at step 480: 0.9515
Accuracy at step 490: 0.9544
Adding run metadata for 499
Accuracy at step 500: 0.9586
Accuracy at step 510: 0.9567
Accuracy at step 520: 0.9572
Accuracy at step 530: 0.9574
Accuracy at step 540: 0.9584
Accuracy at step 550: 0.9593
Accuracy at step 560: 0.958
Accuracy at step 570: 0.9575
Accuracy at step 580: 0.9582
Accuracy at step 590: 0.9609
Adding run metadata for 599
Accuracy at step 600: 0.9618
Accuracy at step 610: 0.9605
Accuracy at step 620: 0.9606
Accuracy at step 630: 0.961
Accuracy at step 640: 0.963
Accuracy at step 650: 0.9614
Accuracy at step 660: 0.9622
Accuracy at step 670: 0.9634
Accuracy at step 680: 0.9641
Accuracy at step 690: 0.9627
Adding run metadata for 699
Accuracy at step 700: 0.9623
Accuracy at step 710: 0.9612
Accuracy at step 720: 0.9628
Accuracy at step 730: 0.965
Accuracy at step 740: 0.9635
Accuracy at step 750: 0.9635
Accuracy at step 760: 0.9648
Accuracy at step 770: 0.9637
Accuracy at step 780: 0.9658
Accuracy at step 790: 0.9649
Adding run metadata for 799
Accuracy at step 800: 0.9681
Accuracy at step 810: 0.9661
Accuracy at step 820: 0.9657
Accuracy at step 830: 0.9646
Accuracy at step 840: 0.9647
Accuracy at step 850: 0.965
Accuracy at step 860: 0.9677
Accuracy at step 870: 0.9649
Accuracy at step 880: 0.9675
Accuracy at step 890: 0.969
Adding run metadata for 899
Accuracy at step 900: 0.9689
Accuracy at step 910: 0.967
Accuracy at step 920: 0.9672
Accuracy at step 930: 0.9645
Accuracy at step 940: 0.9657
Accuracy at step 950: 0.9699
Accuracy at step 960: 0.968
Accuracy at step 970: 0.9679
Accuracy at step 980: 0.9651
Accuracy at step 990: 0.9683
Adding run metadata for 999
```

The script completed successfully! Now we can can take a look at what happened during the training. Launch Tensorboard with the following command:

```terminal
root@eb9e069064d7:~# tensorboard --logdir=/tmp/tensorflow/mnist/logs/
TensorBoard 0.4.0rc2 at http://eb9e069064d7:6006 (Press CTRL+C to quit)
```

Now we can simply navigate to `localhost:6006` in our browser to start using Tensorboard. Here's a screenshot of Tensorboard showing accuracy: 


![png](/static/tf.png)

This wasn't too bad. The MNIST example included a very nice script with everything set up properly. My next big challenge is to implement some type of learning model with a data set of my own and visualize it with TensorBoard, but I'll have to go through several examples before then. 