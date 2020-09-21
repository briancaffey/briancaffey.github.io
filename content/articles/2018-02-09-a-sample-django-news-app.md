---

layout: post
title: Detailed setup of a mini Django News App project with Bootstrap, AJAX, Celery and RabbitMQ
date: 2018-02-09
comments: true

---

The Django project started in the news room. This article will offer detailed documentation of the setup process for a simple news application. This project was given as a takehome assignment for another Django position I am interview for. I won't focus on any production considerations as this is only a demo project that is supposed to work locally. 

For reference, the code is on [this Github repository](https://github.com/briancaffey/django-news-app).

## Requirements

This project included some interesting requirements that were outside of the scope of simple apps I have put together with Django. Two import ones were page caching and using celery to execute tasks asynchronously. I also set up a unit tests and functional tests and tested the core functionalities of the application. Here are some the basic requirements:

- Implement a news model with fields such as title, body, content, author, etc.
- Display published posts on a page styled with Bootstrap
- Implement and admin page that allows staff to create and publish posts
- Cache the public facing home page
- On the home page use jQuery to poll a URL for updates, and refresh the page if an update is found. 
- Add a button on the public facing page that when pressed launches a celery task that send an email to the site admin.

## Release Notes and code snippets

Here's a quick description of the design decisions I made for the various specifications with code snippets: 

#### Post Model

For the Post model I decided to use two DateTimeFields: `updated` and `timestamp`. `timestamp` is the public-facing time that shows on each article. `updated` is changed when a publish or unpublish action is taken on a Post. 

When a `POST` request is made to the `toggle_publish` view, three things happen:

- The Post's `published` field is toggled and the Post's `updated` field is set to the current time. 

- The only record in `LastUpdate` is updated. This model only contains a `DateTimeField` also called `updated`. 

- The cache is cleared, clearing any pages cached from the `home` view. 

#### Home Page

For the public facing home page, I return a list of Posts where `published` is set to `True` and also return a UNIX time epoch of the Post with the most recent `updated` field. 

*views.py*

```python
@cache_page(None)
def home(request):
    """
    This is the public view that displays only published posts. 
    The view also returns a UNIX timestamp of the most recently updated post.
    This timestamp is compared with the `LastUpdate` value to determine when the page should be refreshed.
    Every 5 seconds, the `latest` timestamp is compared with the `LastUpdate` timestamp. 
    If `LastUpdate` is greater that `latest`, this implies that a Post has either been published or unpublished.
    """

    posts = Post.objects.filter(published=True)
    latest = 0
    if posts:
        latest = Post.objects.latest('updated').unix_time()

    return render(request, 'posts/home.html', {'posts':posts, 'latest':latest})
```

#### AJAX poll on home page

I use an AJAX poll that returns a JSON response containing the `updated` field of `LastUpdate` as a UNIX time epoch called `latest`. I compare this UNIX time epoch with the the UNIX time epoch returned with context data in `home`. If the `latest` value is greater than the the UNIX time stamp of the most recently updated article, then the page is reloaded. At this point, the cache will have been cleared by `toggle_publish`, and the new Posts are displayed. 

*home.html* (AJAX poll)

```html
<script>
    console.log("working")
    poll = function() {
        $.ajax({
        url: '/refresh',
        dataType: 'json',
        type: 'get',
        success: function(data) {
            var latest = parseInt(data.latest)
            var latest_local = parseInt($("#last").attr('data'))
            if (latest > latest_local + 2){
                location.reload()
            }
        },
        error: function() {
            console.log('The refresh poll was not successful');
        }
        });
    },
    pollInterval = setInterval(function() {
        poll();
        }, 5000);
</script>
```

*views.py* (the view that the AJAX poll requests; return JSON)

```python
def refresh(request):
    """
    This is the URL that is polled by the public-facing page.
    It returns a UNIX timestamp of the last time an article was published or unpublished. 
    This timestamp comes from the `LastUpdated`, a table that stores and updates only one row with one datetime column.
    Publishing and unpublishing are the only two actions that clear the cached homepage. 
    When the returned UNIX timestamp is greater than the UNIX timestamp of the most recently updated article,
    The page is refreshed with `location.reload()`.
    """
    
    t, created = LastUpdate.objects.get_or_create(id=1)
    if created:
        t.save()
        t = t.unix_time()
    else:
        t = t.unix_time()
    latest = int(t) - 2
    return JsonResponse({'latest':int(latest)})
```

#### Email admin through a celery task

The email feature is functional, but the button returns a JSON response that says "successful" if the message was sent to celery. My plan was to make another AJAX call and then updated the `Email Admin` link to say `Your email was sent.` if it the task was sent the messaging service. 

For details on how celery can be set up with a Django project, I reference on of my favorite Django blogs, [simpleisbetterthancomplex.com](https://simpleisbetterthancomplex.com/tutorial/2017/08/20/how-to-use-celery-with-django.html). This article shows how to set up celery in a Django project and my set up almost exactly mirrors this setup, but my celery task simply sends an email.

#### Admin Page

The admin page contains a list of all articles. Each article contains a link to manage publish settings. This calls the `toggle_publish` page that displays the selected article and contains a button that says `Publish` or `Unpublish` depending on the value of the Post's `published` value. 

#### Cache

For caching I chose the memcached backend. Other options included using file caching and database caching, but this seemed to be the simplest approach. I used a decorator function to cache the results of the `home` view. 

Here are some additional notes on how I used caching in this project:

- To cache a page from the `home` view, I used a decorator: `from django.views.decorators.cache import cache_page`:

```python
@cache_page(None)
def home(request):
    [...]
```

- We pass the argument of `None` so that the page cache does not expire; we will manually clear the cache when a staff member publishes an article. 

- The first time we access the `home` view, we will see our print statement, in subsequent requests, the cached page will be used and we will not see the print statement. 

In order for caching to work we need to add the following to `settings.py`:

```python
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
        'LOCATION': '127.0.0.1:11211',
    }
}
```

Next, we need to install the following packages:

```
(virtualenv) $ pip install memcache 
# pacman -S memcached
# systemctl start memcached
# systemctl enable memcached
```

##### Clearing the cache

To clear the cache, we can simply do the following in a view: 

```python
from django.core.cache import cache

@login_required
def toggle_publish(request,id):
    instance = get_object_or_404(Post, id=id)

    if request.method=="POST":
        instance.published = not instance.published
        instance.save()

        t = LastUpdate.objects.all().first()
        t.updated = instance.updated
        t.save()

        cache.clear()
        return redirect('posts:home')

    context = {'post':instance}

    return render(request, 'posts/publish.html', context)
```

`cache.clear()` clears the cache, and the `home` view is regenerated from the Queryset and template rather the being served directly from the cache. This newly generated page is then saved to the cache and used on subsequent calls to `home` until the cache is cleared again. 

## Basic setup

Here are the first steps need to set up the project correctly:

First, let's start with creating a virtual environment: 

```
$ virtualenv -p python3 virtualenv
```

Next, let's activate the virtual environment with: 

```
$ source virtualenv/bin/activate
```

Next, let's install `django` and `selenium`: 

```
(virtualenv) $ pip install django selenium
```

Next, let's start our app:

```
(virtualenv) $ django-admin.py startproject news .
```

The `.` will start the project in the current environment. Let's take a look at the directory structure: 

```
(virtualenv) $ tree -L 2
 $ tree -L 2
.
├── manage.py
├── news
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── virtualenv
    ├── bin
    ├── include
    ├── lib
    ├── pip-selfcheck.json
    └── selenium
```

At this point, we can start the local server: 

```
(virtualenv) $ python manage.py runserver
Performing system checks...

System check identified no issues (0 silenced).

You have 14 unapplied migration(s). Your project may not work properly until you apply the migrations for app(s): admin, auth, contenttypes, sessions.
Run 'python manage.py migrate' to apply them.

February 10, 2018 - 02:16:47
Django version 2.0.2, using settings 'news.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

Now we should see the new Django 2 startup screen in our browser if we navigate to [http://127.0.0.1:8000/]():

![png](/static/news/django2.png)

## Testing

I had a few difficulties setting up selenium testing with this projects. Here the `functional_tests.py` file that is hopefully configured correctly:

**functional_tests.py**

```python
from selenium import webdriver
from django.conf import settings

import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'news.settings')

from django.test import LiveServerTestCase
import unittest
import time
import factory

from django.contrib.auth import get_user_model
from selenium import webdriver

User = get_user_model()

class UserFactory(factory.DjangoModelFactory):
    """This class sets up a staff user that we can use for testing using factory"""

    class Meta:
        model = User

    email = 'brian@djangonews.com'
    username = 'brian1'
    password = factory.PostGenerationMethodCall('set_password', 'qwer1234')

    is_superuser = True
    is_staff = True
    is_active = True

class NewsAppTest(LiveServerTestCase):
    """Main Tests"""

    def setUp(self):
        self.browser = webdriver.Firefox()
        self.domain = 'http://127.0.0.1:8081'
        self.user = UserFactory.create()

    def tearDown(self):
        self.browser.quit()


    def test_page_title_is_correct(self):
        self.browser.get(self.domain)
        self.assertIn('Django News', self.browser.title)


    def test_staff_can_create_and_publish_article(self):
        """
        Tests the core functionality of a staff member loging in, creating an article, then publishing that article
        """

        # staff logs into admin page
        self.browser.get(self.domain+"/admin")
        self.browser.find_element_by_id('id_username').send_keys('brian1')
        self.browser.find_element_by_id('id_password').send_keys('qwer1234')
        self.browser.find_element_by_class_name('submit-row').click()

        # navigate to homepage
        self.browser.get(self.domain)
        time.sleep(2)

        # navigate to new article page and write sample article
        self.browser.find_element_by_id('new-article').click()
        html = str(self.browser.page_source.encode('utf-8'))
        self.assertIn('Write your Django News article here', html)
        self.browser.find_element_by_id('id_title').send_keys('testing with selenium')
        self.browser.find_element_by_id('id_content').send_keys('about testing with selenium')
        self.browser.find_element_by_id('id_submit').click()
        html = str(self.browser.page_source.encode('utf-8'))
        self.assertIn('publish settings', html)

        # go back to home page and check that the article is not displayed
        self.browser.get(self.domain)
        html = str(self.browser.page_source.encode('utf-8'))
        self.assertNotIn('testing with selenium', html)

        self.browser.back()

        self.browser.find_element_by_id('toggle-publish').click()
        html = str(self.browser.page_source.encode('utf-8'))
        self.assertIn('testing with selenium', html)

    def test_public_page_reloads_when_article_is_published(self):
        browser2 = webdriver.Firefox()
        browser2.get(self.domain)
        html = browser2.page_source
        self.test_staff_can_create_and_publish_article()
        time.sleep(2)
        browser2.get(self.domain)
        html_after_publish = browser2.page_source
        self.assertNotEqual(html, html_after_publish)
        browser2.quit()

if __name__ == "__main__":
    unittest.main(warnings="ignore")
```

I used the package called `factory_boy` to setup create a user that I could use in my test. This project didn't include a staff registration page, so to test regular staff functionality I used `factory` to create a dummy user that can login and perform tasks. 

For the full repo, please find it on my github account: [https://github.com/briancaffey/django-news-app](https://github.com/briancaffey/django-news-app).