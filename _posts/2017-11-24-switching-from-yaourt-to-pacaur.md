---

layout: post
title: Switching from yaourt to pacaur
date: 2017-11-24
comments: true

---

Since I started using Arch Linux I have been using `yaourt`, a pacman wrapper with extended features and AUR support.

There are lots of options, and there is a helpful [comparison chart](https://wiki.archlinux.org/index.php/AUR_helpers) on the Arch Wiki.

One annoying part of installing packages with yaourt is that it will ask you to examine/edit the contents of PKGBUILD. Here's an example: 

```terminal 
 $ yaourt -S freecell

==> Downloading freecell PKGBUILD from AUR...
x .SRCINFO
x PKGBUILD
Anonymous comment on 2012-04-22 13:26			 
Your arch line is wrong!
Please change
arch=('i686' 'x64')
to
arch=('i686' 'x86_64')

freecell 1.0-4  (2015-06-10 11:30)
( Unsupported package: Potentially dangerous ! )
==> Edit PKGBUILD ? [Y/n] ("A" to abort)
==> ------------------------------------
==> 
```

What is PKGBUILD? From the Arch Wiki: 

> A PKGBUILD is a shell script containing the build information required by Arch Linux packages.

For most package installations, yaourt will also ask you to confirm installation: 

```terminal
==> Edit PKGBUILD ? [Y/n] ("A" to abort)
==> ------------------------------------
==> n

==> freecell dependencies:
 - ncurses (already installed)


==> Continue building freecell ? [Y/n]
==> ----------------------------------
==> Y
```

And often times you will need to do this more than once: 

```terminal
[...]
==> Continue building freecell ? [Y/n]
==> ----------------------------------
==> Y

==> Building and installing package
==> Making package: freecell 1.0-4 (Fri Nov 24 20:58:00 EST 2017)
==> Checking runtime dependencies...
==> Checking buildtime dependencies...
==> Retrieving sources...
  -> Downloading freecell-1.0.tar.gz...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 87713  100 87713    0     0  87713      0  0:00:01 --:--:--  0:00:01  101k
==> Validating source files with md5sums...
    freecell-1.0.tar.gz ... Passed
==> Extracting sources...
  -> Extracting freecell-1.0.tar.gz with bsdtar
==> Starting build()...
checking for a BSD-compatible install... /usr/bin/install -c
checking whether build environment is sane... yes
checking for a thread-safe mkdir -p... /usr/bin/mkdir -p
checking for gawk... gawk
checking whether make sets $(MAKE)... yes
checking for gcc... gcc
checking for C compiler default output file name... a.out
checking whether the C compiler works... yes
checking whether we are cross compiling... no
checking for suffix of executables... 
checking for suffix of object files... o
checking whether we are using the GNU C compiler... yes
checking whether gcc accepts -g... yes
checking for gcc option to accept ISO C89... none needed
checking for style of include used by make... GNU
checking dependency style of gcc... gcc3
checking for start_color in -lncurses... yes
checking how to run the C preprocessor... gcc -E
checking for grep that handles long lines and -e... /usr/bin/grep
checking for egrep... /usr/bin/grep -E
checking for ANSI C header files... yes
checking for sys/types.h... yes
checking for sys/stat.h... yes
checking for stdlib.h... yes
checking for string.h... yes
checking for memory.h... yes
checking for strings.h... yes
checking for inttypes.h... yes
checking for stdint.h... yes
checking for unistd.h... yes
checking for stdlib.h... (cached) yes
checking for string.h... (cached) yes
checking for unistd.h... (cached) yes
checking for an ANSI C-conforming const... yes
checking for stdlib.h... (cached) yes
checking for GNU libc compatible malloc... yes
checking for strdup... yes
configure: creating ./config.status
config.status: creating Makefile
config.status: creating src/Makefile
config.status: creating doc/Makefile
config.status: executing depfiles commands
Making all in src
make[1]: Entering directory '/tmp/yaourt-tmp-brian/aur-freecell/src/freecell-1.0/src'
gcc -DPACKAGE_NAME=\"freecell\" -DPACKAGE_TARNAME=\"freecell\" -DPACKAGE_VERSION=\"1.0\" -DPACKAGE_STRING=\"freecell\ 1.0\" -DPACKAGE_BUGREPORT=\"linus@linusakesson.net\" -DPACKAGE=\"freecell\" -DVERSION=\"1.0\" -DHAVE_LIBNCURSES=1 -DSTDC_HEADERS=1 -DHAVE_SYS_TYPES_H=1 -DHAVE_SYS_STAT_H=1 -DHAVE_STDLIB_H=1 -DHAVE_STRING_H=1 -DHAVE_MEMORY_H=1 -DHAVE_STRINGS_H=1 -DHAVE_INTTYPES_H=1 -DHAVE_STDINT_H=1 -DHAVE_UNISTD_H=1 -DHAVE_STDLIB_H=1 -DHAVE_STRING_H=1 -DHAVE_UNISTD_H=1 -DHAVE_STDLIB_H=1 -DHAVE_MALLOC=1 -DHAVE_STRDUP=1 -I.   -D_FORTIFY_SOURCE=2  -march=x86-64 -mtune=generic -O2 -pipe -fstack-protector-strong -fno-plt -MT freecell.o -MD -MP -MF .deps/freecell.Tpo -c -o freecell.o freecell.c
freecell.c:350:1: warning: return type defaults to ‘int’ [-Wimplicit-int]
 usage() {
 ^~~~~
freecell.c: In function ‘main’:
freecell.c:403:9: warning: implicit declaration of function ‘time’; did you mean ‘nice’? [-Wimplicit-function-declaration]
   srand(time(0));
         ^~~~
         nice
mv -f .deps/freecell.Tpo .deps/freecell.Po
gcc -DPACKAGE_NAME=\"freecell\" -DPACKAGE_TARNAME=\"freecell\" -DPACKAGE_VERSION=\"1.0\" -DPACKAGE_STRING=\"freecell\ 1.0\" -DPACKAGE_BUGREPORT=\"linus@linusakesson.net\" -DPACKAGE=\"freecell\" -DVERSION=\"1.0\" -DHAVE_LIBNCURSES=1 -DSTDC_HEADERS=1 -DHAVE_SYS_TYPES_H=1 -DHAVE_SYS_STAT_H=1 -DHAVE_STDLIB_H=1 -DHAVE_STRING_H=1 -DHAVE_MEMORY_H=1 -DHAVE_STRINGS_H=1 -DHAVE_INTTYPES_H=1 -DHAVE_STDINT_H=1 -DHAVE_UNISTD_H=1 -DHAVE_STDLIB_H=1 -DHAVE_STRING_H=1 -DHAVE_UNISTD_H=1 -DHAVE_STDLIB_H=1 -DHAVE_MALLOC=1 -DHAVE_STRDUP=1 -I.   -D_FORTIFY_SOURCE=2  -march=x86-64 -mtune=generic -O2 -pipe -fstack-protector-strong -fno-plt -MT gameno.o -MD -MP -MF .deps/gameno.Tpo -c -o gameno.o gameno.c
mv -f .deps/gameno.Tpo .deps/gameno.Po
gcc  -march=x86-64 -mtune=generic -O2 -pipe -fstack-protector-strong -fno-plt  -Wl,-O1,--sort-common,--as-needed,-z,relro,-z,now -o freecell freecell.o gameno.o  -lncurses 
make[1]: Leaving directory '/tmp/yaourt-tmp-brian/aur-freecell/src/freecell-1.0/src'
Making all in doc
make[1]: Entering directory '/tmp/yaourt-tmp-brian/aur-freecell/src/freecell-1.0/doc'
make[1]: Nothing to be done for 'all'.
make[1]: Leaving directory '/tmp/yaourt-tmp-brian/aur-freecell/src/freecell-1.0/doc'
make[1]: Entering directory '/tmp/yaourt-tmp-brian/aur-freecell/src/freecell-1.0'
make[1]: Nothing to be done for 'all-am'.
make[1]: Leaving directory '/tmp/yaourt-tmp-brian/aur-freecell/src/freecell-1.0'
==> Entering fakeroot environment...
==> Starting package()...
Making install in src
make[1]: Entering directory '/tmp/yaourt-tmp-brian/aur-freecell/src/freecell-1.0/src'
make[2]: Entering directory '/tmp/yaourt-tmp-brian/aur-freecell/src/freecell-1.0/src'
test -z "/usr/bin" || /usr/bin/mkdir -p "/tmp/yaourt-tmp-brian/aur-freecell/pkg/freecell/usr/bin"
  /usr/bin/install -c 'freecell' '/tmp/yaourt-tmp-brian/aur-freecell/pkg/freecell/usr/bin/freecell'
make[2]: Nothing to be done for 'install-data-am'.
make[2]: Leaving directory '/tmp/yaourt-tmp-brian/aur-freecell/src/freecell-1.0/src'
make[1]: Leaving directory '/tmp/yaourt-tmp-brian/aur-freecell/src/freecell-1.0/src'
Making install in doc
make[1]: Entering directory '/tmp/yaourt-tmp-brian/aur-freecell/src/freecell-1.0/doc'
make[2]: Entering directory '/tmp/yaourt-tmp-brian/aur-freecell/src/freecell-1.0/doc'
make[2]: Nothing to be done for 'install-exec-am'.
test -z "/usr/share/man/man6" || /usr/bin/mkdir -p "/tmp/yaourt-tmp-brian/aur-freecell/pkg/freecell/usr/share/man/man6"
 /usr/bin/install -c -m 644 './freecell.6' '/tmp/yaourt-tmp-brian/aur-freecell/pkg/freecell/usr/share/man/man6/freecell.6'
make[2]: Leaving directory '/tmp/yaourt-tmp-brian/aur-freecell/src/freecell-1.0/doc'
make[1]: Leaving directory '/tmp/yaourt-tmp-brian/aur-freecell/src/freecell-1.0/doc'
make[1]: Entering directory '/tmp/yaourt-tmp-brian/aur-freecell/src/freecell-1.0'
make[2]: Entering directory '/tmp/yaourt-tmp-brian/aur-freecell/src/freecell-1.0'
make[2]: Nothing to be done for 'install-exec-am'.
make[2]: Nothing to be done for 'install-data-am'.
make[2]: Leaving directory '/tmp/yaourt-tmp-brian/aur-freecell/src/freecell-1.0'
make[1]: Leaving directory '/tmp/yaourt-tmp-brian/aur-freecell/src/freecell-1.0'
==> Tidying install...
  -> Removing libtool files...
  -> Purging unwanted files...
  -> Removing static library files...
  -> Stripping unneeded symbols from binaries and libraries...
  -> Compressing man and info pages...
==> Checking for packaging issue...
==> Creating package "freecell"...
  -> Generating .PKGINFO file...
  -> Generating .BUILDINFO file...
  -> Generating .MTREE file...
  -> Compressing package...
==> Leaving fakeroot environment.
==> Finished making: freecell 1.0-4 (Fri Nov 24 20:58:05 EST 2017)
==> Cleaning up...

==> Continue installing freecell ? [Y/n]
==> [v]iew package contents [c]heck package with namcap
==> ---------------------------------------------------
==> 

```
and you often times have to provide your password during the install process: 

```terminal
==> Continue installing freecell ? [Y/n]
==> [v]iew package contents [c]heck package with namcap
==> ---------------------------------------------------
==> Y

[sudo] password for brian: 
loading packages...
resolving dependencies...
looking for conflicting packages...

Package (1)  New Version  Net Change

freecell     1.0-4          0.02 MiB

Total Installed Size:  0.02 MiB

:: Proceed with installation? [Y/n] 
```

This process becomes quite tedious when you are installing lots of packages. In most cases you don't want to edit PKGBUILD, and you DO want to continue with the installation. yaourt does have flags such as `--no-edit` and `--no-confirm` that you can pass in to skip these dialogue prompts. However, in some cases there may be conflicting packages that you would want inspect. 

Here's the description of the pacaur package: 

```terminal
aur/pacaur 4.7.10-1 [installed] (1057) (47.35)
    An AUR helper that minimizes user interaction
```

Compared to the description of yaourt: 

```terminal
aur/yaourt 1.9-1 [installed] (2991) (16.33)
    A pacman wrapper with extended features and AUR support
```

Let's see how pacaur holds up to it's philosophy of minimizing user interaction: 

```terminal
 $ yaourt -R freecell && pacaur -S freecell
```

The pacaur installation did ask me to confirm once at the beginning of the install process, and it automatically confirmed the second time without asking me to edit the PKGBUILD. Nice! Trying one more time with `--noconfirm`, there was zero interaction between pressing ENTER and the end of the install process. Even better! Either way, using pacaur is much nicer than using yaourt for something as simple as installing freecell. 

It makes sense to prompt the user with any questions at the beginning of the install process and then have then package manager continue with installing the package(s). 

## Installation

I ran into signature verification issues when trying to install pacaur. This issue came up when the install process was installing cower, one of pacaur's dependecies. Thankfully, the issue was addressed in one of the pinned comments on the [cower AUR page](https://aur.archlinux.org/packages/cower/): 

> If you are having problems installing this package due to signature verification, please run the below before running makepkg:

```
 $ gpg --recv-keys --keyserver hkp://pgp.mit.edu 1EB2638FF56C0C53
```

This will add a security key to our keyring: 

```terminal
 $ gpg --list-keys
 /home/brian/.gnupg/pubring.kbx
------------------------------
pub   rsa2048 2011-06-25 [SC]
      487EACC08557AD082088DABA1EB2638FF56C0C53
uid           [ unknown] Dave Reisner <d@falconindy.com>
uid           [ unknown] Dave Reisner <dreisner@archlinux.org>
sub   rsa2048 2011-06-25 [E]
```

I'm not too sure about how gpg keys work or why they are important here, but there is plenty of reading to do about this topic that I will leave for a later article. 

Once we add this key, we can simply install pacaur with the tool that it will soon replace: 

```terminal
 $ yaourt -S pacaur
```

The syntax and options of pacaur is similar to those of pacman and yaourt, so luckily there is nothing new to learn when switching to pacaur. I'm still new to this tool, so I'll add any new insights to this article as I get more experience using pacaur as a package manager.

## Updates

Nothing yet.