---
title: Installing Stable Diffusion on my 2016 Desktop Computer
date: '2023-01-08'
description: "Installing Stable Diffusion on my old PC as fast as possible"
# image: /static/iac_rosetta_stone_og_image.png
tags:
  - stable-diffusion
  - gpu
  - ai

draft: true

# external:
#   - link: https://news.ycombinator.com/item?id=34291336
#     site: hn
#   - link: https://www.reddit.com/r/aws/comments/105vo53/my_infrastructure_as_code_rosetta_stone_deploying/
#     site: reddit
#   - link: https://dev.to/briancaffey/my-infrastructure-as-code-rosetta-stone-deploying-the-same-web-application-on-aws-ecs-fargate-with-cdk-terraform-and-pulumi-oe4
#     site: dev
#   - link: https://medium.com/@briancaffey/my-infrastructure-as-code-rosetta-stone-with-cdk-terraform-and-pulumi-44fcb8233e6a
#     site: medium
#   - link: https://briancaffey.hashnode.dev/setting-up-ad-hoc-development-environments-for-django-applications-with-aws-ecs-terraform-and-github-actions
#     site: hashnode
#   - link: https://briancaffey.substack.com/p/my-infrastructure-as-code-rosetta
#     site: substack

comments: true
---

This article will be me trying to install Stable Diffusion on my computer as fast as possible. I built my desktop computer 5 years ago, and I want to see how well it can run stable diffusion.

## Computer Specs

### CPU

```
$ lscpu
Architecture:                    x86_64
CPU op-mode(s):                  32-bit, 64-bit
Byte Order:                      Little Endian
Address sizes:                   39 bits physical, 48 bits virtual
CPU(s):                          8
On-line CPU(s) list:             0-7
Thread(s) per core:              2
Core(s) per socket:              4
Socket(s):                       1
Vendor ID:                       GenuineIntel
CPU family:                      6
Model:                           94
Model name:                      Intel(R) Core(TM) i7-6700K CPU @ 4.00GHz
Stepping:                        3
CPU MHz:                         4008.000
BogoMIPS:                        8016.00
Hypervisor vendor:               Microsoft
Virtualization type:             full
L1d cache:                       128 KiB
L1i cache:                       128 KiB
L2 cache:                        1 MiB
L3 cache:                        8 MiB
```

### GPU

```
$ nvidia-smi -L
GPU 0: NVIDIA GeForce GTX 1080 (UUID: GPU-a4668849-8693-dced-f317-c7af17e8c6ee)
$ nvidia-smi
Sun Jan  8 22:11:06 2023
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 525.65       Driver Version: 527.37       CUDA Version: 12.0     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  NVIDIA GeForce ...  On   | 00000000:01:00.0  On |                  N/A |
| 28%   32C    P0    39W / 172W |   2319MiB /  8192MiB |      0%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
|  No running processes found                                                 |
+-----------------------------------------------------------------------------+
```

## Invoke AI

This looks like a good fork that serves as the basis for many commercial products. It has over 9K stars on GitHub and it includes a Web UI, as well as an automatic installation script.

