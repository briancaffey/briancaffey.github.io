---

layout: post
title: Using TensorBoard with TensorFlow models
date: 2017-11-19
comments: true

---

This article picks up where the last article left off. I'm working on my laptop which is connecting to my desktop via SSH. 

I'll start by installing some packages in my docker container: 

```terminal
root@bf48572c314f:/# apt-get update
root@bf48572c314f:/# apt-get install vim
```

Next I'm going to copy [this python script](https://github.com/tensorflow/tensorflow/blob/r1.4/tensorflow/examples/tutorials/mnist/mnist_with_summaries.py) into a file `tb.py` and run the file:

```terminal
root@bf48572c314f:/home# python tb.py 
Successfully downloaded train-images-idx3-ubyte.gz 9912422 bytes.
Extracting /tmp/tensorflow/mnist/input_data/train-images-idx3-ubyte.gz
Successfully downloaded train-labels-idx1-ubyte.gz 28881 bytes.
Extracting /tmp/tensorflow/mnist/input_data/train-labels-idx1-ubyte.gz
Successfully downloaded t10k-images-idx3-ubyte.gz 1648877 bytes.
Extracting /tmp/tensorflow/mnist/input_data/t10k-images-idx3-ubyte.gz
Successfully downloaded t10k-labels-idx1-ubyte.gz 4542 bytes.
Extracting /tmp/tensorflow/mnist/input_data/t10k-labels-idx1-ubyte.gz
2017-11-20 02:58:13.268527: I tensorflow/core/platform/cpu_feature_guard.cc:137] Your CPU supports instructions that this TensorFlow binary was not compiled to use: SSE4.1 SSE4.2 AVX AVX2 FMA
2017-11-20 02:58:13.361075: I tensorflow/stream_executor/cuda/cuda_gpu_executor.cc:892] successful NUMA node read from SysFS had negative value (-1), but there must be at least one NUMA node, so returning NUMA node zero
2017-11-20 02:58:13.361337: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1030] Found device 0 with properties: 
name: GeForce GTX 1080 major: 6 minor: 1 memoryClockRate(GHz): 1.7335
pciBusID: 0000:01:00.0
totalMemory: 7.92GiB freeMemory: 7.65GiB
2017-11-20 02:58:13.361351: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1120] Creating TensorFlow device (/device:GPU:0) -> (device: 0, name: GeForce GTX 1080, pci bus id: 0000:01:00.0, compute capability: 6.1)
Accuracy at step 0: 0.1114
Accuracy at step 10: 0.7291
Accuracy at step 20: 0.8156
Accuracy at step 30: 0.8644
Accuracy at step 40: 0.8802
Accuracy at step 50: 0.8891
Accuracy at step 60: 0.8991
Accuracy at step 70: 0.9061
Accuracy at step 80: 0.9118
Accuracy at step 90: 0.9175
2017-11-20 02:58:18.765964: I tensorflow/stream_executor/dso_loader.cc:139] successfully opened CUDA library libcupti.so.8.0 locally
Adding run metadata for 99
Accuracy at step 100: 0.9139
Accuracy at step 110: 0.9191
Accuracy at step 120: 0.9225
Accuracy at step 130: 0.9222
Accuracy at step 140: 0.9253
Accuracy at step 150: 0.9286
Accuracy at step 160: 0.9288
Accuracy at step 170: 0.929
Accuracy at step 180: 0.9334
Accuracy at step 190: 0.9339
Adding run metadata for 199
Accuracy at step 200: 0.9338
Accuracy at step 210: 0.9316
Accuracy at step 220: 0.9384
Accuracy at step 230: 0.9401
Accuracy at step 240: 0.9359
Accuracy at step 250: 0.9405
Accuracy at step 260: 0.9434
Accuracy at step 270: 0.9396
Accuracy at step 280: 0.9396
Accuracy at step 290: 0.9401
Adding run metadata for 299
Accuracy at step 300: 0.9424
Accuracy at step 310: 0.9432
Accuracy at step 320: 0.9433
Accuracy at step 330: 0.9474
Accuracy at step 340: 0.9495
Accuracy at step 350: 0.9462
Accuracy at step 360: 0.9503
Accuracy at step 370: 0.9495
Accuracy at step 380: 0.9503
Accuracy at step 390: 0.9512
Adding run metadata for 399
Accuracy at step 400: 0.9517
Accuracy at step 410: 0.9512
Accuracy at step 420: 0.953
Accuracy at step 430: 0.9512
Accuracy at step 440: 0.9521
Accuracy at step 450: 0.952
Accuracy at step 460: 0.9559
Accuracy at step 470: 0.9539
Accuracy at step 480: 0.9564
Accuracy at step 490: 0.9556
Adding run metadata for 499
Accuracy at step 500: 0.9517
Accuracy at step 510: 0.9581
Accuracy at step 520: 0.9581
Accuracy at step 530: 0.9563
Accuracy at step 540: 0.9586
Accuracy at step 550: 0.9575
Accuracy at step 560: 0.9575
Accuracy at step 570: 0.9602
Accuracy at step 580: 0.9603
Accuracy at step 590: 0.9583
Adding run metadata for 599
Accuracy at step 600: 0.9581
Accuracy at step 610: 0.9617
Accuracy at step 620: 0.9621
Accuracy at step 630: 0.9612
Accuracy at step 640: 0.9611
Accuracy at step 650: 0.9638
Accuracy at step 660: 0.965
Accuracy at step 670: 0.9612
Accuracy at step 680: 0.9619
Accuracy at step 690: 0.9614
Adding run metadata for 699
Accuracy at step 700: 0.9625
Accuracy at step 710: 0.9613
Accuracy at step 720: 0.963
Accuracy at step 730: 0.9639
Accuracy at step 740: 0.9602
Accuracy at step 750: 0.9659
Accuracy at step 760: 0.9658
Accuracy at step 770: 0.9637
Accuracy at step 780: 0.9647
Accuracy at step 790: 0.9643
Adding run metadata for 799
Accuracy at step 800: 0.9646
Accuracy at step 810: 0.965
Accuracy at step 820: 0.9661
Accuracy at step 830: 0.9663
Accuracy at step 840: 0.963
Accuracy at step 850: 0.964
Accuracy at step 860: 0.9611
Accuracy at step 870: 0.9679
Accuracy at step 880: 0.966
Accuracy at step 890: 0.9664
Adding run metadata for 899
Accuracy at step 900: 0.9651
Accuracy at step 910: 0.9679
Accuracy at step 920: 0.9696
Accuracy at step 930: 0.9686
Accuracy at step 940: 0.9654
Accuracy at step 950: 0.9688
Accuracy at step 960: 0.9663
Accuracy at step 970: 0.9667
Accuracy at step 980: 0.9671
Accuracy at step 990: 0.9667
Adding run metadata for 999
root@bf48572c314f:/home# 
```

This