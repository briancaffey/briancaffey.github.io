---
layout: post
title: Installing the GPU version of Tensorflow with Docker on Arch Linux
date: 2017-11-19
comments: true
image: /static/trump.png
tags:
  - arch-linux
  - tensorflow
  - docker
  - nvidia
  - python
---

I've tried installing the GPU version of Tensorflow a few times before and failed. There seems to be lots of confusion about the build process, of which there are many. Also, over the last few years there have been many new versions of the software needed to support the GPU version of Tensorflow as well as the first official release of Tensorflow itself (which is now on version 1.4), such as CUDA and cudnn, and different version of python. This is one more attempt at installing the GPU version of Tensor Flow on my Desktop PC that is currently dual booting with Arch Linux and Windows 10. I've decided to try going the docker route because it should eliminate some of the headache of missing depedencies. Here are the specs for my computer:

- i7-6700K
- NVIDIA GTX 1080
- Asus Hero VIII motherboard
- Arch Linux on a 128 GB SSD (Windows 10 is installed on a separate SSD)

## Installing CUDA and cudnn

We don't need to install these when installing Tensorflow with Docker. Read to the bottom for more info.

## Installing Docker

To install docker on our machine, let's start with the [Arch Wiki article on docker](https://wiki.archlinux.org/index.php/Docker).

We need to add the Loopback module to the Linux Kernel, so we run:

```terminal
# tee /etc/modules-load.d/loop.conf <<< "loop"
# modprobe loop
$ reboot
```

Ater rebooting we can install docker:

```terminal
yaourt -S docker
```

Now we want to add ourself to the docker group with the following command:

```terminal
$ sudo gpasswd -a brian docker
[sudo] password for brian:
Adding user brian to group docker
```

If you run `groups`, you won't see docker listed in the groups you (brian) belong to. Run `newgrp docker` and then re-run docker and you should see `docker` listed with any other groups you belong to:

`````terminal
[brian@a1arch ~]$ groups
wheel storage power users
[brian@a1arch ~]$ newgrp docker
                   -`                    brian@a1arch
                  .o+`                   ------------
                 `ooo/                   OS: Arch Linux x86_64
                `+oooo:                  Kernel: 4.12.8-2-ARCH
               `+oooooo:                 Uptime: 6 mins
               -+oooooo+:                Packages: 1127
             `/:-:++oooo+:               Shell: bash 4.4.12
            `/++++/+++++++:              Resolution: 1920x1080
           `/++++++++++++++:             WM: i3
          `/+++ooooooooooooo/`           Theme: Adwaita [GTK2]
         ./ooosssso++osssssso+`          Icons: Adwaita [GTK2]
        .oossssso-````/ossssss+`         Terminal: urxvt
       -osssssso.      :ssssssso.        Terminal Font: Inconsolata-12
      :osssssss/        osssso+++.       CPU: Intel i7-6700K (8) @ 4.200GHz
     /ossssssss/        +ssssooo/-       GPU: NVIDIA GeForce GTX 1080
   `/ossssso+/:-        -:/+osssso+-     Memory: 3289MiB / 15975MiB
  `+sso+:-`                 `.-/+oso:
 `++:.                           `-/+/
 .`                                 `/

[brian@a1arch ~]$ groups
docker wheel storage power users
`````

Doing this prevents us from having to write sudo each time we run docker.

Next we need to start the docker daemon.

```
$ systemctl start docker
==== AUTHENTICATING FOR org.freedesktop.systemd1.manage-units ====
Authentication is required to start 'docker.service'.
Authenticating as: brian
Password:
==== AUTHENTICATION COMPLETE ====
$
```

### Side note