[https://invoke-ai.github.io/InvokeAI/installation/](https://invoke-ai.github.io/InvokeAI/installation/)

### InvokeAI Automated Installation

> Introduction 
> 
> The automated installer is a shell script that attempts to automate every step needed to install and run InvokeAI on a stock computer running recent versions of Linux, MacOS or Windows. It will leave you with a version that runs a stable version of InvokeAI with the option to upgrade to experimental versions later.

### Hardware Requirements

### https://invoke-ai.github.io/InvokeAI/#hardware-requirements

> Installation requires roughly 18G of free disk space to load the libraries and recommended model weights files.
> 
> Regardless of your destination disk, your system drive (C:\ on Windows, / on macOS/Linux) requires at least 6GB of free disk space to download and cache python dependencies. NOTE for Linux users: if your temporary directory is mounted as a tmpfs, ensure it has sufficient space.

```
C:\Users\Brian>dir|find "bytes free"
              45 Dir(s)  23,610,232,832 bytes free (23GB)
```

```
C:\Users\Brian>dir d:|find "bytes free"
              17 Dir(s)  258,141,052,928 bytes free (258)
```

### Python version

```
C:\Users\Brian>python --version
Python 3.9.5
```

https://learn.microsoft.com/en-us/cpp/windows/deploying-native-desktop-applications-visual-cpp?view=msvc-170


```
This script will install InvokeAI and its dependencies.

BEFORE YOU START PLEASE MAKE SURE TO DO THE FOLLOWING
1. Install python 3.9 or higher.
2. Double-click on the file WinLongPathsEnabled.reg in order to
   enable long path support on your system.
3. Install the Visual C++ core libraries.
   Pleaase download and install the libraries from:
   https://learn.microsoft.com/en-US/cpp/windows/latest-supported-vc-redist?view=msvc-170

See https://invoke-ai.github.io/InvokeAI/installation/INSTALL_AUTOMATED/ for more details.

Press any key to continue . . .
***** Checking and Updating Python *****

Setting up requirements file for your system.
        1 file(s) copied.
Select the path to install InvokeAI's directory into [C:\Users\Brian]: D:\InvokeAI
You have chosen to install InvokeAI into "D:\InvokeAI\invokeai". OK? [Y/n]:

...

Collecting k-diffusion
  Downloading https://github.com/Birch-san/k-diffusion/archive/refs/heads/mps.zip (38 kB)
  Installing build dependencies ... done
  Getting requirements to build wheel ... done
  Installing backend dependencies ... done
    Preparing wheel metadata ... done
Collecting pypatchmatch
  Downloading https://github.com/invoke-ai/PyPatchMatch/archive/refs/tags/0.1.5.zip (19 kB)
Collecting clip
  Downloading https://github.com/openai/CLIP/archive/eaa22acb90a5876642d0507623e859909230a52d.zip (4.3 MB)
     |████████████████████████████████| 4.3 MB 6.8 MB/s
Collecting clipseg
  Downloading https://github.com/invoke-ai/clipseg/archive/relaxed-python-requirement.zip
     / 1.4 MB ...
Collecting albumentations
  Downloading albumentations-1.3.0-py3-none-any.whl (123 kB)
     |████████████████████████████████| 123 kB 2.2 MB/s
Collecting diffusers==0.10.*
  Downloading diffusers-0.10.2-py3-none-any.whl (503 kB)
     |████████████████████████████████| 503 kB ...
Collecting einops
  Downloading einops-0.6.0-py3-none-any.whl (41 kB)
     |████████████████████████████████| 41 kB ...
Collecting eventlet
  Downloading eventlet-0.33.2-py2.py3-none-any.whl (226 kB)
     |████████████████████████████████| 226 kB ...
Collecting facexlib
  Downloading facexlib-0.2.5-py3-none-any.whl (59 kB)
     |████████████████████████████████| 59 kB 3.4 MB/s
Collecting flask==2.1.3
  Downloading Flask-2.1.3-py3-none-any.whl (95 kB)
     |████████████████████████████████| 95 kB 6.4 MB/s
Collecting flask_cors==3.0.10
  Downloading Flask_Cors-3.0.10-py2.py3-none-any.whl (14 kB)
Collecting flask_socketio==5.3.0
  Downloading Flask_SocketIO-5.3.0-py3-none-any.whl (17 kB)
Collecting flaskwebgui==1.0.3
  Downloading flaskwebgui-1.0.3-py3-none-any.whl (6.7 kB)
Collecting getpass_asterisk
  Downloading getpass_asterisk-1.0.1-py3-none-any.whl (6.8 kB)
Collecting gfpgan==1.3.8
  Downloading gfpgan-1.3.8-py3-none-any.whl (52 kB)
     |████████████████████████████████| 52 kB ...
Collecting huggingface-hub
  Downloading huggingface_hub-0.11.1-py3-none-any.whl (182 kB)
     |████████████████████████████████| 182 kB 6.4 MB/s
Collecting imageio
  Downloading imageio-2.24.0-py3-none-any.whl (3.4 MB)
     |████████████████████████████████| 3.4 MB ...
Collecting imageio-ffmpeg
  Downloading imageio_ffmpeg-0.4.7-py3-none-win_amd64.whl (22.6 MB)
     |████████████████████████████████| 22.6 MB 6.4 MB/s
Collecting kornia
  Downloading kornia-0.6.9-py2.py3-none-any.whl (569 kB)
     |████████████████████████████████| 569 kB 6.4 MB/s
Collecting numpy==1.23.*
  Downloading numpy-1.23.5-cp39-cp39-win_amd64.whl (14.7 MB)
     |████████████████████████████████| 14.7 MB 6.4 MB/s
Collecting omegaconf
  Downloading omegaconf-2.3.0-py3-none-any.whl (79 kB)
     |████████████████████████████████| 79 kB 5.5 MB/s
Collecting opencv-python
  Downloading opencv_python-4.7.0.68-cp37-abi3-win_amd64.whl (38.2 MB)
     |████████████████████████████████| 38.2 MB 6.4 MB/s
Collecting picklescan
  Downloading picklescan-0.0.7-py3-none-any.whl (10 kB)
Collecting pillow
  Downloading Pillow-9.4.0-cp39-cp39-win_amd64.whl (2.5 MB)
     |████████████████████████████████| 2.5 MB ...
Collecting pip>=22
  Downloading pip-22.3.1-py3-none-any.whl (2.1 MB)
     |████████████████████████████████| 2.1 MB ...
Collecting pudb
  Downloading pudb-2014.1-py2.py3-none-any.whl (49 kB)
     |████████████████████████████████| 49 kB ...
Collecting pyreadline3
  Downloading pyreadline3-3.4.1-py3-none-any.whl (95 kB)
     |████████████████████████████████| 95 kB 6.4 MB/s
Collecting pytorch-lightning==1.7.7
  Downloading pytorch_lightning-1.7.7-py3-none-any.whl (708 kB)
     |████████████████████████████████| 708 kB 6.8 MB/s
Collecting realesrgan
  Downloading realesrgan-0.3.0-py3-none-any.whl (26 kB)
Collecting requests==2.25.1
  Downloading requests-2.25.1-py2.py3-none-any.whl (61 kB)
     |████████████████████████████████| 61 kB ...
Collecting scikit-image>=0.19
  Downloading scikit_image-0.19.3-cp39-cp39-win_amd64.whl (12.1 MB)
     |████████████████████████████████| 12.1 MB 6.4 MB/s
Collecting send2trash
  Downloading Send2Trash-1.8.0-py3-none-any.whl (18 kB)
Collecting streamlit
  Downloading streamlit-1.16.0-py2.py3-none-any.whl (9.2 MB)
     |████████████████████████████████| 9.2 MB ...
Collecting taming-transformers-rom1504
  Downloading taming_transformers_rom1504-0.0.6-py3-none-any.whl (51 kB)
     |████████████████████████████████| 51 kB 100 kB/s
Collecting test-tube>=0.7.5
  Downloading test_tube-0.7.5.tar.gz (21 kB)
Collecting torch-fidelity
  Downloading torch_fidelity-0.3.0-py3-none-any.whl (37 kB)
Collecting torchmetrics
  Downloading torchmetrics-0.11.0-py3-none-any.whl (512 kB)
     |████████████████████████████████| 512 kB 6.4 MB/s
Collecting transformers==4.25.*
  Downloading transformers-4.25.1-py3-none-any.whl (5.8 MB)
     |████████████████████████████████| 5.8 MB ...
Collecting torch==1.12.1
  Downloading https://download.pytorch.org/whl/cu116/torch-1.12.1%2Bcu116-cp39-cp39-win_amd64.whl (2388.0 MB)
     |█████████████████               | 1266.9 MB 6.8 MB/s eta 0:02:45
```


```
This script will install InvokeAI and its dependencies.

BEFORE YOU START PLEASE MAKE SURE TO DO THE FOLLOWING
1. Install python 3.9 or higher.
2. Double-click on the file WinLongPathsEnabled.reg in order to
   enable long path support on your system.
3. Install the Visual C++ core libraries.
   Pleaase download and install the libraries from:
   https://learn.microsoft.com/en-US/cpp/windows/latest-supported-vc-redist?view=msvc-170

See https://invoke-ai.github.io/InvokeAI/installation/INSTALL_AUTOMATED/ for more details.

Press any key to continue . . .
***** Checking and Updating Python *****

Setting up requirements file for your system.
        1 file(s) copied.
Select the path to install InvokeAI's directory into [C:\Users\Brian]: D:\InvokeAI
You have chosen to install InvokeAI into "D:\InvokeAI\invokeai". OK? [Y/n]:

*** Creating Runtime Directory D:\InvokeAI\invokeai ***
Successful.

** Creating Virtual Environment for InvokeAI **
Successful.

*** Installing InvokeAI Requirements ***
Activating environment
updating pip with "D:\InvokeAI\invokeai\.venv\Scripts\python"
Looking in links: c:\Users\Brian\AppData\Local\Temp\tmp6cex7v5c
Requirement already satisfied: setuptools in d:\invokeai\invokeai\.venv\lib\site-packages (56.0.0)
Requirement already satisfied: pip in d:\invokeai\invokeai\.venv\lib\site-packages (21.1.1)
adding trusted host: 'https://download.pytorch.org' (from line 3 of requirements.txt)
Looking in indexes: https://pypi.org/simple, https://download.pytorch.org/whl/cu116
Collecting k-diffusion
  Downloading https://github.com/Birch-san/k-diffusion/archive/refs/heads/mps.zip (38 kB)
  Installing build dependencies ... done
  Getting requirements to build wheel ... done
  Installing backend dependencies ... done
    Preparing wheel metadata ... done
Collecting pypatchmatch
  Downloading https://github.com/invoke-ai/PyPatchMatch/archive/refs/tags/0.1.5.zip (19 kB)
Collecting clip
  Downloading https://github.com/openai/CLIP/archive/eaa22acb90a5876642d0507623e859909230a52d.zip (4.3 MB)
     |████████████████████████████████| 4.3 MB 6.8 MB/s
Collecting clipseg
  Downloading https://github.com/invoke-ai/clipseg/archive/relaxed-python-requirement.zip
     / 1.4 MB ...
Collecting albumentations
  Downloading albumentations-1.3.0-py3-none-any.whl (123 kB)
     |████████████████████████████████| 123 kB 2.2 MB/s
Collecting diffusers==0.10.*
  Downloading diffusers-0.10.2-py3-none-any.whl (503 kB)
     |████████████████████████████████| 503 kB ...
Collecting einops
  Downloading einops-0.6.0-py3-none-any.whl (41 kB)
     |████████████████████████████████| 41 kB ...
Collecting eventlet
  Downloading eventlet-0.33.2-py2.py3-none-any.whl (226 kB)
     |████████████████████████████████| 226 kB ...
Collecting facexlib
  Downloading facexlib-0.2.5-py3-none-any.whl (59 kB)
     |████████████████████████████████| 59 kB 3.4 MB/s
Collecting flask==2.1.3
  Downloading Flask-2.1.3-py3-none-any.whl (95 kB)
     |████████████████████████████████| 95 kB 6.4 MB/s
Collecting flask_cors==3.0.10
  Downloading Flask_Cors-3.0.10-py2.py3-none-any.whl (14 kB)
Collecting flask_socketio==5.3.0
  Downloading Flask_SocketIO-5.3.0-py3-none-any.whl (17 kB)
Collecting flaskwebgui==1.0.3
  Downloading flaskwebgui-1.0.3-py3-none-any.whl (6.7 kB)
Collecting getpass_asterisk
  Downloading getpass_asterisk-1.0.1-py3-none-any.whl (6.8 kB)
Collecting gfpgan==1.3.8
  Downloading gfpgan-1.3.8-py3-none-any.whl (52 kB)
     |████████████████████████████████| 52 kB ...
Collecting huggingface-hub
  Downloading huggingface_hub-0.11.1-py3-none-any.whl (182 kB)
     |████████████████████████████████| 182 kB 6.4 MB/s
Collecting imageio
  Downloading imageio-2.24.0-py3-none-any.whl (3.4 MB)
     |████████████████████████████████| 3.4 MB ...
Collecting imageio-ffmpeg
  Downloading imageio_ffmpeg-0.4.7-py3-none-win_amd64.whl (22.6 MB)
     |████████████████████████████████| 22.6 MB 6.4 MB/s
Collecting kornia
  Downloading kornia-0.6.9-py2.py3-none-any.whl (569 kB)
     |████████████████████████████████| 569 kB 6.4 MB/s
Collecting numpy==1.23.*
  Downloading numpy-1.23.5-cp39-cp39-win_amd64.whl (14.7 MB)
     |████████████████████████████████| 14.7 MB 6.4 MB/s
Collecting omegaconf
  Downloading omegaconf-2.3.0-py3-none-any.whl (79 kB)
     |████████████████████████████████| 79 kB 5.5 MB/s
Collecting opencv-python
  Downloading opencv_python-4.7.0.68-cp37-abi3-win_amd64.whl (38.2 MB)
     |████████████████████████████████| 38.2 MB 6.4 MB/s
Collecting picklescan
  Downloading picklescan-0.0.7-py3-none-any.whl (10 kB)
Collecting pillow
  Downloading Pillow-9.4.0-cp39-cp39-win_amd64.whl (2.5 MB)
     |████████████████████████████████| 2.5 MB ...
Collecting pip>=22
  Downloading pip-22.3.1-py3-none-any.whl (2.1 MB)
     |████████████████████████████████| 2.1 MB ...
Collecting pudb
  Downloading pudb-2014.1-py2.py3-none-any.whl (49 kB)
     |████████████████████████████████| 49 kB ...
Collecting pyreadline3
  Downloading pyreadline3-3.4.1-py3-none-any.whl (95 kB)
     |████████████████████████████████| 95 kB 6.4 MB/s
Collecting pytorch-lightning==1.7.7
  Downloading pytorch_lightning-1.7.7-py3-none-any.whl (708 kB)
     |████████████████████████████████| 708 kB 6.8 MB/s
Collecting realesrgan
  Downloading realesrgan-0.3.0-py3-none-any.whl (26 kB)
Collecting requests==2.25.1
  Downloading requests-2.25.1-py2.py3-none-any.whl (61 kB)
     |████████████████████████████████| 61 kB ...
Collecting scikit-image>=0.19
  Downloading scikit_image-0.19.3-cp39-cp39-win_amd64.whl (12.1 MB)
     |████████████████████████████████| 12.1 MB 6.4 MB/s
Collecting send2trash
  Downloading Send2Trash-1.8.0-py3-none-any.whl (18 kB)
Collecting streamlit
  Downloading streamlit-1.16.0-py2.py3-none-any.whl (9.2 MB)
     |████████████████████████████████| 9.2 MB ...
Collecting taming-transformers-rom1504
  Downloading taming_transformers_rom1504-0.0.6-py3-none-any.whl (51 kB)
     |████████████████████████████████| 51 kB 100 kB/s
Collecting test-tube>=0.7.5
  Downloading test_tube-0.7.5.tar.gz (21 kB)
Collecting torch-fidelity
  Downloading torch_fidelity-0.3.0-py3-none-any.whl (37 kB)
Collecting torchmetrics
  Downloading torchmetrics-0.11.0-py3-none-any.whl (512 kB)
     |████████████████████████████████| 512 kB 6.4 MB/s
Collecting transformers==4.25.*
  Downloading transformers-4.25.1-py3-none-any.whl (5.8 MB)
     |████████████████████████████████| 5.8 MB ...
Collecting torch==1.12.1
  Downloading https://download.pytorch.org/whl/cu116/torch-1.12.1%2Bcu116-cp39-cp39-win_amd64.whl (2388.0 MB)
     |████████████████████████████████| 2388.0 MB 2.4 kB/s
Collecting torchvision==0.13.1
  Downloading https://download.pytorch.org/whl/cu116/torchvision-0.13.1%2Bcu116-cp39-cp39-win_amd64.whl (2.6 MB)
     |████████████████████████████████| 2.6 MB ...
Collecting tqdm
  Downloading tqdm-4.64.1-py2.py3-none-any.whl (78 kB)
     |████████████████████████████████| 78 kB 5.1 MB/s
Collecting accelerate
  Downloading accelerate-0.15.0-py3-none-any.whl (191 kB)
     |████████████████████████████████| 191 kB ...
Collecting scipy
  Downloading scipy-1.10.0-cp39-cp39-win_amd64.whl (42.5 MB)
     |████████████████████████████████| 42.5 MB 109 kB/s
Collecting torchsde
  Downloading torchsde-0.2.5-py3-none-any.whl (59 kB)
     |████████████████████████████████| 59 kB 3.0 MB/s
Collecting torchdiffeq
  Downloading torchdiffeq-0.2.3-py3-none-any.whl (31 kB)
Collecting jsonmerge
  Downloading jsonmerge-1.9.0.tar.gz (32 kB)
Collecting clean-fid
  Downloading clean_fid-0.1.35-py3-none-any.whl (26 kB)
Collecting resize-right
  Downloading resize_right-0.0.2-py3-none-any.whl (8.9 kB)
Collecting wandb
  Downloading wandb-0.13.7-py2.py3-none-any.whl (1.9 MB)
     |████████████████████████████████| 1.9 MB 6.4 MB/s
Collecting ftfy
  Downloading ftfy-6.1.1-py3-none-any.whl (53 kB)
     |████████████████████████████████| 53 kB 711 kB/s
Collecting regex
  Downloading regex-2022.10.31-cp39-cp39-win_amd64.whl (267 kB)
     |████████████████████████████████| 267 kB ...
Collecting matplotlib
  Downloading matplotlib-3.6.2-cp39-cp39-win_amd64.whl (7.2 MB)
     |████████████████████████████████| 7.2 MB ...
Collecting filelock
  Downloading filelock-3.9.0-py3-none-any.whl (9.7 kB)
Collecting importlib-metadata
  Downloading importlib_metadata-6.0.0-py3-none-any.whl (21 kB)
Collecting itsdangerous>=2.0
  Downloading itsdangerous-2.1.2-py3-none-any.whl (15 kB)
Collecting Jinja2>=3.0
  Downloading Jinja2-3.1.2-py3-none-any.whl (133 kB)
     |████████████████████████████████| 133 kB 6.4 MB/s
Collecting Werkzeug>=2.0
  Downloading Werkzeug-2.2.2-py3-none-any.whl (232 kB)
     |████████████████████████████████| 232 kB 6.4 MB/s
Collecting click>=8.0
  Downloading click-8.1.3-py3-none-any.whl (96 kB)
     |████████████████████████████████| 96 kB 2.8 MB/s
Collecting Six
  Using cached six-1.16.0-py2.py3-none-any.whl (11 kB)
Collecting python-socketio>=5.0.2
  Downloading python_socketio-5.7.2-py3-none-any.whl (56 kB)
     |████████████████████████████████| 56 kB 2.1 MB/s
Collecting psutil==5.9.4
  Downloading psutil-5.9.4-cp36-abi3-win_amd64.whl (252 kB)
     |████████████████████████████████| 252 kB ...
Collecting lmdb
  Downloading lmdb-1.4.0-cp39-cp39-win_amd64.whl (105 kB)
     |████████████████████████████████| 105 kB ...
Collecting pyyaml
  Downloading PyYAML-6.0-cp39-cp39-win_amd64.whl (151 kB)
     |████████████████████████████████| 151 kB ...
Collecting basicsr>=1.4.2
  Downloading basicsr-1.4.2.tar.gz (172 kB)
     |████████████████████████████████| 172 kB 6.8 MB/s
Collecting yapf
  Downloading yapf-0.32.0-py2.py3-none-any.whl (190 kB)
     |████████████████████████████████| 190 kB 6.4 MB/s
Collecting tb-nightly
  Downloading tb_nightly-2.12.0a20230107-py3-none-any.whl (5.7 MB)
     |████████████████████████████████| 5.7 MB ...
Collecting pyDeprecate>=0.3.1
  Downloading pyDeprecate-0.3.2-py3-none-any.whl (10 kB)
Collecting typing-extensions>=4.0.0
  Using cached typing_extensions-4.4.0-py3-none-any.whl (26 kB)
Collecting tensorboard>=2.9.1
  Downloading tensorboard-2.11.0-py3-none-any.whl (6.0 MB)
     |████████████████████████████████| 6.0 MB 6.4 MB/s
Collecting fsspec[http]!=2021.06.0,>=2021.05.0
  Downloading fsspec-2022.11.0-py3-none-any.whl (139 kB)
     |████████████████████████████████| 139 kB ...
Collecting packaging>=17.0
  Downloading packaging-23.0-py3-none-any.whl (42 kB)
     |████████████████████████████████| 42 kB 572 kB/s
Collecting certifi>=2017.4.17
  Downloading certifi-2022.12.7-py3-none-any.whl (155 kB)
     |████████████████████████████████| 155 kB 6.8 MB/s
Collecting chardet<5,>=3.0.2
  Downloading chardet-4.0.0-py2.py3-none-any.whl (178 kB)
     |████████████████████████████████| 178 kB 6.4 MB/s
Collecting urllib3<1.27,>=1.21.1
  Downloading urllib3-1.26.13-py2.py3-none-any.whl (140 kB)
     |████████████████████████████████| 140 kB 6.8 MB/s
Collecting idna<3,>=2.5
  Downloading idna-2.10-py2.py3-none-any.whl (58 kB)
     |████████████████████████████████| 58 kB 2.9 MB/s
Collecting tokenizers!=0.11.3,<0.14,>=0.11.1
  Downloading tokenizers-0.13.2-cp39-cp39-win_amd64.whl (3.3 MB)
     |████████████████████████████████| 3.3 MB 6.4 MB/s
Collecting filterpy
  Downloading filterpy-1.4.5.zip (177 kB)
     |████████████████████████████████| 177 kB ...
Collecting numba
  Downloading numba-0.56.4-cp39-cp39-win_amd64.whl (2.5 MB)
     |████████████████████████████████| 2.5 MB 6.4 MB/s
Collecting tifffile>=2019.7.26
  Downloading tifffile-2022.10.10-py3-none-any.whl (210 kB)
     |████████████████████████████████| 210 kB ...
Collecting PyWavelets>=1.1.1
  Downloading PyWavelets-1.4.1-cp39-cp39-win_amd64.whl (4.2 MB)
     |████████████████████████████████| 4.2 MB ...
Collecting networkx>=2.2
  Downloading networkx-3.0-py3-none-any.whl (2.0 MB)
     |████████████████████████████████| 2.0 MB 6.8 MB/s
Collecting pandas>=0.20.3
  Downloading pandas-1.5.2-cp39-cp39-win_amd64.whl (10.9 MB)
     |████████████████████████████████| 10.9 MB 6.4 MB/s
Collecting future
  Downloading future-0.18.2.tar.gz (829 kB)
     |████████████████████████████████| 829 kB ...
Collecting addict
  Downloading addict-2.4.0-py3-none-any.whl (3.8 kB)
Collecting colorama
  Downloading colorama-0.4.6-py2.py3-none-any.whl (25 kB)
Collecting aiohttp!=4.0.0a0,!=4.0.0a1
  Downloading aiohttp-3.8.3-cp39-cp39-win_amd64.whl (323 kB)
     |████████████████████████████████| 323 kB ...
Collecting multidict<7.0,>=4.5
  Downloading multidict-6.0.4-cp39-cp39-win_amd64.whl (28 kB)
Collecting frozenlist>=1.1.1
  Downloading frozenlist-1.3.3-cp39-cp39-win_amd64.whl (34 kB)
Collecting attrs>=17.3.0
  Downloading attrs-22.2.0-py3-none-any.whl (60 kB)
     |████████████████████████████████| 60 kB 3.5 MB/s
Collecting charset-normalizer<3.0,>=2.0
  Downloading charset_normalizer-2.1.1-py3-none-any.whl (39 kB)
Collecting yarl<2.0,>=1.0
  Downloading yarl-1.8.2-cp39-cp39-win_amd64.whl (56 kB)
     |████████████████████████████████| 56 kB 3.8 MB/s
Collecting async-timeout<5.0,>=4.0.0a3
  Downloading async_timeout-4.0.2-py3-none-any.whl (5.8 kB)
Collecting aiosignal>=1.1.2
  Downloading aiosignal-1.3.1-py3-none-any.whl (7.6 kB)
Collecting zipp>=0.5
  Downloading zipp-3.11.0-py3-none-any.whl (6.6 kB)
Collecting MarkupSafe>=2.0
  Downloading MarkupSafe-2.1.1-cp39-cp39-win_amd64.whl (17 kB)
Collecting python-dateutil>=2.8.1
  Using cached python_dateutil-2.8.2-py2.py3-none-any.whl (247 kB)
Collecting pytz>=2020.1
  Downloading pytz-2022.7-py2.py3-none-any.whl (499 kB)
     |████████████████████████████████| 499 kB ...
Collecting python-engineio>=4.3.0
  Downloading python_engineio-4.3.4-py3-none-any.whl (52 kB)
     |████████████████████████████████| 52 kB 619 kB/s
Collecting bidict>=0.21.0
  Downloading bidict-0.22.1-py3-none-any.whl (35 kB)
Collecting google-auth-oauthlib<0.5,>=0.4.1
  Downloading google_auth_oauthlib-0.4.6-py2.py3-none-any.whl (18 kB)
Collecting markdown>=2.6.8
  Downloading Markdown-3.4.1-py3-none-any.whl (93 kB)
     |████████████████████████████████| 93 kB 756 kB/s
Collecting google-auth<3,>=1.6.3
  Downloading google_auth-2.15.0-py2.py3-none-any.whl (177 kB)
     |████████████████████████████████| 177 kB ...
Collecting wheel>=0.26
  Using cached wheel-0.38.4-py3-none-any.whl (36 kB)
Collecting tensorboard-data-server<0.7.0,>=0.6.0
  Downloading tensorboard_data_server-0.6.1-py3-none-any.whl (2.4 kB)
Collecting protobuf<4,>=3.9.2
  Downloading protobuf-3.20.3-cp39-cp39-win_amd64.whl (904 kB)
     |████████████████████████████████| 904 kB 6.4 MB/s
Collecting absl-py>=0.4
  Downloading absl_py-1.3.0-py3-none-any.whl (124 kB)
     |████████████████████████████████| 124 kB ...
Collecting tensorboard-plugin-wit>=1.6.0
  Downloading tensorboard_plugin_wit-1.8.1-py3-none-any.whl (781 kB)
     |████████████████████████████████| 781 kB 6.4 MB/s
Requirement already satisfied: setuptools>=41.0.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from tensorboard>=2.9.1->pytorch-lightning==1.7.7->-r environments-and-requirements/requirements-base.txt (line 25)) (56.0.0)
Collecting grpcio>=1.24.3
  Downloading grpcio-1.51.1-cp39-cp39-win_amd64.whl (3.7 MB)
     |████████████████████████████████| 3.7 MB 6.8 MB/s
Collecting pyasn1-modules>=0.2.1
  Downloading pyasn1_modules-0.2.8-py2.py3-none-any.whl (155 kB)
     |████████████████████████████████| 155 kB ...
Collecting cachetools<6.0,>=2.0.0
  Downloading cachetools-5.2.1-py3-none-any.whl (9.3 kB)
Collecting rsa<5,>=3.1.4
  Downloading rsa-4.9-py3-none-any.whl (34 kB)
Collecting requests-oauthlib>=0.7.0
  Downloading requests_oauthlib-1.3.1-py2.py3-none-any.whl (23 kB)
Collecting pyasn1<0.5.0,>=0.4.6
  Downloading pyasn1-0.4.8-py2.py3-none-any.whl (77 kB)
     |████████████████████████████████| 77 kB 2.7 MB/s
Collecting oauthlib>=3.0.0
  Downloading oauthlib-3.2.2-py3-none-any.whl (151 kB)
     |████████████████████████████████| 151 kB 6.8 MB/s
Collecting opencv-python-headless>=4.1.1
  Downloading opencv_python_headless-4.7.0.68-cp37-abi3-win_amd64.whl (38.1 MB)
     |████████████████████████████████| 38.1 MB 35 kB/s
Collecting qudida>=0.0.4
  Downloading qudida-0.0.4-py3-none-any.whl (3.5 kB)
Collecting scikit-learn>=0.19.1
  Downloading scikit_learn-1.2.0-cp39-cp39-win_amd64.whl (8.3 MB)
     |████████████████████████████████| 8.3 MB 6.4 MB/s
Collecting joblib>=1.1.1
  Downloading joblib-1.2.0-py3-none-any.whl (297 kB)
     |████████████████████████████████| 297 kB ...
Collecting threadpoolctl>=2.0.0
  Downloading threadpoolctl-3.1.0-py3-none-any.whl (14 kB)
Collecting greenlet>=0.3
  Downloading greenlet-2.0.1-cp39-cp39-win_amd64.whl (190 kB)
     |████████████████████████████████| 190 kB ...
Collecting dnspython>=1.15.0
  Downloading dnspython-2.2.1-py3-none-any.whl (269 kB)
     |████████████████████████████████| 269 kB 6.8 MB/s
Collecting antlr4-python3-runtime==4.9.*
  Downloading antlr4-python3-runtime-4.9.3.tar.gz (117 kB)
     |████████████████████████████████| 117 kB 6.4 MB/s
Collecting pygments>=1.0
  Downloading Pygments-2.14.0-py3-none-any.whl (1.1 MB)
     |████████████████████████████████| 1.1 MB 6.8 MB/s
Collecting urwid>=1.1.1
  Downloading urwid-2.1.2.tar.gz (634 kB)
     |████████████████████████████████| 634 kB ...
Collecting gitpython!=3.1.19
  Downloading GitPython-3.1.30-py3-none-any.whl (184 kB)
     |████████████████████████████████| 184 kB ...
Collecting pydeck>=0.1.dev5
  Downloading pydeck-0.8.0-py2.py3-none-any.whl (4.7 MB)
     |████████████████████████████████| 4.7 MB 6.8 MB/s
Collecting blinker>=1.0.0
  Downloading blinker-1.5-py2.py3-none-any.whl (12 kB)
Collecting altair>=3.2.0
  Downloading altair-4.2.0-py3-none-any.whl (812 kB)
     |████████████████████████████████| 812 kB 6.8 MB/s
Collecting semver
  Downloading semver-2.13.0-py2.py3-none-any.whl (12 kB)
Collecting tornado>=5.0
  Downloading tornado-6.2-cp37-abi3-win_amd64.whl (425 kB)
     |████████████████████████████████| 425 kB 6.8 MB/s
Collecting pyarrow>=4.0
  Downloading pyarrow-10.0.1-cp39-cp39-win_amd64.whl (20.3 MB)
     |████████████████████████████████| 20.3 MB 113 kB/s
Collecting toml
  Using cached toml-0.10.2-py2.py3-none-any.whl (16 kB)
Collecting rich>=10.11.0
  Downloading rich-13.0.1-py3-none-any.whl (238 kB)
     |████████████████████████████████| 238 kB 6.8 MB/s
Collecting pympler>=0.9
  Downloading Pympler-1.0.1-py3-none-any.whl (164 kB)
     |████████████████████████████████| 164 kB ...
Collecting tzlocal>=1.1
  Downloading tzlocal-4.2-py3-none-any.whl (19 kB)
Collecting watchdog
  Downloading watchdog-2.2.1-py3-none-win_amd64.whl (78 kB)
     |████████████████████████████████| 78 kB 3.6 MB/s
Collecting validators>=0.2
  Downloading validators-0.18.2-py3-none-any.whl (19 kB)
Collecting jsonschema>=3.0
  Downloading jsonschema-4.17.3-py3-none-any.whl (90 kB)
     |████████████████████████████████| 90 kB 622 kB/s
Collecting toolz
  Downloading toolz-0.12.0-py3-none-any.whl (55 kB)
     |████████████████████████████████| 55 kB 4.1 MB/s
Collecting entrypoints
  Downloading entrypoints-0.4-py3-none-any.whl (5.3 kB)
Collecting gitdb<5,>=4.0.1
  Downloading gitdb-4.0.10-py3-none-any.whl (62 kB)
     |████████████████████████████████| 62 kB 604 kB/s
Collecting smmap<6,>=3.0.1
  Downloading smmap-5.0.0-py3-none-any.whl (24 kB)
Collecting pyrsistent!=0.17.0,!=0.17.1,!=0.17.2,>=0.14.0
  Downloading pyrsistent-0.19.3-cp39-cp39-win_amd64.whl (62 kB)
     |████████████████████████████████| 62 kB 555 kB/s
Collecting commonmark<0.10.0,>=0.9.0
  Downloading commonmark-0.9.1-py2.py3-none-any.whl (51 kB)
     |████████████████████████████████| 51 kB 3.2 MB/s
Collecting tzdata
  Downloading tzdata-2022.7-py2.py3-none-any.whl (340 kB)
     |████████████████████████████████| 340 kB 6.4 MB/s
Collecting pytz-deprecation-shim
  Downloading pytz_deprecation_shim-0.1.0.post0-py2.py3-none-any.whl (15 kB)
Collecting decorator>=3.4.0
  Downloading decorator-5.1.1-py3-none-any.whl (9.1 kB)
Collecting wcwidth>=0.2.5
  Using cached wcwidth-0.2.5-py2.py3-none-any.whl (30 kB)
Collecting contourpy>=1.0.1
  Downloading contourpy-1.0.6-cp39-cp39-win_amd64.whl (161 kB)
     |████████████████████████████████| 161 kB ...
Collecting kiwisolver>=1.0.1
  Downloading kiwisolver-1.4.4-cp39-cp39-win_amd64.whl (55 kB)
     |████████████████████████████████| 55 kB ...
Collecting pyparsing>=2.2.1
  Downloading pyparsing-3.0.9-py3-none-any.whl (98 kB)
     |████████████████████████████████| 98 kB 6.4 MB/s
Collecting fonttools>=4.22.0
  Downloading fonttools-4.38.0-py3-none-any.whl (965 kB)
     |████████████████████████████████| 965 kB 6.4 MB/s
Collecting cycler>=0.10
  Downloading cycler-0.11.0-py3-none-any.whl (6.4 kB)
Collecting llvmlite<0.40,>=0.39.0dev0
  Downloading llvmlite-0.39.1-cp39-cp39-win_amd64.whl (23.2 MB)
     |████████████████████████████████| 23.2 MB 6.4 MB/s
Collecting trampoline>=0.1.2
  Downloading trampoline-0.1.2-py3-none-any.whl (5.2 kB)
Collecting boltons>=20.2.1
  Downloading boltons-21.0.0-py2.py3-none-any.whl (193 kB)
     |████████████████████████████████| 193 kB 6.4 MB/s
Collecting setproctitle
  Downloading setproctitle-1.3.2-cp39-cp39-win_amd64.whl (11 kB)
Collecting pathtools
  Downloading pathtools-0.1.2.tar.gz (11 kB)
Collecting promise<3,>=2.0
  Using cached promise-2.3.tar.gz (19 kB)
Collecting sentry-sdk>=1.0.0
  Downloading sentry_sdk-1.12.1-py2.py3-none-any.whl (174 kB)
     |████████████████████████████████| 174 kB 6.4 MB/s
Collecting shortuuid>=0.5.0
  Downloading shortuuid-1.0.11-py3-none-any.whl (10 kB)
Collecting docker-pycreds>=0.4.0
  Downloading docker_pycreds-0.4.0-py2.py3-none-any.whl (9.0 kB)
Using legacy 'setup.py install' for pypatchmatch, since package 'wheel' is not installed.
Using legacy 'setup.py install' for clip, since package 'wheel' is not installed.
Using legacy 'setup.py install' for clipseg, since package 'wheel' is not installed.
Using legacy 'setup.py install' for test-tube, since package 'wheel' is not installed.
Using legacy 'setup.py install' for basicsr, since package 'wheel' is not installed.
Using legacy 'setup.py install' for antlr4-python3-runtime, since package 'wheel' is not installed.
Using legacy 'setup.py install' for urwid, since package 'wheel' is not installed.
Using legacy 'setup.py install' for filterpy, since package 'wheel' is not installed.
Using legacy 'setup.py install' for future, since package 'wheel' is not installed.
Using legacy 'setup.py install' for jsonmerge, since package 'wheel' is not installed.
Using legacy 'setup.py install' for promise, since package 'wheel' is not installed.
Using legacy 'setup.py install' for pathtools, since package 'wheel' is not installed.
Building wheels for collected packages: k-diffusion
  Building wheel for k-diffusion (PEP 517) ... done
  Created wheel for k-diffusion: filename=k_diffusion-0.0.1-py3-none-any.whl size=25377 sha256=3793194d98e3e161949f0a4d010043c36a9bfabed3435361a1c2f758acb2713c
  Stored in directory: C:\Users\Brian\AppData\Local\Temp\pip-ephem-wheel-cache-te96pj6l\wheels\1b\0c\29\c19405029546be30cef46f8304dfd3b14d8858d59dfdb9f96e
Successfully built k-diffusion
Installing collected packages: urllib3, pyasn1, idna, chardet, certifi, zipp, Six, rsa, requests, pyasn1-modules, oauthlib, numpy, cachetools, typing-extensions, requests-oauthlib, python-dateutil, pyparsing, pillow, packaging, multidict, MarkupSafe, kiwisolver, importlib-metadata, google-auth, frozenlist, fonttools, cycler, contourpy, yarl, wheel, Werkzeug, torch, tifffile, tensorboard-plugin-wit, tensorboard-data-server, smmap, scipy, PyWavelets, protobuf, networkx, matplotlib, markdown, llvmlite, imageio, grpcio, google-auth-oauthlib, colorama, charset-normalizer, attrs, async-timeout, aiosignal, absl-py, yapf, wcwidth, tzdata, tqdm, torchvision, threadpoolctl, tb-nightly, scikit-image, pyyaml, pytz, pyrsistent, opencv-python, numba, lmdb, joblib, gitdb, future, fsspec, filterpy, aiohttp, addict, trampoline, torchmetrics, toolz, tensorboard, shortuuid, setproctitle, sentry-sdk, scikit-learn, regex, pytz-deprecation-shim, python-engineio, pygments, pyDeprecate, psutil, promise, pathtools, pandas, opencv-python-headless, jsonschema, Jinja2, itsdangerous, gitpython, ftfy, filelock, facexlib, entrypoints, docker-pycreds, decorator, commonmark, click, boltons, bidict, basicsr, antlr4-python3-runtime, watchdog, wandb, validators, urwid, tzlocal, tornado, torchsde, torchdiffeq, toml, tokenizers, semver, rich, resize-right, qudida, pytorch-lightning, python-socketio, pympler, pydeck, pyarrow, omegaconf, kornia, jsonmerge, huggingface-hub, greenlet, gfpgan, flask, einops, dnspython, clip, clean-fid, blinker, altair, accelerate, transformers, torch-fidelity, test-tube, taming-transformers-rom1504, streamlit, send2trash, realesrgan, pyreadline3, pypatchmatch, pudb, pip, picklescan, k-diffusion, imageio-ffmpeg, getpass-asterisk, flaskwebgui, flask-socketio, flask-cors, eventlet, diffusers, clipseg, albumentations
    Running setup.py install for future ... done
    Running setup.py install for filterpy ... done
    Running setup.py install for promise ... done
    Running setup.py install for pathtools ... done
    Running setup.py install for basicsr ... done
    Running setup.py install for antlr4-python3-runtime ... done
    Running setup.py install for urwid ... done
    Running setup.py install for jsonmerge ... done
    Running setup.py install for clip ... done
    Running setup.py install for test-tube ... done
    Running setup.py install for pypatchmatch ... done
  Attempting uninstall: pip
    Found existing installation: pip 21.1.1
    Uninstalling pip-21.1.1:
      Successfully uninstalled pip-21.1.1
    Running setup.py install for clipseg ... done
Successfully installed Jinja2-3.1.2 MarkupSafe-2.1.1 PyWavelets-1.4.1 Six-1.16.0 Werkzeug-2.2.2 absl-py-1.3.0 accelerate-0.15.0 addict-2.4.0 aiohttp-3.8.3 aiosignal-1.3.1 albumentations-1.3.0 altair-4.2.0 antlr4-python3-runtime-4.9.3 async-timeout-4.0.2 attrs-22.2.0 basicsr-1.4.2 bidict-0.22.1 blinker-1.5 boltons-21.0.0 cachetools-5.2.1 certifi-2022.12.7 chardet-4.0.0 charset-normalizer-2.1.1 clean-fid-0.1.35 click-8.1.3 clip-1.0 clipseg-0.0.1 colorama-0.4.6 commonmark-0.9.1 contourpy-1.0.6 cycler-0.11.0 decorator-5.1.1 diffusers-0.10.2 dnspython-2.2.1 docker-pycreds-0.4.0 einops-0.6.0 entrypoints-0.4 eventlet-0.33.2 facexlib-0.2.5 filelock-3.9.0 filterpy-1.4.5 flask-2.1.3 flask-cors-3.0.10 flask-socketio-5.3.0 flaskwebgui-1.0.3 fonttools-4.38.0 frozenlist-1.3.3 fsspec-2022.11.0 ftfy-6.1.1 future-0.18.2 getpass-asterisk-1.0.1 gfpgan-1.3.8 gitdb-4.0.10 gitpython-3.1.30 google-auth-2.15.0 google-auth-oauthlib-0.4.6 greenlet-2.0.1 grpcio-1.51.1 huggingface-hub-0.11.1 idna-2.10 imageio-2.24.0 imageio-ffmpeg-0.4.7 importlib-metadata-6.0.0 itsdangerous-2.1.2 joblib-1.2.0 jsonmerge-1.9.0 jsonschema-4.17.3 k-diffusion-0.0.1 kiwisolver-1.4.4 kornia-0.6.9 llvmlite-0.39.1 lmdb-1.4.0 markdown-3.4.1 matplotlib-3.6.2 multidict-6.0.4 networkx-3.0 numba-0.56.4 numpy-1.23.5 oauthlib-3.2.2 omegaconf-2.3.0 opencv-python-4.7.0.68 opencv-python-headless-4.7.0.68 packaging-23.0 pandas-1.5.2 pathtools-0.1.2 picklescan-0.0.7 pillow-9.4.0 pip-22.3.1 promise-2.3 protobuf-3.20.3 psutil-5.9.4 pudb-2014.1 pyDeprecate-0.3.2 pyarrow-10.0.1 pyasn1-0.4.8 pyasn1-modules-0.2.8 pydeck-0.8.0 pygments-2.14.0 pympler-1.0.1 pyparsing-3.0.9 pypatchmatch-0.1.4 pyreadline3-3.4.1 pyrsistent-0.19.3 python-dateutil-2.8.2 python-engineio-4.3.4 python-socketio-5.7.2 pytorch-lightning-1.7.7 pytz-2022.7 pytz-deprecation-shim-0.1.0.post0 pyyaml-6.0 qudida-0.0.4 realesrgan-0.3.0 regex-2022.10.31 requests-2.25.1 requests-oauthlib-1.3.1 resize-right-0.0.2 rich-13.0.1 rsa-4.9 scikit-image-0.19.3 scikit-learn-1.2.0 scipy-1.10.0 semver-2.13.0 send2trash-1.8.0 sentry-sdk-1.12.1 setproctitle-1.3.2 shortuuid-1.0.11 smmap-5.0.0 streamlit-1.16.0 taming-transformers-rom1504-0.0.6 tb-nightly-2.12.0a20230107 tensorboard-2.11.0 tensorboard-data-server-0.6.1 tensorboard-plugin-wit-1.8.1 test-tube-0.7.5 threadpoolctl-3.1.0 tifffile-2022.10.10 tokenizers-0.13.2 toml-0.10.2 toolz-0.12.0 torch-1.12.1+cu116 torch-fidelity-0.3.0 torchdiffeq-0.2.3 torchmetrics-0.11.0 torchsde-0.2.5 torchvision-0.13.1+cu116 tornado-6.2 tqdm-4.64.1 trampoline-0.1.2 transformers-4.25.1 typing-extensions-4.4.0 tzdata-2022.7 tzlocal-4.2 urllib3-1.26.13 urwid-2.1.2 validators-0.18.2 wandb-0.13.7 watchdog-2.2.1 wcwidth-0.2.5 wheel-0.38.4 yapf-0.32.0 yarl-1.8.2 zipp-3.11.0
Installation successful.

*** Installing InvokeAI Modules and Executables ***
Collecting https://github.com/invoke-ai/InvokeAI/archive/refs/tags/v2.2.5.zip
  Downloading https://github.com/invoke-ai/InvokeAI/archive/refs/tags/v2.2.5.zip
     \ 89.3 MB 9.2 MB/s 0:00:10
  Preparing metadata (setup.py) ... done
Requirement already satisfied: accelerate in d:\invokeai\invokeai\.venv\lib\site-packages (from InvokeAI==2.2.5) (0.15.0)
Requirement already satisfied: albumentations in d:\invokeai\invokeai\.venv\lib\site-packages (from InvokeAI==2.2.5) (1.3.0)
Requirement already satisfied: diffusers in d:\invokeai\invokeai\.venv\lib\site-packages (from InvokeAI==2.2.5) (0.10.2)
Requirement already satisfied: eventlet in d:\invokeai\invokeai\.venv\lib\site-packages (from InvokeAI==2.2.5) (0.33.2)
Requirement already satisfied: flask_cors in d:\invokeai\invokeai\.venv\lib\site-packages (from InvokeAI==2.2.5) (3.0.10)
Requirement already satisfied: flask_socketio in d:\invokeai\invokeai\.venv\lib\site-packages (from InvokeAI==2.2.5) (5.3.0)
Requirement already satisfied: flaskwebgui in d:\invokeai\invokeai\.venv\lib\site-packages (from InvokeAI==2.2.5) (1.0.3)
Requirement already satisfied: getpass_asterisk in d:\invokeai\invokeai\.venv\lib\site-packages (from InvokeAI==2.2.5) (1.0.1)
Requirement already satisfied: imageio-ffmpeg in d:\invokeai\invokeai\.venv\lib\site-packages (from InvokeAI==2.2.5) (0.4.7)
Requirement already satisfied: pyreadline3 in d:\invokeai\invokeai\.venv\lib\site-packages (from InvokeAI==2.2.5) (3.4.1)
Requirement already satisfied: realesrgan in d:\invokeai\invokeai\.venv\lib\site-packages (from InvokeAI==2.2.5) (0.3.0)
Requirement already satisfied: send2trash in d:\invokeai\invokeai\.venv\lib\site-packages (from InvokeAI==2.2.5) (1.8.0)
Requirement already satisfied: streamlit in d:\invokeai\invokeai\.venv\lib\site-packages (from InvokeAI==2.2.5) (1.16.0)
Requirement already satisfied: taming-transformers-rom1504 in d:\invokeai\invokeai\.venv\lib\site-packages (from InvokeAI==2.2.5) (0.0.6)
Requirement already satisfied: test-tube in d:\invokeai\invokeai\.venv\lib\site-packages (from InvokeAI==2.2.5) (0.7.5)
Requirement already satisfied: torch-fidelity in d:\invokeai\invokeai\.venv\lib\site-packages (from InvokeAI==2.2.5) (0.3.0)
Requirement already satisfied: torch in d:\invokeai\invokeai\.venv\lib\site-packages (from InvokeAI==2.2.5) (1.12.1+cu116)
Requirement already satisfied: torchvision in d:\invokeai\invokeai\.venv\lib\site-packages (from InvokeAI==2.2.5) (0.13.1+cu116)
Requirement already satisfied: transformers in d:\invokeai\invokeai\.venv\lib\site-packages (from InvokeAI==2.2.5) (4.25.1)
Requirement already satisfied: picklescan in d:\invokeai\invokeai\.venv\lib\site-packages (from InvokeAI==2.2.5) (0.0.7)
Requirement already satisfied: clip in d:\invokeai\invokeai\.venv\lib\site-packages (from InvokeAI==2.2.5) (1.0)
Requirement already satisfied: clipseg in d:\invokeai\invokeai\.venv\lib\site-packages (from InvokeAI==2.2.5) (0.0.1)
Requirement already satisfied: gfpgan in d:\invokeai\invokeai\.venv\lib\site-packages (from InvokeAI==2.2.5) (1.3.8)
Requirement already satisfied: k-diffusion in d:\invokeai\invokeai\.venv\lib\site-packages (from InvokeAI==2.2.5) (0.0.1)
Requirement already satisfied: pypatchmatch in d:\invokeai\invokeai\.venv\lib\site-packages (from InvokeAI==2.2.5) (0.1.4)
Requirement already satisfied: packaging>=20.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from accelerate->InvokeAI==2.2.5) (23.0)
Requirement already satisfied: psutil in d:\invokeai\invokeai\.venv\lib\site-packages (from accelerate->InvokeAI==2.2.5) (5.9.4)
Requirement already satisfied: pyyaml in d:\invokeai\invokeai\.venv\lib\site-packages (from accelerate->InvokeAI==2.2.5) (6.0)
Requirement already satisfied: numpy>=1.17 in d:\invokeai\invokeai\.venv\lib\site-packages (from accelerate->InvokeAI==2.2.5) (1.23.5)
Requirement already satisfied: typing-extensions in d:\invokeai\invokeai\.venv\lib\site-packages (from torch->InvokeAI==2.2.5) (4.4.0)
Requirement already satisfied: qudida>=0.0.4 in d:\invokeai\invokeai\.venv\lib\site-packages (from albumentations->InvokeAI==2.2.5) (0.0.4)
Requirement already satisfied: scikit-image>=0.16.1 in d:\invokeai\invokeai\.venv\lib\site-packages (from albumentations->InvokeAI==2.2.5) (0.19.3)
Requirement already satisfied: scipy in d:\invokeai\invokeai\.venv\lib\site-packages (from albumentations->InvokeAI==2.2.5) (1.10.0)
Requirement already satisfied: opencv-python-headless>=4.1.1 in d:\invokeai\invokeai\.venv\lib\site-packages (from albumentations->InvokeAI==2.2.5) (4.7.0.68)
Requirement already satisfied: ftfy in d:\invokeai\invokeai\.venv\lib\site-packages (from clip->InvokeAI==2.2.5) (6.1.1)
Requirement already satisfied: regex in d:\invokeai\invokeai\.venv\lib\site-packages (from clip->InvokeAI==2.2.5) (2022.10.31)
Requirement already satisfied: tqdm in d:\invokeai\invokeai\.venv\lib\site-packages (from clip->InvokeAI==2.2.5) (4.64.1)
Requirement already satisfied: matplotlib in d:\invokeai\invokeai\.venv\lib\site-packages (from clipseg->InvokeAI==2.2.5) (3.6.2)
Requirement already satisfied: opencv-python in d:\invokeai\invokeai\.venv\lib\site-packages (from clipseg->InvokeAI==2.2.5) (4.7.0.68)
Requirement already satisfied: importlib-metadata in d:\invokeai\invokeai\.venv\lib\site-packages (from diffusers->InvokeAI==2.2.5) (6.0.0)
Requirement already satisfied: Pillow in d:\invokeai\invokeai\.venv\lib\site-packages (from diffusers->InvokeAI==2.2.5) (9.4.0)
Requirement already satisfied: huggingface-hub>=0.10.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from diffusers->InvokeAI==2.2.5) (0.11.1)
Requirement already satisfied: filelock in d:\invokeai\invokeai\.venv\lib\site-packages (from diffusers->InvokeAI==2.2.5) (3.9.0)
Requirement already satisfied: requests in d:\invokeai\invokeai\.venv\lib\site-packages (from diffusers->InvokeAI==2.2.5) (2.25.1)
Requirement already satisfied: dnspython>=1.15.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from eventlet->InvokeAI==2.2.5) (2.2.1)
Requirement already satisfied: greenlet>=0.3 in d:\invokeai\invokeai\.venv\lib\site-packages (from eventlet->InvokeAI==2.2.5) (2.0.1)
Requirement already satisfied: six>=1.10.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from eventlet->InvokeAI==2.2.5) (1.16.0)
Requirement already satisfied: Flask>=0.9 in d:\invokeai\invokeai\.venv\lib\site-packages (from flask_cors->InvokeAI==2.2.5) (2.1.3)
Requirement already satisfied: python-socketio>=5.0.2 in d:\invokeai\invokeai\.venv\lib\site-packages (from flask_socketio->InvokeAI==2.2.5) (5.7.2)
Requirement already satisfied: lmdb in d:\invokeai\invokeai\.venv\lib\site-packages (from gfpgan->InvokeAI==2.2.5) (1.4.0)
Requirement already satisfied: tb-nightly in d:\invokeai\invokeai\.venv\lib\site-packages (from gfpgan->InvokeAI==2.2.5) (2.12.0a20230107)
Requirement already satisfied: basicsr>=1.4.2 in d:\invokeai\invokeai\.venv\lib\site-packages (from gfpgan->InvokeAI==2.2.5) (1.4.2)
Requirement already satisfied: facexlib>=0.2.5 in d:\invokeai\invokeai\.venv\lib\site-packages (from gfpgan->InvokeAI==2.2.5) (0.2.5)
Requirement already satisfied: yapf in d:\invokeai\invokeai\.venv\lib\site-packages (from gfpgan->InvokeAI==2.2.5) (0.32.0)
Requirement already satisfied: einops in d:\invokeai\invokeai\.venv\lib\site-packages (from k-diffusion->InvokeAI==2.2.5) (0.6.0)
Requirement already satisfied: kornia in d:\invokeai\invokeai\.venv\lib\site-packages (from k-diffusion->InvokeAI==2.2.5) (0.6.9)
Requirement already satisfied: jsonmerge in d:\invokeai\invokeai\.venv\lib\site-packages (from k-diffusion->InvokeAI==2.2.5) (1.9.0)
Requirement already satisfied: torchdiffeq in d:\invokeai\invokeai\.venv\lib\site-packages (from k-diffusion->InvokeAI==2.2.5) (0.2.3)
Requirement already satisfied: wandb in d:\invokeai\invokeai\.venv\lib\site-packages (from k-diffusion->InvokeAI==2.2.5) (0.13.7)
Requirement already satisfied: clean-fid in d:\invokeai\invokeai\.venv\lib\site-packages (from k-diffusion->InvokeAI==2.2.5) (0.1.35)
Requirement already satisfied: resize-right in d:\invokeai\invokeai\.venv\lib\site-packages (from k-diffusion->InvokeAI==2.2.5) (0.0.2)
Requirement already satisfied: torchsde in d:\invokeai\invokeai\.venv\lib\site-packages (from k-diffusion->InvokeAI==2.2.5) (0.2.5)
Requirement already satisfied: toml in d:\invokeai\invokeai\.venv\lib\site-packages (from streamlit->InvokeAI==2.2.5) (0.10.2)
Requirement already satisfied: tzlocal>=1.1 in d:\invokeai\invokeai\.venv\lib\site-packages (from streamlit->InvokeAI==2.2.5) (4.2)
Requirement already satisfied: click>=7.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from streamlit->InvokeAI==2.2.5) (8.1.3)
Requirement already satisfied: pyarrow>=4.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from streamlit->InvokeAI==2.2.5) (10.0.1)
Requirement already satisfied: pydeck>=0.1.dev5 in d:\invokeai\invokeai\.venv\lib\site-packages (from streamlit->InvokeAI==2.2.5) (0.8.0)
Requirement already satisfied: watchdog in d:\invokeai\invokeai\.venv\lib\site-packages (from streamlit->InvokeAI==2.2.5) (2.2.1)
Requirement already satisfied: semver in d:\invokeai\invokeai\.venv\lib\site-packages (from streamlit->InvokeAI==2.2.5) (2.13.0)
Requirement already satisfied: cachetools>=4.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from streamlit->InvokeAI==2.2.5) (5.2.1)
Requirement already satisfied: tornado>=5.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from streamlit->InvokeAI==2.2.5) (6.2)
Requirement already satisfied: validators>=0.2 in d:\invokeai\invokeai\.venv\lib\site-packages (from streamlit->InvokeAI==2.2.5) (0.18.2)
Requirement already satisfied: blinker>=1.0.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from streamlit->InvokeAI==2.2.5) (1.5)
Requirement already satisfied: protobuf<4,>=3.12 in d:\invokeai\invokeai\.venv\lib\site-packages (from streamlit->InvokeAI==2.2.5) (3.20.3)
Requirement already satisfied: rich>=10.11.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from streamlit->InvokeAI==2.2.5) (13.0.1)
Requirement already satisfied: altair>=3.2.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from streamlit->InvokeAI==2.2.5) (4.2.0)
Requirement already satisfied: gitpython!=3.1.19 in d:\invokeai\invokeai\.venv\lib\site-packages (from streamlit->InvokeAI==2.2.5) (3.1.30)
Requirement already satisfied: pandas>=0.21.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from streamlit->InvokeAI==2.2.5) (1.5.2)
Requirement already satisfied: python-dateutil in d:\invokeai\invokeai\.venv\lib\site-packages (from streamlit->InvokeAI==2.2.5) (2.8.2)
Requirement already satisfied: pympler>=0.9 in d:\invokeai\invokeai\.venv\lib\site-packages (from streamlit->InvokeAI==2.2.5) (1.0.1)
Requirement already satisfied: pytorch-lightning>=1.0.8 in d:\invokeai\invokeai\.venv\lib\site-packages (from taming-transformers-rom1504->InvokeAI==2.2.5) (1.7.7)
Requirement already satisfied: omegaconf>=2.0.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from taming-transformers-rom1504->InvokeAI==2.2.5) (2.3.0)
Requirement already satisfied: imageio>=2.3.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from test-tube->InvokeAI==2.2.5) (2.24.0)
Requirement already satisfied: tensorboard>=1.15.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from test-tube->InvokeAI==2.2.5) (2.11.0)
Requirement already satisfied: future in d:\invokeai\invokeai\.venv\lib\site-packages (from test-tube->InvokeAI==2.2.5) (0.18.2)
Requirement already satisfied: tokenizers!=0.11.3,<0.14,>=0.11.1 in d:\invokeai\invokeai\.venv\lib\site-packages (from transformers->InvokeAI==2.2.5) (0.13.2)
Requirement already satisfied: toolz in d:\invokeai\invokeai\.venv\lib\site-packages (from altair>=3.2.0->streamlit->InvokeAI==2.2.5) (0.12.0)
Requirement already satisfied: entrypoints in d:\invokeai\invokeai\.venv\lib\site-packages (from altair>=3.2.0->streamlit->InvokeAI==2.2.5) (0.4)
Requirement already satisfied: jinja2 in d:\invokeai\invokeai\.venv\lib\site-packages (from altair>=3.2.0->streamlit->InvokeAI==2.2.5) (3.1.2)
Requirement already satisfied: jsonschema>=3.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from altair>=3.2.0->streamlit->InvokeAI==2.2.5) (4.17.3)
Requirement already satisfied: addict in d:\invokeai\invokeai\.venv\lib\site-packages (from basicsr>=1.4.2->gfpgan->InvokeAI==2.2.5) (2.4.0)
Requirement already satisfied: colorama in d:\invokeai\invokeai\.venv\lib\site-packages (from click>=7.0->streamlit->InvokeAI==2.2.5) (0.4.6)
Requirement already satisfied: filterpy in d:\invokeai\invokeai\.venv\lib\site-packages (from facexlib>=0.2.5->gfpgan->InvokeAI==2.2.5) (1.4.5)
Requirement already satisfied: numba in d:\invokeai\invokeai\.venv\lib\site-packages (from facexlib>=0.2.5->gfpgan->InvokeAI==2.2.5) (0.56.4)
Requirement already satisfied: Werkzeug>=2.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from Flask>=0.9->flask_cors->InvokeAI==2.2.5) (2.2.2)
Requirement already satisfied: itsdangerous>=2.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from Flask>=0.9->flask_cors->InvokeAI==2.2.5) (2.1.2)
Requirement already satisfied: gitdb<5,>=4.0.1 in d:\invokeai\invokeai\.venv\lib\site-packages (from gitpython!=3.1.19->streamlit->InvokeAI==2.2.5) (4.0.10)
Requirement already satisfied: zipp>=0.5 in d:\invokeai\invokeai\.venv\lib\site-packages (from importlib-metadata->diffusers->InvokeAI==2.2.5) (3.11.0)
Requirement already satisfied: antlr4-python3-runtime==4.9.* in d:\invokeai\invokeai\.venv\lib\site-packages (from omegaconf>=2.0.0->taming-transformers-rom1504->InvokeAI==2.2.5) (4.9.3)
Requirement already satisfied: pytz>=2020.1 in d:\invokeai\invokeai\.venv\lib\site-packages (from pandas>=0.21.0->streamlit->InvokeAI==2.2.5) (2022.7)
Requirement already satisfied: python-engineio>=4.3.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from python-socketio>=5.0.2->flask_socketio->InvokeAI==2.2.5) (4.3.4)
Requirement already satisfied: bidict>=0.21.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from python-socketio>=5.0.2->flask_socketio->InvokeAI==2.2.5) (0.22.1)
Requirement already satisfied: torchmetrics>=0.7.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from pytorch-lightning>=1.0.8->taming-transformers-rom1504->InvokeAI==2.2.5) (0.11.0)
Requirement already satisfied: fsspec[http]!=2021.06.0,>=2021.05.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from pytorch-lightning>=1.0.8->taming-transformers-rom1504->InvokeAI==2.2.5) (2022.11.0)
Requirement already satisfied: pyDeprecate>=0.3.1 in d:\invokeai\invokeai\.venv\lib\site-packages (from pytorch-lightning>=1.0.8->taming-transformers-rom1504->InvokeAI==2.2.5) (0.3.2)
Requirement already satisfied: scikit-learn>=0.19.1 in d:\invokeai\invokeai\.venv\lib\site-packages (from qudida>=0.0.4->albumentations->InvokeAI==2.2.5) (1.2.0)
Requirement already satisfied: certifi>=2017.4.17 in d:\invokeai\invokeai\.venv\lib\site-packages (from requests->diffusers->InvokeAI==2.2.5) (2022.12.7)
Requirement already satisfied: chardet<5,>=3.0.2 in d:\invokeai\invokeai\.venv\lib\site-packages (from requests->diffusers->InvokeAI==2.2.5) (4.0.0)
Requirement already satisfied: urllib3<1.27,>=1.21.1 in d:\invokeai\invokeai\.venv\lib\site-packages (from requests->diffusers->InvokeAI==2.2.5) (1.26.13)
Requirement already satisfied: idna<3,>=2.5 in d:\invokeai\invokeai\.venv\lib\site-packages (from requests->diffusers->InvokeAI==2.2.5) (2.10)
Requirement already satisfied: pygments<3.0.0,>=2.6.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from rich>=10.11.0->streamlit->InvokeAI==2.2.5) (2.14.0)
Requirement already satisfied: commonmark<0.10.0,>=0.9.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from rich>=10.11.0->streamlit->InvokeAI==2.2.5) (0.9.1)
Requirement already satisfied: tifffile>=2019.7.26 in d:\invokeai\invokeai\.venv\lib\site-packages (from scikit-image>=0.16.1->albumentations->InvokeAI==2.2.5) (2022.10.10)
Requirement already satisfied: PyWavelets>=1.1.1 in d:\invokeai\invokeai\.venv\lib\site-packages (from scikit-image>=0.16.1->albumentations->InvokeAI==2.2.5) (1.4.1)
Requirement already satisfied: networkx>=2.2 in d:\invokeai\invokeai\.venv\lib\site-packages (from scikit-image>=0.16.1->albumentations->InvokeAI==2.2.5) (3.0)
Requirement already satisfied: google-auth<3,>=1.6.3 in d:\invokeai\invokeai\.venv\lib\site-packages (from tensorboard>=1.15.0->test-tube->InvokeAI==2.2.5) (2.15.0)
Requirement already satisfied: grpcio>=1.24.3 in d:\invokeai\invokeai\.venv\lib\site-packages (from tensorboard>=1.15.0->test-tube->InvokeAI==2.2.5) (1.51.1)
Requirement already satisfied: markdown>=2.6.8 in d:\invokeai\invokeai\.venv\lib\site-packages (from tensorboard>=1.15.0->test-tube->InvokeAI==2.2.5) (3.4.1)
Requirement already satisfied: google-auth-oauthlib<0.5,>=0.4.1 in d:\invokeai\invokeai\.venv\lib\site-packages (from tensorboard>=1.15.0->test-tube->InvokeAI==2.2.5) (0.4.6)
Requirement already satisfied: setuptools>=41.0.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from tensorboard>=1.15.0->test-tube->InvokeAI==2.2.5) (56.0.0)
Requirement already satisfied: wheel>=0.26 in d:\invokeai\invokeai\.venv\lib\site-packages (from tensorboard>=1.15.0->test-tube->InvokeAI==2.2.5) (0.38.4)
Requirement already satisfied: absl-py>=0.4 in d:\invokeai\invokeai\.venv\lib\site-packages (from tensorboard>=1.15.0->test-tube->InvokeAI==2.2.5) (1.3.0)
Requirement already satisfied: tensorboard-plugin-wit>=1.6.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from tensorboard>=1.15.0->test-tube->InvokeAI==2.2.5) (1.8.1)
Requirement already satisfied: tensorboard-data-server<0.7.0,>=0.6.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from tensorboard>=1.15.0->test-tube->InvokeAI==2.2.5) (0.6.1)
Requirement already satisfied: tzdata in d:\invokeai\invokeai\.venv\lib\site-packages (from tzlocal>=1.1->streamlit->InvokeAI==2.2.5) (2022.7)
Requirement already satisfied: pytz-deprecation-shim in d:\invokeai\invokeai\.venv\lib\site-packages (from tzlocal>=1.1->streamlit->InvokeAI==2.2.5) (0.1.0.post0)
Requirement already satisfied: decorator>=3.4.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from validators>=0.2->streamlit->InvokeAI==2.2.5) (5.1.1)
Requirement already satisfied: wcwidth>=0.2.5 in d:\invokeai\invokeai\.venv\lib\site-packages (from ftfy->clip->InvokeAI==2.2.5) (0.2.5)
Requirement already satisfied: fonttools>=4.22.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from matplotlib->clipseg->InvokeAI==2.2.5) (4.38.0)
Requirement already satisfied: kiwisolver>=1.0.1 in d:\invokeai\invokeai\.venv\lib\site-packages (from matplotlib->clipseg->InvokeAI==2.2.5) (1.4.4)
Requirement already satisfied: contourpy>=1.0.1 in d:\invokeai\invokeai\.venv\lib\site-packages (from matplotlib->clipseg->InvokeAI==2.2.5) (1.0.6)
Requirement already satisfied: pyparsing>=2.2.1 in d:\invokeai\invokeai\.venv\lib\site-packages (from matplotlib->clipseg->InvokeAI==2.2.5) (3.0.9)
Requirement already satisfied: cycler>=0.10 in d:\invokeai\invokeai\.venv\lib\site-packages (from matplotlib->clipseg->InvokeAI==2.2.5) (0.11.0)
Requirement already satisfied: trampoline>=0.1.2 in d:\invokeai\invokeai\.venv\lib\site-packages (from torchsde->k-diffusion->InvokeAI==2.2.5) (0.1.2)
Requirement already satisfied: boltons>=20.2.1 in d:\invokeai\invokeai\.venv\lib\site-packages (from torchsde->k-diffusion->InvokeAI==2.2.5) (21.0.0)
Requirement already satisfied: promise<3,>=2.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from wandb->k-diffusion->InvokeAI==2.2.5) (2.3)
Requirement already satisfied: shortuuid>=0.5.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from wandb->k-diffusion->InvokeAI==2.2.5) (1.0.11)
Requirement already satisfied: pathtools in d:\invokeai\invokeai\.venv\lib\site-packages (from wandb->k-diffusion->InvokeAI==2.2.5) (0.1.2)
Requirement already satisfied: docker-pycreds>=0.4.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from wandb->k-diffusion->InvokeAI==2.2.5) (0.4.0)
Requirement already satisfied: sentry-sdk>=1.0.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from wandb->k-diffusion->InvokeAI==2.2.5) (1.12.1)
Requirement already satisfied: setproctitle in d:\invokeai\invokeai\.venv\lib\site-packages (from wandb->k-diffusion->InvokeAI==2.2.5) (1.3.2)
Requirement already satisfied: aiohttp!=4.0.0a0,!=4.0.0a1 in d:\invokeai\invokeai\.venv\lib\site-packages (from fsspec[http]!=2021.06.0,>=2021.05.0->pytorch-lightning>=1.0.8->taming-transformers-rom1504->InvokeAI==2.2.5) (3.8.3)
Requirement already satisfied: smmap<6,>=3.0.1 in d:\invokeai\invokeai\.venv\lib\site-packages (from gitdb<5,>=4.0.1->gitpython!=3.1.19->streamlit->InvokeAI==2.2.5) (5.0.0)
Requirement already satisfied: rsa<5,>=3.1.4 in d:\invokeai\invokeai\.venv\lib\site-packages (from google-auth<3,>=1.6.3->tensorboard>=1.15.0->test-tube->InvokeAI==2.2.5) (4.9)
Requirement already satisfied: pyasn1-modules>=0.2.1 in d:\invokeai\invokeai\.venv\lib\site-packages (from google-auth<3,>=1.6.3->tensorboard>=1.15.0->test-tube->InvokeAI==2.2.5) (0.2.8)
Requirement already satisfied: requests-oauthlib>=0.7.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from google-auth-oauthlib<0.5,>=0.4.1->tensorboard>=1.15.0->test-tube->InvokeAI==2.2.5) (1.3.1)
Requirement already satisfied: MarkupSafe>=2.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from jinja2->altair>=3.2.0->streamlit->InvokeAI==2.2.5) (2.1.1)
Requirement already satisfied: pyrsistent!=0.17.0,!=0.17.1,!=0.17.2,>=0.14.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from jsonschema>=3.0->altair>=3.2.0->streamlit->InvokeAI==2.2.5) (0.19.3)
Requirement already satisfied: attrs>=17.4.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from jsonschema>=3.0->altair>=3.2.0->streamlit->InvokeAI==2.2.5) (22.2.0)
Requirement already satisfied: threadpoolctl>=2.0.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from scikit-learn>=0.19.1->qudida>=0.0.4->albumentations->InvokeAI==2.2.5) (3.1.0)
Requirement already satisfied: joblib>=1.1.1 in d:\invokeai\invokeai\.venv\lib\site-packages (from scikit-learn>=0.19.1->qudida>=0.0.4->albumentations->InvokeAI==2.2.5) (1.2.0)
Requirement already satisfied: llvmlite<0.40,>=0.39.0dev0 in d:\invokeai\invokeai\.venv\lib\site-packages (from numba->facexlib>=0.2.5->gfpgan->InvokeAI==2.2.5) (0.39.1)
Requirement already satisfied: multidict<7.0,>=4.5 in d:\invokeai\invokeai\.venv\lib\site-packages (from aiohttp!=4.0.0a0,!=4.0.0a1->fsspec[http]!=2021.06.0,>=2021.05.0->pytorch-lightning>=1.0.8->taming-transformers-rom1504->InvokeAI==2.2.5) (6.0.4)
Requirement already satisfied: aiosignal>=1.1.2 in d:\invokeai\invokeai\.venv\lib\site-packages (from aiohttp!=4.0.0a0,!=4.0.0a1->fsspec[http]!=2021.06.0,>=2021.05.0->pytorch-lightning>=1.0.8->taming-transformers-rom1504->InvokeAI==2.2.5) (1.3.1)
Requirement already satisfied: charset-normalizer<3.0,>=2.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from aiohttp!=4.0.0a0,!=4.0.0a1->fsspec[http]!=2021.06.0,>=2021.05.0->pytorch-lightning>=1.0.8->taming-transformers-rom1504->InvokeAI==2.2.5) (2.1.1)
Requirement already satisfied: async-timeout<5.0,>=4.0.0a3 in d:\invokeai\invokeai\.venv\lib\site-packages (from aiohttp!=4.0.0a0,!=4.0.0a1->fsspec[http]!=2021.06.0,>=2021.05.0->pytorch-lightning>=1.0.8->taming-transformers-rom1504->InvokeAI==2.2.5) (4.0.2)
Requirement already satisfied: frozenlist>=1.1.1 in d:\invokeai\invokeai\.venv\lib\site-packages (from aiohttp!=4.0.0a0,!=4.0.0a1->fsspec[http]!=2021.06.0,>=2021.05.0->pytorch-lightning>=1.0.8->taming-transformers-rom1504->InvokeAI==2.2.5) (1.3.3)
Requirement already satisfied: yarl<2.0,>=1.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from aiohttp!=4.0.0a0,!=4.0.0a1->fsspec[http]!=2021.06.0,>=2021.05.0->pytorch-lightning>=1.0.8->taming-transformers-rom1504->InvokeAI==2.2.5) (1.8.2)
Requirement already satisfied: pyasn1<0.5.0,>=0.4.6 in d:\invokeai\invokeai\.venv\lib\site-packages (from pyasn1-modules>=0.2.1->google-auth<3,>=1.6.3->tensorboard>=1.15.0->test-tube->InvokeAI==2.2.5) (0.4.8)
Requirement already satisfied: oauthlib>=3.0.0 in d:\invokeai\invokeai\.venv\lib\site-packages (from requests-oauthlib>=0.7.0->google-auth-oauthlib<0.5,>=0.4.1->tensorboard>=1.15.0->test-tube->InvokeAI==2.2.5) (3.2.2)
Building wheels for collected packages: InvokeAI
  Building wheel for InvokeAI (setup.py) ... done
  Created wheel for InvokeAI: filename=InvokeAI-2.2.5-py3-none-any.whl size=2049642 sha256=d0245509233cbae3d7cc56dff4f406f8bde47606acb129c86e3845838d4304ab
  Stored in directory: C:\Users\Brian\AppData\Local\Temp\pip-ephem-wheel-cache-1y43eb6u\wheels\67\b0\49\9f21042c65e73a757c112ca6c1b781394f90d52a3ddf5d3c8d
Successfully built InvokeAI
Installing collected packages: InvokeAI
Successfully installed InvokeAI-2.2.5
Installation successful.
.\templates\rootdir\configs\INITIAL_MODELS.yaml
.\templates\rootdir\configs\models.yaml.example
.\templates\rootdir\configs\sd-concepts.txt
.\templates\rootdir\configs\stable-diffusion\v1-finetune.yaml
.\templates\rootdir\configs\stable-diffusion\v1-finetune_style.yaml
.\templates\rootdir\configs\stable-diffusion\v1-inference.yaml
.\templates\rootdir\configs\stable-diffusion\v1-inpainting-inference.yaml
.\templates\rootdir\configs\stable-diffusion\v1-m1-finetune.yaml
8 File(s) copied
Loading Python libraries...

Welcome to InvokeAI. This script will help download the Stable Diffusion weight files
and other large models that are needed for text to image generation. At any point you may interrupt
this program and resume later.

** INITIALIZING INVOKEAI RUNTIME DIRECTORY **
Select the default directory for image outputs [D:\InvokeAI\invokeai\outputs]: D:\InvokeAI\invokeai\outputs

InvokeAI image outputs will be placed into "D:\InvokeAI\invokeai\outputs".
Accept this location? [y]

You may change the chosen output directory at any time by editing the --outdir options in "invokeai.init",
You may also change the runtime directory by setting the environment variable INVOKEAI_ROOT.

The NSFW (not safe for work) checker blurs out images that potentially contain sexual imagery.
It can be selectively enabled at run time with --nsfw_checker, and disabled with --no-nsfw_checker.
The following option will set whether the checker is enabled by default. Like other options, you can
change this setting later by editing the file invokeai.init.
This is NOT recommended for systems with less than 6G VRAM because of the checker's memory requirements.
Enable the NSFW checker by default? [y]
```

```
Creating the initialization file at "D:\InvokeAI\invokeai\invokeai.init".

** DOWNLOADING DIFFUSION WEIGHTS **
You can download and configure the weights files manually or let this
script do it for you. Manual installation is described at:

https://invoke-ai.github.io/InvokeAI/installation/020_INSTALL_MANUAL/

You may download the recommended models (about 10GB total), select a customized set, or
completely skip this step.

Download <r>ecommended models, <a>ll models, <c>ustomized list, or <s>kip this step? [r]:
```

![Invoke AI Web UI](/static/invoke.png)
