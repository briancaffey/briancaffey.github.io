---

layout: post
title: Distilling lessons from the OTTG Django tutorial
date: 2017-03-04
comments: true

---

This post will boil down the important steps described in [Obey the Testing Goat](http://www.obeythetestinggoat.com/), a book I am reading on test-driven development (TDD) in [Django](https://www.djangoproject.com/), a web framework written in Python. 

The book (which is published under the [Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License](https://creativecommons.org/licenses/by-nc-sa/3.0/)) does a great job of introducing TDD and Django, and it does so in lots of detail. I'm trying to get a better sense of the work flow, so I'm going to list the important steps for working with Django, using tests and also using git to build a simple web application. 

# Obey the Testing Goat

If you are using the Anaconda distribution, there may be an issue with creating a Python 3 environment. If you see the following error, you will need to resolve [an issue](https://github.com/conda/conda/issues/3935) caused by `pyopenssl` and `cryptography` being out of sync.

```terminal
$ conda create -n py3k python=3 anaconda
Fetching package metadata ...An unexpected error has occurred.
[...]
```

To fix this, run:

```terminal
CONDA_SSL_VERIFY=false conda update pyopenssl
```

Then you can run `$ conda create -n py3k python=3 anaconda` again and it should create the environment. 

Another issue invovles using the webdriver `geckodriver`. Once you [download the appropriate release version](https://github.com/mozilla/geckodriver/releases), you will need to put the executable in your path. To do this, run the following once you have unzipped the driver (assuming you unzipped the executable to your Downloads folder: 

```terminal
$ mv ~/Downloads/geckodriver /usr/local/bin
```  

Check to see if you get this: 

```terminal
$ geckodriver --version
geckodriver 0.14.0

The source code of this program is available at
https://github.com/mozilla/geckodriver.

This program is subject to the terms of the Mozilla Public License 2.0.
You can obtain a copy of the license at https://mozilla.org/MPL/2.0/.
```

We can now install the two packages we need to get going: Django and selenium. Make sure to activate your virtual environment before making the installation. My virtual environment is called `py3k`. 

```terminal
$ source activate py3k
(py3k) $ pip install "django<1.11" "selenium>3"
```

At this point we should be ready to start!

## Chapter 1: Getting Django Set Up Using a Functional Test

**TEST:** Is the Django server running? (Is the word Django in the title?)

```terminal
(py3) $ nano functional_tests.py
```

```python 
from selenium import webdriver

browser = webdriver.Firefox()
browser.get('http://localhost:8000')

assert 'Django' in browser.title
```
```terminal
(py3) $ python functional_tests.py

[...]
selenium.common.exceptions.WebDriverException: Message: Error loading page
```

**CREATE DJANGO PROJECT**

```terminal
(py3) $ django-admin.py startproject superlists
(py3) $ tree
.
├── functional_tests.py
└── superlists
    ├── manage.py
    └── superlists
        ├── __init__.py
        ├── settings.py
        ├── urls.py
        └── wsgi.py

2 directories, 6 files
	
```
**RUN SERVER**

```terminal 
(py3) $ cd superlists
(py3) $ python manage.py runserver
[...]
Quit the server with CONTROL-C.
```

**TEST PASSES**

**GIT**

I won't go into much detail about git, but it's important to get everything set up correctly, so here are the important things to do 


```terminal
(py3) $ ls
superlists  functional_tests.py  geckodriver.log
(py3) $ mv functional_tests.py superlists/
(py3) $ cd superlists
(py3) $ git init .
(py3) $ echo "db.sqlite3" >> .gitignore
(py3) $ echo "geckodriver.log" >> .gitignore
(py3) $ git add .
(py3) $ git rm -r --cached superlists/__pycache__
(py3) $ echo "__pycache__" >> .gitignore
(py3) $ echo "*.pyc" >> .gitignore
(py3) $ git add .gitignore
(py3) $ git commit
```

## Chapter 2: Extending Our Functional Test Using the unittest Module

Extending `functional_tests.py` for storyboarding and "minimum viable app". 

```python
from selenium import webdriver
import unittest

class NewVisitorTest(unittest.TestCase):  

    def setUp(self):  
        self.browser = webdriver.Firefox()

    def tearDown(self):  
        self.browser.quit()

    def test_can_start_a_list_and_retrieve_it_later(self):  
        # Edith has heard about a cool new online to-do app. She goes
        # to check out its homepage
        self.browser.get('http://localhost:8000')

        # She notices the page title and header mention to-do lists
        self.assertIn('To-Do', self.browser.title)  
        self.fail('Finish the test!')  

        # She is invited to enter a to-do item straight away
        [...rest of comments as before]

if __name__ == '__main__':  
    unittest.main(warnings='ignore')  
```

```python
(py3) $ python functional_tests.py
[...]
AssertionError: 'To-Do' not found in 'Welcome to Django'
```
Browser Reads: 

>It worked!
Congratulations on your first Django-powered page.

**GIT:** commit

# Chapter 3: Testing a Simple Home Page with Unit Tests

Start a new app in the project: 

```terminal
(py3) $ python manage.py startapp lists
(py3) >>tree
.
├── db.sqlite3
├── functional_tests.py
├── geckodriver.log
├── lists
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── migrations
│   │   └── __init__.py
│   ├── models.py
│   ├── tests.py
│   └── views.py
├── manage.py
└── superlists
    ├── __init__.py
    ├── __pycache__
    │   ├── __init__.cpython-36.pyc
    │   ├── settings.cpython-36.pyc
    │   ├── urls.cpython-36.pyc
    │   └── wsgi.cpython-36.pyc
    ├── settings.py
    ├── urls.py
    └── wsgi.py
```

**GIT:** commit

```terminal
(py3) $ git add lists/
(py3) $ git commit -m "add app for lists"
```

**REVIEW:** Django workflow 

1. An HTTP request comes in for a particular URL. 
2. Django uses some rules to decide which view function should deal with the request (this is referred to as resolving the URL).
3. The view function processes the request and returns an HTTP response.

**TEST**: Unit Tests

*lists/tests.py*

```terminal
from django.core.urlresolvers import resolve
from django.test import TestCase
from lists.views import home_page

class HomePageTest(TestCase):

	def test_root_url_resolves_to_home_page_view(self):
		found = resolve('/')
		self.assertEqual(found.func, home_page)
```

*`resolve().func` is the view function that would be used to serve the URL* [Link](https://docs.djangoproject.com/en/1.10/ref/urlresolvers/)

*lists/tests.py*

```python
from django.shortcuts import render

# Create your views here.
home_page = None
```

**TEST:** unit test

```terminal
(py3) $ python manage.py test
[...]
django.urls.exceptions.Resolver404: {'tried': [[<RegexURLResolver
<RegexURLPattern list> (admin:admin) ^admin/>]], 'path': ''}
```

*superlists/urls.py*

```python
from django.conf.urls import url
from lists import views

urlpatterns = [
    url(r'^$', views.home_page, name='home'),
]
```

**TEST:** unit test

```terminal
(py3) $ python manage.py test
[...]
TypeError: view must be a callable or a list/tuple in the case of include().
```

*lists/views.py*

```python
from django.shortcuts import render

def home_page():
    pass
```

**TEST:** unit test passes

**GIT:** commit

*lists/tests.py*

```python
from django.core.urlresolvers import resolve
from django.test import TestCase
from django.http import HttpRequest

from lists.views import home_page

class HomePageTest(TestCase):

    def test_root_url_resolves_to_home_page_view(self):
        found = resolve('/')
        self.assertEqual(found.func, home_page)

    def test_home_page_returns_correct_html(self):
        request = HttpRequest()
        response = home_page(request)
        html = response.content.decode('utf8')
        self.assertTrue(html.startwith('<html>'))
        self.assertIn('<title>To-Do lists</title>', html)
        self.assertTrue(html.endswith('</html>'))
```

**TEST:** 

```terminal
(py3) $ python manage.py test
[...]
TypeError: home_page() takes 0 positional arguments but 1 was given
```

To make this test pass we will need to pass `request` into `home_page`. 

*lists/views.py*

```python
from django.shortcuts import render

def home_page(requests):
    pass
```
**TEST:** 

```terminal
(py3) $ python manage.py test
[...]
AttributeError: 'NoneType' object has no attribute 'content'
```

This part is pretty tediuous, the book stresses *very* small incremental changes between each test. 

*lists/views.py*

```python
from django.shortcuts import render
from django.http import HttpResponse

def home_page(request):
    return HttpResponse()
```

**TEST:** 

```terminal
(py3) $ python manage.py test
[...]
    self.assertTrue(html.startswith('<html>'))
NameError: name 'self' is not defined
```

*lists/views.py*

```python
from django.shortcuts import render
from django.http import HttpResponse

def home_page(request):
    return HttpResponse('<html>')
```

**TEST:** 

```terminal
(py3) $ python manage.py test
[...]
    self.assertIn('<title>To-Do lists</title>', html)
AssertionError: '<title>To-Do lists</title>' not found in '<html>'
```

*lists/views.py*

```python
from django.shortcuts import render
from django.http import HttpResponse

def home_page(request):
    return HttpResponse('<html><title>To-Do lists</title></html>')
```

**TEST:** 

```terminal
(py3) >>python manage.py test
Creating test database for alias 'default'...
..
----------------------------------------------------------------------
Ran 2 tests in 0.002s

OK
Destroying test database for alias 'default'...
```
**TEST:** *lists/functional_tests.py* passes

**GIT:** commit

# Chapter 4: What Are We Doing with All These Tests? (And, Refactoring)

That last part was pretty tedious. The rest is a little bit smoother. The next step is to expand our functional test. 

*lists/functional_tests.py*

```python
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
import unittest

class NewVisitorTest(unittest.TestCase):

    def setUp(self):
        self.browser = webdriver.Firefox()

    def tearDown(self):
        self.browser.quit()

    def test_can_start_a_list_and_retrieve_it_later(self): 

        #user goes to site
        self.browser.get('http://localhost:8000')

        #page title mentions to-do lists
        self.assertIn('To-Do', self.browser.title)
        head_text = self.browser.find_element_by_tag_name('h1').text

        self.assertIn('To-Do', head_text)

        #user is prompted to enter a to-do item
        inputbox = self.browser.find_element_by_id('id_new_item')
        self.assertEqual(
            inputbox.get_attribute('placeholder'),
            'Enter a to-do item'
        )

        #user types "buy peacock feathers"
        inputbox.send_keys('Buy peacock feathers')

        #user hits enter, page updates, page displays "1: Buy peacock feathers" in list
        inputbox.send_keys(Keys.ENTER)
        time.sleep(1)

        table = self.browser.find_element_by_id('id_list_table')
        rows = table.find_elements_by_tag_name('tr')
        self.assertTrue(
            any(row.text == '1: Buy peacock feathers' for row in rows)
        )

        #more tests

        self.fail('Finish the test!')
```
**TEST:**

```terminal
(py3) $ python functional_tests.py
[...]
selenium.common.exceptions.NoSuchElementException: Message: Unable to locate
element: h1
```

**GIT:** commit

## Templates

Now we start to organize html into templates. We need a templates folder: 

```terminal
(py3) $ mkdir lists/templates
```

*lists/templates/home.html*

```html
<html>
    <title>To-Do lists</title>
</html>
```

With this basic template we can rewrite `views.py`: 

*lists/views.py*

```python
from django.shortcuts import render

def home_page(request):
    return render(request, 'home.html')
````

**TEST:** failed

```terminal
(py3) $ python manage.py test
[...]
django.template.exceptions.TemplateDoesNotExist: home.html
```

Reason for failure: `lists` app not "officially registered" with Django. 
Solution: add `lists` app to `settings.py`:

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'lists',
]
```

**TEST:** pass

For Mac/Linux users, this test will pass. Windows users might fail this test, see Chapter 4 for more information. 

The next section significantly simplifies `lists/tests.py`:

```python
from django.test import TestCase

class HomePageTest(TestCase):

	def test_uses_home_template(self):
		response = self.cleint.get('/')
		self.assertTemplateUsed(response, 'home.html')
```

**GIT:** add and commit

The next step is to get our functional test to pass. To do that we need to add more content to the `home.html` template. In the same fashion, the book adds elements one at a time to make each test pass. Here's the final html that will pass the test: 

*templates/home.html*

```html
<html>
    <head>
        <title>To-Do lists</title>
    </head>
    <body>
        <h1>Your To-Do list</h1>
        <input id="id_new_item" placeholder="Enter a to-do item" />
        <table id="id_list_table">
    	</table>
    </body>
</html>
```

**TEST:** the test results now read: 

```terminal
(py3) >>python functional_tests.py
F
======================================================================
FAIL: test_can_start_a_list_and_retrieve_it_later (__main__.NewVisitorTest)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "functional_tests.py", line 42, in test_can_start_a_list_and_retrieve_it_later
    any(row.text == '1: Buy peacock feathers' for row in rows)
AssertionError: False is not true
```

One more helpful tip is passing error messages to assertion methods. Here's one example of how we could do that it `functional_tests.py`: 

```python
self.assertTrue(
    any(row.text == '1: Buy peacock feathers' for row in rows),
    "New to-do item did not appear in table"
)
```
**GIT:** commit

Here's a helpful image from the book that I found helpful: 

![png](/img/ottg/tdd.png)

# Chapter 5: Saving User Input: Testing the Database

To get our browser to send a POST request, we need to do two things:

1. Give the `<input>` element a `name=` attribute
2. Wrap it in a `<form>` tag with `method="POST"`

Here's how to do that: 

```html 
<h1>Your To-Do list</h1>
<form method="POST">
    <input name="item_text" id="id_new_item" placeholder="Enter a to-do item" />
</form>

<table id="id_list_table">
``` 

**TEST:** failed

To pass the test we must place a CRSF (Cross-Site Request Forgery) token in the form. Django makes this easy, we simply add a template tag: 

```html
<form method="POST">
    <input name="item_text" id="id_new_item" placeholder="Enter a to-do item" />
    {% raw  %}{% csrf_token %}{% endraw %}
</form>
```

We haven't specified an `action=` attribute for the form, so it is submitting back to the same URL it was sent from. This URL is the base URL ('/'), and this is handled by the `home_page` function in `views.py`. The next step is to adapt the `home_page` view. But first, we write a test: 

**TEST:**

```python
def test_can_save_a_POST_request(self):
    response = self.client.post('/', data={'item_text':'A new list item'})
    self.assertIn('A new list item', response.content.decode())
```

```terminal
(py3) $ python manage.py test
Creating test database for alias 'default'...
F.
======================================================================
FAIL: test_can_save_a_POST_request (lists.tests.HomePageTest)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "/Users/andrewcaffey/Documents/Projects/django-test/superlists/lists/tests.py", line 11, in test_can_save_a_POST_request
    self.assertIn('A new list item', response.content.decode())
AssertionError: 'A new list item' not found in '<html>\n    <head>\n        <title>To-Do lists</title>\n    </head>\n    <body>\n        <h1>Your To-Do list</h1>\n\t\t    <form method="POST">\n\t\t        <input id="id_new_item" placeholder="Enter a to-do item" />\n\t\t        <input type=\'hidden\' name=\'csrfmiddlewaretoken\' value=\'tbPa4MSp8R7ItrmqP5EWjbZFqYan0GtEetdIymi92wDTLwkiqyk4IqhbiOWoq2xb\' />\n\t\t    </form>\n\t\t        <table id="id_list_table">\n\t\t    \t</table>\n\t\t    \n    </body>\n</html>'
```

Now we can modify `views.py` to handle a post request: 

*lists/views.py*

```python
from django.http import HttpResponse
from django.shortcuts import render

def home_page(request): 
    if request.method == 'POST':
        return  
    return render(request, 'home.html')
```

**TEST:** passes

Our test checks for `A new list item` in the `item_text` of the HTTP response, so this passes the test. The next step is to add this text to the table so it displays on the page. We can use {% raw  %}{{ ... }}{% endraw %}  notation to include a Python object in a template. Our table can be written like this: 

```html
<table id="id_list_table">
    <tr><td>{% raw  %}{{ new_item_text }}{% endraw %}</td></tr>
</table>
```

Now we can rewrite the test to check if we are still using the template (we are not though, because `home_page` returns `HttpResponse(request.POST['item_text'])` when the request method is POST). 

*lists/tests.py*

```python
    def test_can_save_a_POST_request(self):
        response  = self.client.post('/', data={'item_text':'A new list item'})
        self.assertIn('A new list item', repsonse.content.decode())
        self.assertTemplateUsed(response, 'home.html')
```

**TEST:** failed: No templates used to render the response

Once again we will rewrite the view. This time we will pass the POST parameter to the template by passing it (the POST parameter, or data) as the third argument of the `render` method. 

*lists/views.py*

```python
def home_page(request):
    return render(request, 'home.html', {
        'new_item_text': request.POST['item_text'],
    })
```

**TEST:** failed

```terminal
(py3) >>python manage.py test
[...]
django.utils.datastructures.MultiValueDictKeyError: "'item_text'"
```

We also need to rewrite `views.py`:

*lists/views.py*

```python
def home_page(request):
    return render(request, 'home.html', {
        'new_item_text': request.POST.get('item_text', ''),
    })
```

Here's an explanation of `dict.get()` from the [Python documentation](https://docs.python.org/3/library/stdtypes.html#dict.get):

> `get(key[, default])`: 
Return the value for key if key is in the dictionary, else default. If default is not given, it defaults to None, so that this method never raises a KeyError.

**TEST:** unit test pass, functional test fails: 

```terminal 
(py3) $ python functional_tests.py
F
======================================================================
FAIL: test_can_start_a_list_and_retrieve_it_later (__main__.NewVisitorTest)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "functional_tests.py", line 41, in test_can_start_a_list_and_retrieve_it_later
    self.assertIn('1: Buy peacock feathers', [row.text for row in rows])
AssertionError: '1: Buy peacock feathers' not found in ['Buy peacock feathers']
```

Fixing this is simple, we just need to add `1: ` in before the item:  

*lists/templates/home.html*
```html
    <tr><td>1: {{ new_item_text }}</td></tr>
```

## Red/Green/Refactor and Triangulation 

Here's another helpful passage from the book: 

The unit-test/code cycle is sometimes taught as Red, Green, Refactor:

- Start by writing a unit test which fails (Red).
- Write the simplest possible code to get it to pass (Green), even if that means cheating.
- Refactor to get to better code that makes more sense.

So what do we do during the Refactor stage? What justifies moving from an implementation where we "cheat" to one we’re happy with?

One methodology is eliminate duplication: if your test uses a magic constant (like the "1:" in front of our list item), and your application code also uses it, that counts as duplication, so it justifies refactoring. Removing the magic constant from the application code usually means you have to stop cheating.

I find that leaves things a little too vague, so I usually like to use a second technique, which is called triangulation: if your tests let you get away with writing "cheating" code that you’re not happy with, like returning a magic constant, write another test that forces you to write some better code. That’s what we’re doing when we extend the FT to check that we get a "2:" when inputting a second list item.

*functional_tests.py*

```python
    #user adds another item
    inputbox = self.browser.find_element_by_id('id_new_item')
    inputbox.send_keys('Use peacock feathers to make a fly')
    inputbox.send_keys(Keys.ENTER)
    time.sleep(1)

    #page updats, both items show on the list
    table = self.browser.find_element_by_id('id_list_table')
    rows = table.find_elements_by_tag_name('tr')
    self.assertIn('1: Buy peacock feathers', [row.text for row in rows])
    self.assertIn(
        '2: Use peacock feathers to make a fly',
        [row.text for row in rows]
    )

    #unique url displays
    self.fail('Finish the test!')

    #user goes to the unique url for their list
    [...]
```

**TEST:** failed

*lists/functional_tests.py*

```
(py3) >>python functional_tests.py
F
======================================================================
FAIL: test_can_start_a_list_and_retrieve_it_later (__main__.NewVisitorTest)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "functional_tests.py", line 54, in test_can_start_a_list_and_retrieve_it_later
    self.assertIn('1: Buy peacock feathers', [row.text for row in rows])
AssertionError: '1: Buy peacock feathers' not found in ['1: Use peacock feathers to make a fly']
```

**GIT:** commit

Next we add a helper function to `functional_tests.py`: 

*functional_tests.py*

```python
    def check_for_row_in_list_table(self, row_text):
        table = self.browser.find_element_by_id('id_list_table')
        rows = table.find_elements_by_tag_name('tr')
        self.assertIn(row_text, [row.text for row in rows])
```

Now we can rewrite `functional_tests.py` to make use of `check_for_row_in_list_table`: 

*functional_tests.py*

```python
        #user hits ENTER, updates page, list item displays
        inputbox.send_keys(Keys.ENTER)
        time.sleep(1)
        self.check_for_row_in_list_table('1: Buy peacock feathers')

        #user adds another item in the text box
        inputbox = self.browser.find_element_by_id('id_new_item')
        inputbox.send_keys('Use peacock feathers to make a fly')
        inputbox.send_keys(Keys.ENTER)
        time.sleep(1)

        #page update, shows both items in list
        self.check_for_row_in_list_table('1: Buy peacock feathers')
        self.check_for_row_in_list_table('2: Use peacock feathers to make a fly')

        [...]
```

**TEST:** functional test still fails:

```terminal
(py3) >>python functional_tests.py
[...]
    self.assertIn('1: Buy peacock feathers', [row.text for row in rows])
AssertionError: '1: Buy peacock feathers' not found in ['1: Use peacock feathers to make a fly']

```

**GIT:** commit

## The Django ORM and Our First Model

> An Object-Relational Mapper (ORM) is a layer of abstraction for data stored in a database with tables, rows, and columns. It lets us work with databases using familiar object-oriented metaphors which work well with code. Classes map to database tables, attributes map to columns, and an individual instance of the class represents a row of data in the database.

> Django comes with an excellent ORM, and writing a unit test that uses it is actually an excellent way of learning it, since it exercises code by specifying how we want it to work.

First we make a test: 

*lists/tests.py*

```python 
from lists.models import Item

class ItemModelTest(TestCase):
    
    def test_saving_and_retrieving_items(self):
        first_item = Item()
        first_item.text = 'The first (ever) list item'
        frist_item.save()

        second_item = Item()
        second_item.text = 'Item the second'
        second_item.save()

        saved_items = Item.objects.all()
        self.assertEqual(saved_items.count(), 2)

        first_saved_item = saved_items[0]
        second_saved_item = saved_items[1]
        self.assertEqual(first_saved_item.text = 'The first (ever) list item')
        self.assertEqual(second_saved_item.text, 'Item the second')
```

These test will be redone later on, the way of doing it here is to help introduce the idea of ORM in Django. 

**TEST:** fail: cannot import name 'Item'

To make the test pass, we have to create the `Item` class in `lists/models.py`:

*lists/models.py*

```python
from django.db import models

class Item(object):
    pass
```

**TEST:**     failed: first_item.save(), AttributeError: 'Item' object has no attribute 'save'

*lists/models.py*

```python
from django.db import models

class Item(models.Model):
    pass
```

## First Database Migration

**TEST:** failed: django.db.utils.OperationalError: no such table: lists_item

In Django, the ORM’s job is to model the database, but there’s a second system that’s in charge of actually building the database called migrations. Its job is to give you the ability to add and remove tables and columns, based on changes you make to your models.py files.

One way to think of it is as a version control system for your database. As we’ll see later, it comes in particularly useful when we need to upgrade a database that’s deployed on a live server.

For now all we need to know is how to build our first database migration, which we do using the `makemigrations` command:

```terminal
(py3) $ python manage.py makemigrations
Migrations for 'lists':
  lists/migrations/0001_initial.py:
    - Create model Item
(py3) $ ls lists/migrations
0001_initial.py __init__.py __pycache__
```
Let's take a look at `0001_inital.py`:

```python
# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-03-05 20:07
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
    ]
```

**TEST:**

```terminal
(py3) >>python manage.py test lists
Creating test database for alias 'default'...
..E
======================================================================
ERROR: test_saving_and_retrieving_items (lists.tests.ItemModelTest)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "/Users/andrewcaffey/Documents/Projects/django-test/superlists/lists/tests.py", line 31, in test_saving_and_retrieving_items
    self.assertEqual(first_saved_item.text, 'The first (ever) list item')
AttributeError: 'Item' object has no attribute 'text'
```
>  If you’re new to Python, you might have been surprised we were allowed to assign the .text attribute at all. In something like Java, that would probably give you a compilation error. Python is more relaxed about things like that.


Classes that inherit from models.Model map to tables in the database. By default they get an auto-generated id attribute, which will be a primary key column in the database, but you have to define any other columns you want explicitly. Here’s how we set up a text field:

*lists/models.py*

```python
class Item(models.Model):
    text = models.TextField()
```

**TEST:** failed

```terminal
(py3) $ python manage.py test lists
[...]
django.db.utils.OperationalError: no such column: lists_item.text
```

This test fails because we have added a field in the database (by including `text = models.TextField()` in the `Item` class), but didn't create a migration after making this change. Let's make the migration: 

```terminal
(py3) $ python manage.py makemigrations
You are trying to add a non-nullable field 'text' to item without a default; we can't do that (the database needs something to populate existing rows).
Please select a fix:
 1) Provide a one-off default now (will be set on all existing rows with a null value for this column)
 2) Quit, and let me add a default in models.py
Select an option: 2
```
We have to go back to `models.py` and add a default value for our text field: 

*lists/models.py*

```python
class Item(models.Model):
    text = models.TextField(default='')
```

```terminal
(py3) $ python manage.py makemigrations
Migrations for 'lists':
  lists/migrations/0002_item_text.py:
    - Add field text to item
```

**TEST:** pass: the .text attribute on our model objects is now recognised as a special attribute, so it does get saved to the database, and the tests pass

**GIT:** commit

## Saving the POST to the Database

*lists/tests.py*

```python
    def test_can_save_a_POST_request(self): 
        response = self.client.post('/', data={'item_text': 'A new list item'})
        
        self.assertEqual(Item.objects.count(), 1)
        new_item = Item.objects.first()
        self.assertEqual(new_item.text, 'A new list item')

        self.assertIn('A new list item', response.content.decode())
        self.assertTemplateUsed(response, 'home.html')
```

Note: `objects.first()` has the same result as `objects.all()[0]`, and `objects.count()` is the same as `objects.all().count()`. The above test needs some refactoring. 

*lists/views.py*

```terminal
(py3) $ python manage.py test lists
    self.assertEqual(Item.objects.count(), 1)
AssertionError: 0 != 1
```

Here's what `views.py` looks like now:

```python
from django.http import HttpResponse
from django.shortcuts import render

def home_page(request):
    return render(request, 'home.html', {
        'new_item_text': request.POST.get('item_text', '') 
        })
```

And here is how we change it to incorporate the `Item` object: 

```python
from django.http import HttpResponse
from django.shortcuts import render

def home_page(request):
    item = Item()
    item.text = request.POST.get('item_text', '')
    item.save()

    return render(request, 'home.html', {
        'new_item_text': request.POST.get('item_text', ''), 
    })
```

And finally we can simply exchange `request.POST.get('item_text', '')` for `item.text`: 

```python
from django.http import HttpResponse
from django.shortcuts import render

def home_page(request):
    item = Item()
    item.text = request.POST.get('item_text', '')
    item.save()

    return render(request, 'home.html', {
        'new_item_text': item.text 
    })
```

Here's a list of what we want to accomplish: 

- Don’t save blank items for every request
- Code smell: POST test is too long?
- Display multiple items in the table
- Support more than one list!

*lists/tests.py*

class HomePageTest(TestCase):
    [...]

    def test_only_saves_items_when_necessary(self):
        self.client.get('/')
        self.assertEqual(Item.objects.count(), 0)
```

**TEST:** 

```terminal
(py3) $ python manage.py test lists
    self.assertEqual(Item.objects.count(), 0)
AssertionError: 1 != 0
```

*lists/views.py*

```python
def home_page(request):
    if request.method == 'POST':
        new_item_text= request.POST['item_text']
        Item.objects.create(text=new_item_text)
    else:
        new_item_text = ''

    return render(requests, 'home.html', {
            'new_item_text': new_item_text, 
    })
```

**TEST:** passes

## Redirect After a POST

[Always redirect after a post](https://en.wikipedia.org/wiki/Post/Redirect/Get). 

We want to change `lists/tests.py`:

```python

    def test_can_save_a_POST_request(self):
        response = self.client.post('/', data={'item_text': 'A new list item'})

        self.assertEqual(Item.objects.count(), 1)
        new_item = Item.objects.first()
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response['location'], '/')
```

**TEST:** 

```terminal
(py3) $ python manage.py test lists
[...]
    self.assertEqual(response.status_code, 302)
AssertionError: 200 != 302
```

Next we change `views.py` to include a redirect:

*lists/views.py*

```python
from django.shortcuts import redirect, render
from lists.models import Item

def home_page(request):
    if request.method == 'POST':
        Item.objects.create(text=request.POST['item_text'])
        return redirect('/')

    return render(request, 'home.html')
```

**TEST:** passes

## Better Unit Testing Practice: Each Test Should Test One Thing

*lists/tests.py*

```python
    def test_can_save_a_POST_request(self):
        self.client.post('/', data={'item_text': 'A new lists item'})

        self.assertEqual(Item.objects.count(), 1)
        new_item = Item.objects.first()
        self.assertEqual(new_item.text, 'A new list item')

    def test_redirects_after_POST(self):
        response = self.client.post('/', data={'item_text':'A new list item'})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response['location'], '/')
``` 

Each test now tests one thing. 

**TEST:** passes

## Rendering Items in the Template

Next on our list is to display items in the table. Let's add a test to check for multiple items in the list: 

*lists/tests.py*

```python
class HomePageTest(TestCase):
    [...]

    def test_displays_all_list_items(self):
        Item.objects.create(text='itemey 1')
        Item.objects.create(text='itemey 2')

        response = self.client.get('/')

        self.assertIn('itemey 1', response.content.decode())
        self.assertIn('itemey 2', response.content.decode())
```

Next we need to add a loop with Django's templating tags and replace `new_item_text` with `items.text`. We will define `items` to be `Item.objects.all()` in `views.py` below: 

*lists/templates/home.html*

```html
<table id="ide_list_table">
    {% raw  %}{% for item in items %}{% endraw %}
        <tr><td>1: {% raw  %}{{ item.text }}{% endraw %}</td></tr>
    {% raw  %}{% endfor %}{% endraw %}
</table>
```

This alone is not enough to make the template pass. We need to pass in an `items` value from `views.py`:

*lists/views.py*

```python
def home_page(request):
    if request.method == 'POST':
        Item.objects.create(text=request.POST['item_text'])
        return redirect('/')

    items = Item.objects.all()
    return render(request, 'home.html', {'items': items})
```

**TEST:** unit test passes, functional test fails

```terminal
(py3) $ python functional_tests.py
[...]
    self.assertIn('To-Do', self.browser.title)
AssertionError: 'To-Do' not found in 'OperationalError at /'
```

If we navigate to `localhost:8000`, we can see that the error message reads: `no such table: lists_item`. This sounds like there is a problem with the database. 

## Creating Our Production Database with migrate

But how come everything worked fine in the unit tests? This is because Django creates a special test database for unit tests; it’s one of the magical things that Django’s TestCase does.

To set up our "real" database, we need to create it. SQLite databases are just a file on disk, and you’ll see in settings.py that Django, by default, will just put it in a file called db.sqlite3 in the base project directory:

*superlists/settings.py*

```python 
[...]
# Database
# https://docs.djangoproject.com/en/1.10/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
```

We’ve told Django everything it needs to create the database, first via models.py and then when we created the migrations file. To actually apply it to creating a real database, we use another Django Swiss Army knife manage.py command, `migrate`:

```terminal
(py3) $ python manage.py migrate
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, lists, sessions
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  Applying admin.0001_initial... OK
  Applying admin.0002_logentry_remove_auto_add... OK
  Applying contenttypes.0002_remove_content_type_name... OK
  Applying auth.0002_alter_permission_name_max_length... OK
  Applying auth.0003_alter_user_email_max_length... OK
  Applying auth.0004_alter_user_username_opts... OK
  Applying auth.0005_alter_user_last_login_null... OK
  Applying auth.0006_require_contenttypes_0002... OK
  Applying auth.0007_alter_validators_add_error_messages... OK
  Applying auth.0008_alter_user_username_max_length... OK
  Applying lists.0001_initial... OK
  Applying lists.0002_item_text... OK
  Applying sessions.0001_initial... OK
```

Now we can run the functional test again: 

**TEST:** failed: AssertionError: '2: Use peacock feathers to make a fly' not found in ['1: Buy
peacock feathers', '1: Use peacock feathers to make a fly']

To fix list numbering we can simply add a `forloop.counter` template tag: 

```html
    {% raw %}{% for item in items %}
        <tr><td>{{ forloop.counter }}: {{ item.text }}</td></tr>
    {% endfor %}{% endraw %}
```

This works, but the list items from the test remain on the list. We need a way to clean up the database after each test. For now, we can simply delete and then recreate the database: 

```terminal
(py3) $ rm db.sqlite3
(py3) $ python manage.py migrate --noinput
```

**GIT:** commit

# Chapter 6: Improving Functional Tests: Ensuring Isolation and Removing Voodoo Sleeps

This section fixes two issues: test runs interfere with each other, and we use arbitrary `time.sleep` waiting periods throughout the code. 

## Ensuring Test Isolation in Functional Tests

When we run unit tests, the Django test runner automatically creates a brand new test database (separate from the real one), which it can safely reset before each individual test is run, and then throw away at the end. But our functional tests currently run against the "real" database, db.sqlite3.

Since Django 1.4 though, there’s a new class called `LiveServerTestCase` which will automatically create a test database (just like in a unit test run), and start up a development server for the functional tests to run against. Although as a tool it has some limitations which we’ll need to work around later, it’s dead useful at this stage, so let’s check it out.

```terminal
(py3) $ mkdir functional_tests
(py3) $ touch functional_tests/__init__.py
```
We can move this folder to a better location: 

```terminal
(py3) $ git mv functional_tests.py functional_tests/tests.py
(py3) $ (py3) >>tree
.
├── db.sqlite3
├── functional_tests
│   ├── __init__.py
│   └── tests.py
├── geckodriver.log
├── lists
│   ├── __init__.py
│   ├── __pycache__
│   │   ├── __init__.cpython-36.pyc
│   │   ├── admin.cpython-36.pyc
│   │   ├── models.cpython-36.pyc
│   │   ├── tests.cpython-36.pyc
│   │   └── views.cpython-36.pyc
│   ├── admin.py
│   ├── apps.py
│   ├── migrations
│   │   ├── 0001_initial.py
│   │   ├── 0002_item_text.py
│   │   ├── __init__.py
│   │   └── __pycache__
│   │       ├── 0001_initial.cpython-36.pyc
│   │       ├── 0002_item_text.cpython-36.pyc
│   │       └── __init__.cpython-36.pyc
│   ├── models.py
│   ├── templates
│   │   └── home.html
│   ├── tests.py
│   └── views.py
├── manage.py
└── superlists
    ├── __init__.py
    ├── __pycache__
    │   ├── __init__.cpython-36.pyc
    │   ├── settings.cpython-36.pyc
    │   ├── urls.cpython-36.pyc
    │   └── wsgi.cpython-36.pyc
    ├── settings.py
    ├── urls.py
    └── wsgi.py

8 directories, 31 files
```
We can now update `functional_tests/tests.py`:

*functional_tests/tests.py*

```python
from django.test import LiveServerTestCase
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

class NewVisitorTest(LiveServerTestCase):

    def setUp(eslf):
        [...]
```

Instead of hardcoding the visit to localhost port 8000, LiveServerTestCase gives us an attribute called live_server_url:

*functional_tests/tests.py*

```python
    def test_can_start_a_list_and_retrieve_it_later(self):
        #user visits site
        self.browser.get(self.live_server_url)
```

Now we can run our functional test by sing the Django test runner:

```terminal
(py3) $ python manage.py test functional_tests
```

**TEST:** passes (finish the test!)

**GIT:** add `functional_tests` and commit

Next we can get ride of our explicit waits in the tests (`time.sleep`) by rewriting `check_for_new_row_in_list_table`:

*functional_tests/tests.py*

```python
from selenium.common.exceptions import WebDriverException

MAX_WAIT = 10
[...]


    def wait_for_row_in_list_table(self, row_text):
        start_time = time.time()
        while True:
            try:
                table = self.browser.find_element_by_id('id_list_table')

                rows = table.find_elements_by_tag_name('tr')
                self.assertIn(row_text, [row.text for row in rows])
                return
            except (AssertionError, WebDriverException) as e:
                if time.time() - start_time > MAX_WAIT:
                    raise e
                time.sleep(0.5)
```

Finally we can refactor the rest of *functional_tests/tests.py* to make use of this new function: 

```python
[...]
#user hits enter and page updates
inputbox.send_keys(Keys.ENTER)
self.wait_for_row_in_list_table('1: Buy peacock feathers')

#user enters another item
inputbox = self.browser.find_element_by_id('id_new_item')
inputbox.send_keys('Use peacock feather to make a fly')
inputbox.send_keys(Keys.ENTER)

self.wait_for_row_in_list_table('2: Use peacock feathers to make a fly')
self.wait_for_row_in_list_table('1: Buy peacock feathers')
[...]
```

**TEST:** passes

# Chapter 7: Working Incrementally

## REST (ish) design

REST suggests that we have a URL structure that matches our data structure, in this case lists and list items. Each list can have its own URL:

```html
/lists/<list identifier>/
```

To create a brand new list, we’ll have a special URL that accepts POST requests:

```html
/lists/new
```

To add a new item to an existing list, we’ll have a separate URL, to which we can send POST requests:

```html
/lists/<list identifier>/add_item
```

Our scratchpad for this chapter looks something like this:

- Get FTs to clean up after themselves
- Adjust model so that items are associated with different lists
- Add unique URLs for each list
- Add a URL for creating a new list via POST
- Add URLs for adding a new item to an existing list via POST

First we need to test that the first user gets their own unique URL for the list they create, and then we have a second user come along. Here's how this would look in out functional test: 

*functional_tests/tests.py*

```python
    def test_multiple_users_can_start_lists_at_different_urls(self):
        self.browser.get(self.live_server_url)
        inputbox = self.browser.find_element_by_id('id_new_item')
        inputbox.send_keys('Buy peacock feathers')
        inputbox.send_keys(Keys.ENTER)
        self.wait_for_row_in_list_table('1: Buy peacock feathers')

        #user sees unique URL
        edith_list_url = self.browser.current_url
        self.assertRegex(edith_list_url, '/lists/.+')

        #new user comes along
        #we close the first browser and open a second 
        self.browser.quit()
        self.browser = webdriver.Firefox()

        #second user visits the home page and doesn't see anything about our first user's list
        self.browser.get(self.live_server_url)
        page_text = self.browser.find_element_by_tag_name('body').text
        self.assertNotIn('Buy peacock feathers', page_text)
        self.assertNotIn('make a fly', page_text)

        #second user starts a new list by entering a new item
        inputbox = self.browser.find_element_by_id('id_new_item')
        inputbox.send_keys('Buy milk')
        inputbox.send_keys(Keys.ENTER)
        self.wait_for_row_in_list_table('1: Buy milk')

        #user 2 does not see anything related to user 1's list
        page_text = self.browser.find_element_by_tag_name('body').text
        self.assertNotIn('Buy peacock feathers', page_text)
        self.assertIn('Buy milk', page_text)
```

**TEST:** fails

```terminal
(py3) $ python manage.py test functional_tests
Creating test database for alias 'default'...
.F
======================================================================
FAIL: test_multiple_users_can_start_lists_at_different_urls (functional_tests.tests.NewVisitorTest)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "/Users/andrewcaffey/Documents/Projects/django-test/superlists/functional_tests/tests.py", line 89, in test_multiple_users_can_start_lists_at_different_urls
    self.assertRegex(edith_list_url, '/lists/.+')
AssertionError: Regex didn't match: '/lists/.+' not found in 'http://localhost:8081/'
```
**GIT:** commit

No we can change the test to make sure that the redirect goes to a different address:

```python
    def test_redirects_after_POST(self):
        response = self.client.post('/', data={'item_text': 'A new list item'})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response['location'], '/lists/the-only-list-in-the-world/')
```

This is not the URL we will ultimately want to use, but it is unique, so we start with it. 

**TEST:** unit test fails

```terminal
(py3) $ python manage.py test lists
    self.assertEqual(response['location'], '/lists/the-only-list-in-the-world/')
AssertionError: '/' != '/lists/the-only-list-in-the-world/'
```

We can get this test to pass by changing our view:

*lists/views.py*

```python
def home_page(request):
    if request.method == 'POST':
        Item.objects.create(text=request.POST['item_text'])
        return redirect('/lists/the-only-list-in-the-world/')

    items = Item.objects.all()
    return render(request, 'home.html', {'items': items})
```

**TEST:** failed

```terminal
selenium.common.exceptions.NoSuchElementException: Message: Unable to locate
element: [id="id_list_table"]
```
Next we can try to fix this by building a URL for our `/lists/the-only-list-in-the-world/` URL. 

*lists/tests.py*

```python
class ListViewTest(TestCase):

    def test_displays_all_items(self):
        Item.objects.create(text='itemey 1')
        Item.objects.create(text='itemey 2')

        response = self.client.get('/')

        self.assertContains(response, 'itemey 1')
        self.assertContains(response, 'itemey 2')
```

**TEST:** failed

```terminal 
[...]
AssertionError: 404 != 200 : Couldn't retrieve content: Response code was 404 (expected 200)
```

This error message tells us that the URL we are requesting does not exist. The next step is to add this individual URL: 

*superlists/urls.py*

```python
urlpatterns = [
    url(r'^$', views.home_page, name='home'), 
    url(r'^lists/the-only-list-in-the-world/$', views.view_list, name='view_list'), 
]
```

**TEST:** failed: `AttributeError: module 'lists.views' has no attribute 'view_list'`

Next, we define a new view function: 

**lists/views.py*

```python
def view_list(request):
    pass
```

**TEST:** failed

```terminal
ValueError: The view lists.views.view_list didn't return an HttpResponse object. It returned None instead.
```

Next we fill out the body of `view_list`: 

*lists/views.py* 

```python
def view_list(request):
    items = Item.objects.all()
    return render(request, 'home.html', {'items': items})
```

**TEST:** unit test passes, functional test fails

```terminal
[...]
AssertionError: '2: Use peacock feathers to make a fly' not found in ['1: Buy peacock feathers']
[...]
AssertionError: 'Buy peacock feathers' unexpectedly found in 'Your To-Do list\n1: Buy peacock feathers'
```

The problem now is that the `home.html` input form does not specify an explicit URL to post to. We can change this by adding an `actiion` attribute to the `form`:

*lists/templates/home.html*

```html
<form method="POST" action="/">
```

Now we find that we are only failing on of the functional tests:

**TEST:**

```terminal
[...]
AssertionError: 'Buy peacock feathers' unexpectedly found in 'Your To-Do list\n1: Buy peacock feathers'
```

## Another Small Step: A Separate Template for Viewing Lists

Let’s add a new test to check that it’s using a different template:
