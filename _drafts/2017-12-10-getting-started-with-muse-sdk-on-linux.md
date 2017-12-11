---

layout: post
title: Setting up Muse SDK on Linux
date: 2017-12-10
comments: true

---

This article will go over setup for the Muse EEG headband. 

From [developer.choosemuse.com](http://developer.choosemuse.com/) download the Linux version of the **Research Tools**. 

Navigate to your `Downloads` folder and run the following command: 

```terminal
 $ ./musesdk-3.4.1-linux-installer.run 
```

Then follow the prompts: 

```terminal
Do you accept these licenses? [y/n]: y

----------------------------------------------------------------------------
Please specify the directory where Muse SDK will be installed.

Installation Directory [/home/brian/Muse]: 

----------------------------------------------------------------------------
Setup is now ready to begin installing Muse SDK on your computer.

Do you want to continue? [Y/n]: Y
```

Confirm the location of where you want to install Muse, and then run `source ~/.bash_profile` to add Muse to your path. 