There seems to be an [Arch Linux-specific bug](https://github.com/moby/moby/issues/23289) which prevents us from enabling docker (and nvidia-docker which we will get next). There is a solution to downgrade to an older version of docker, or you can just start the docker service and the nvidia-docker service when you want to use them. I have found it faster to first start nvidia-docker and then start docker services.

So far so good. Next let's look at the Tensorflow documentation for installing Tensorflow with docker.

We need to install `nvidia-docker`:

```terminal
$ yaourt -S nvidia-docker
[...]
[sudo] password for brian:
loading packages...
resolving dependencies...
looking for conflicting packages...

Packages (1) nvidia-docker-1.0.1-1

Total Installed Size:  13.34 MiB

:: Proceed with installation? [Y/n]
(1/1) checking keys in keyring                                 [##################################] 100%
(1/1) checking package integrity                               [##################################] 100%
(1/1) loading package files                                    [##################################] 100%
(1/1) checking for file conflicts                              [##################################] 100%
(1/1) checking available disk space                            [##################################] 100%
:: Processing package changes...
(1/1) installing nvidia-docker                                 [##################################] 100%
=> Prior to running 'CUDA'-containers, ensure that the nvidia-docker-plugin
   is loaded. -> https://github.com/NVIDIA/nvidia-docker#other-distributions

*) manually; sudo -b nohup nvidia-docker-plugin > /tmp/nvidia-docker.log

*) automatically at startup; systemctl enable nvidia-docker.service
Optional dependencies for nvidia-docker
    cuda [installed]
    nvidia [installed]
    opencl-nvidia [installed]
:: Running post-transaction hooks...
(1/1) Arming ConditionNeedsUpdate...
```

Next it says: Launch a Docker container that contains one of the TensorFlow binary images. Those images are available [here](https://hub.docker.com/r/tensorflow/tensorflow/tags/).

Next I pulled the container with the `gpu-latest` tag and it started to download the container:

```terminal
$ docker pull tensorflow/tensorflow:gpu-latest
[sudo] password for brian:
latest-gpu: Pulling from tensorflow/tensorflow
ae79f2514705: Pull complete
c59d01a7e4ca: Pull complete
41ba73a9054d: Pull complete
f1bbfd495cc1: Pull complete
0c346f7223e2: Pull complete
5dcd01667896: Pull complete
ca677f607487: Downloading  180.7MB/453MB
b4637619a887: Download complete
8c644ff287da: Downloading    224MB/465.6MB
119c5f576e79: Download complete
009f82e71a7c: Download complete
dbc0fb5872c7: Downloading  17.83MB/66.54MB
5ef01389c5b2: Waiting
04f824004b76: Waiting
5861b82f52e5: Waiting
a495a3b4e6e1: Waiting
3a0a25b1bbaf: Pulling fs layer
b76a0afeb1e1: Waiting
```

It finished after several minutes:

```terminal
ca677f607487: Pull complete
b4637619a887: Pull complete
8c644ff287da: Pull complete
119c5f576e79: Pull complete
009f82e71a7c: Pull complete
dbc0fb5872c7: Pull complete
5ef01389c5b2: Pull complete
04f824004b76: Pull complete
5861b82f52e5: Pull complete
a495a3b4e6e1: Pull complete
3a0a25b1bbaf: Pull complete
b76a0afeb1e1: Pull complete
Digest: sha256:90e27448121b321c5ec66069fb2c718301df2ddaf25ba916b6f53719141572b0
Status: Downloaded newer image for tensorflow/tensorflow:latest-gpu
$
```

Let's verify that it has the image:

```terminal
$ docker images
REPOSITORY              TAG                 IMAGE ID            CREATED             SIZE
tensorflow/tensorflow   latest-gpu          2f243a16ff63        13 days ago         3.36GB
```

Next let's start the `nvidia-docker` service:

```terminal
$ systemctl start nvidia-docker
==== AUTHENTICATING FOR org.freedesktop.systemd1.manage-units ====
Authentication is required to start 'nvidia-docker.service'.
Authenticating as: brian
Password:
==== AUTHENTICATION COMPLETE ====
$
```

OK, we should be ready to launch the image:

```terminal
$ nvidia-docker run -it tensorflow/tensorflow:latest-gpu bash
root@761a62c1cff1:/notebooks#
```

This is looking good. Let's try to start python:

```terminal
root@761a62c1cff1:/notebooks# python
Python 2.7.12 (default, Nov 19 2016, 06:48:10)
[GCC 5.4.0 20160609] on linux2
Type "help", "copyright", "credits" or "license" for more information.
>>> import tensorflow as tf
>>>
```

That works! Let's try out the classic MNIST hand-written digit classification problem that comes packaged as a notebook with the container image:

```terminal
$ nvidia-docker run -it -p 8888:8888 tensorflow/tensorflow:latest-gpu
[sudo] password for brian:
[I 21:54:26.671 NotebookApp] Writing notebook server cookie secret to /root/.local/share/jupyter/runtime/notebook_cookie_secret
[W 21:54:26.689 NotebookApp] WARNING: The notebook server is listening on all IP addresses and not using encryption. This is not recommended.
[I 21:54:26.693 NotebookApp] Serving notebooks from local directory: /notebooks
[I 21:54:26.693 NotebookApp] 0 active kernels
[I 21:54:26.693 NotebookApp] The Jupyter Notebook is running at:
[I 21:54:26.693 NotebookApp] http://[all ip addresses on your system]:8888/?token=cda89aff96a3d4a9741cc755aac07f65f3aa372f60a198bd
[I 21:54:26.693 NotebookApp] Use Control-C to stop this server and shut down all kernels (twice to skip confirmation).
[C 21:54:26.693 NotebookApp]

    Copy/paste this URL into your browser when you connect for the first time,
    to login with a token:
        http://localhost:8888/?token=cda89aff96a3d4a9741cc755aac07f65f3aa372f60a198bd
[I 21:54:34.489 NotebookApp] 302 GET /?token=cda89aff96a3d4a9741cc755aac07f65f3aa372f60a198bd (172.17.0.1) 0.32ms
[I 21:54:59.019 NotebookApp] Writing notebook-signing key to /root/.local/share/jupyter/notebook_secret
[W 21:54:59.023 NotebookApp] Notebook 3_mnist_from_scratch.ipynb is not trusted
[W 21:54:59.049 NotebookApp] 404 GET /nbextensions/widgets/notebook/js/extension.js?v=20171119215426 (172.17.0.1) 4.38ms referer=http://localhost:8888/notebooks/3_mnist_from_scratch.ipynb
[I 21:54:59.813 NotebookApp] Kernel started: 00027a3e-59ae-47ce-90a5-752a9d1fe075
[I 21:55:00.199 NotebookApp] Adapting to protocol v5.1 for kernel 00027a3e-59ae-47ce-90a5-752a9d1fe075
[I 21:56:59.815 NotebookApp] Saving file at /3_mnist_from_scratch.ipynb
[W 21:56:59.816 NotebookApp] Notebook 3_mnist_from_scratch.ipynb is not trusted
2017-11-19 21:57:03.988627: I tensorflow/core/platform/cpu_feature_guard.cc:137] Your CPU supports instructions that this TensorFlow binary was not compiled to use: SSE4.1 SSE4.2 AVX AVX2 FMA
2017-11-19 21:57:04.070873: I tensorflow/stream_executor/cuda/cuda_gpu_executor.cc:892] successful NUMA node read from SysFS had negative value (-1), but there must be at least one NUMA node, so returning NUMA node zero
2017-11-19 21:57:04.071129: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1030] Found device 0 with properties:
name: GeForce GTX 1080 major: 6 minor: 1 memoryClockRate(GHz): 1.7335
pciBusID: 0000:01:00.0
totalMemory: 7.92GiB freeMemory: 7.44GiB
2017-11-19 21:57:04.071143: I tensorflow/core/common_runtime/gpu/gpu_device.cc:1120] Creating TensorFlow device (/device:GPU:0) -> (device: 0, name: GeForce GTX 1080, pci bus id: 0000:01:00.0, compute capability: 6.1)
```

I was only able to get the entire notebook to run after making a few small configuration tweaks to the tensorflow Interactive Session to fix some memory issues:

```python
gpu_options = tf.GPUOptions(per_process_gpu_memory_fraction=0.75)

s = tf.InteractiveSession(config=tf.ConfigProto(gpu_options=gpu_options))

# Use our newly created session as the default for
# subsequent operations.
s.as_default()

# Initialize all the variables we defined above.
tf.global_variables_initializer().run()
```

Without setting `gpu_options`, Tensorflow allocates 95% of available GPU memory (according to [this SO question](https://stackoverflow.com/questions/34514324/error-using-tensorflow-with-gpu)).

Setting it to `0.333` was too low and didn't allow for training to complete, but setting it to `0.75` seemed to work just fine.

You can monitor GPU memory usage on NVIDIA cards with the following command:

```
$ nvidia-smi
Sun Nov 19 17:03:03 2017
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 384.59                 Driver Version: 384.59                    |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  GeForce GTX 1080    Off  | 00000000:01:00.0  On |                  N/A |
| 27%   32C    P8    10W / 180W |   6707MiB /  8105MiB |      0%      Default |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                       GPU Memory |
|  GPU       PID  Type  Process name                               Usage      |
|=============================================================================|
|    0       350    C   /usr/bin/python                               6365MiB |
|    0       554    G   /usr/lib/xorg-server/Xorg                       19MiB |
|    0       588    G   /usr/bin/gnome-shell                            28MiB |
|    0       853    G   /usr/lib/xorg-server/Xorg                      186MiB |
|    0       873    G   compton                                          2MiB |
|    0      1114    G   ...el-token=A50C2F183DB4F79482A2D8768ED1B285    64MiB |
|    0      2190    G   ...el-token=1AC796A35DBDCDBE07AEC2FC1E8026C4    35MiB |
+-----------------------------------------------------------------------------+
```

I think this was a success! I'm fairly certain that we were leveraging the GPU to run the MNIST hand-written digit notebook. I didn't see messages that CUDNN loaded, but I can find versions of both CUDNN and CUDA in the docker image:

```terminal
root@80f65a971e9a:/# ls /usr/include/x86_64-linux-gnu/
a.out.h  bits  cudnn_v6.h      fpu_control.h  gnu        python2.7
asm      c++   expat_config.h  freetype2      ieee754.h  sys
```

```terminal
root@80f65a971e9a:/# nvcc --version
nvcc: NVIDIA (R) Cuda compiler driver
Copyright (c) 2005-2016 NVIDIA Corporation
Built on Tue_Jan_10_13:22:03_CST_2017
Cuda compilation tools, release 8.0, V8.0.61
```

In previous attempts I had to register for an NVIDIA developer account and install these packages, but they seem to be packaged with the container.

Finally, we can check the installed python packages:

```terminal
root@80f65a971e9a:~# pip freeze | grep tensorflow
tensorflow-gpu==1.4.0
tensorflow-tensorboard==0.4.0rc2
root@80f65a971e9a:~#
```

This looks good, but I'm still not 100% sure that everything was done properly. I would like to learn more about Tensorflow and also play around with some examples using Tensorboard. Let me know if you have any questions or comments about this setup, I'm still learning! Thanks for reading.

Just for fun, here's a DeepDream rendering of a famous Donald Trump picture using Google's pre-trained [Inception model](https://github.com/google/inception):

![png](/static/trump.png)

For comparison, here is the original image:

![png](/static/trump_original.jpg)
