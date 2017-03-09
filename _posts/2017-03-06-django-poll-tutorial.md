---

layout: post
title: Django polling app tutorial
date: 2017-03-06
comments: true

---

Here's a walkthrough of the [tutorial](https://docs.djangoproject.com/en/1.10/intro/tutorial01/) on the [Django website](https://docs.djangoproject.com). I've included some of my own notes. This post is primarily for self reference. 

First, navigate to a folder where we will put the project, then make the project with:

```terminal
(py3) >>django-admin startproject mysite
(py3) >>cd mysite
(py3) >>tree
.
├── manage.py
└── mysite
    ├── __init__.py
    ├── settings.py
    ├── urls.py
    └── wsgi.py

1 directory, 5 files
```
Next we can start the server:

```terminal
(py3) >>python manage.py runserver
```

> Ignore the warning about unapplied database migrations for now; we’ll deal with the database shortly. 

Next we create an app called `polls`: 

```terminal
(py3) >>python manage.py startapp polls
(py3) >>cd polls
(py3) >>tree
.
├── __init__.py
├── admin.py
├── apps.py
├── migrations
│   └── __init__.py
├── models.py
├── tests.py
└── views.py

1 directory, 7 files
```

Next we can write the first view for our app: 

*polls/views.py*

```python
from django.shortcuts import render
from django.http import HttpResponse

def index(request):
	return HttpResponse("Hello, world! You are at the polls index.")
```

This is the simplest view possible in Django. To call the view, we need to map it to a URL - and for this we need a URLconf. To create a URLconf in the polls directory, create a file called urls.py.

```python
from django.conf.urls import url

from . import views

urlpatterns = [
	url(r'^$', views.index, name='index')
]
```

The next step is to point the root URLconf at the polls.urls module. In mysite/urls.py, add an import for django.conf.urls.include and insert an include() in the urlpatterns list, so you have:

```python
from django.conf.urls import url
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^polls/', include(polls.urls)),
]
```
# Part 2

This chapter covers databases and Django’s automatically-generated admin site.

## Database Setup

The migrate command looks at the INSTALLED_APPS setting and creates any necessary database tables according to the database settings in your mysite/settings.py file and the database migrations shipped with the app (we’ll cover those later). 

```terminal
(py3) >>python manage.py migrate
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions
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
  Applying sessions.0001_initial... OK
```

## Creating models

In our simple poll app, we’ll create two models: Question and Choice. A Question has a question and a publication date. A Choice has two fields: the text of the choice and a vote tally. Each Choice is associated with a Question.

*polls/models.py*


```python 
from django.db import models

class Question(models.Model):
	question_text = models.CharField(max_length=200)
	pub_date = models.DateTimeField('date published')

class Choice(models.Model):
	question = models.ForeignKey(Question, on_delete=models.CASCADE)
	choice_text = models.CharField(max_length=200)
	votes = models.IntegerField(default=0)
```

Note a relationship is defined, using ForeignKey. That tells Django each Choice is related to a single Question. Django supports all the common database relationships: many-to-one, many-to-many, and one-to-one.

To include the app in our project, we need to add a reference to its configuration class in the INSTALLED_APPS setting. The PollsConfig class is in the polls/apps.py file, so its dotted path is 'polls.apps.PollsConfig'. Edit the mysite/settings.py file and add that dotted path to the `INSTALLED_APPS` setting. It’ll look like this:

*mysite/settings.py*

```python
[...]
 INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'polls.apps.PollsConfig',
]
[...]
```

Now Django knows to include the polls app. Next, we can run the `makemigrations` command: 

```terminal
(py3) >>python manage.py makemigrations
Migrations for 'polls':
  polls/migrations/0001_initial.py:
    - Create model Choice
    - Create model Question
    - Add field question to choice
```

By running makemigrations, you’re telling Django that you’ve made some changes to your models (in this case, you’ve made new ones) and that you’d like the changes to be stored as a migration.

Migrations are how Django stores changes to your models (and thus your database schema) - they’re just files on disk. You can read the migration for your new model if you like; it’s the file polls/migrations/0001_initial.py. 

There’s a command that will run the migrations for you and manage your database schema automatically - that’s called `migrate`, and we’ll come to it in a moment - but first, let’s see what SQL that migration would run. The `sqlmigrate` command takes migration names and returns their SQL:

```terminal
(py3) >>python manage.py sqlmigrate polls 0001
BEGIN;
--
-- Create model Choice
--
CREATE TABLE "polls_choice" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "choice_text" varchar(200) NOT NULL, "votes" integer NOT NULL);
--
-- Create model Question
--
CREATE TABLE "polls_question" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "question_text" varchar(200) NOT NULL, "pub_date" datetime NOT NULL);
--
-- Add field question to choice
--
ALTER TABLE "polls_choice" RENAME TO "polls_choice__old";
CREATE TABLE "polls_choice" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "choice_text" varchar(200) NOT NULL, "votes" integer NOT NULL, "question_id" integer NOT NULL REFERENCES "polls_question" ("id"));
INSERT INTO "polls_choice" ("id", "choice_text", "votes", "question_id") SELECT "id", "choice_text", "votes", NULL FROM "polls_choice__old";
DROP TABLE "polls_choice__old";
CREATE INDEX "polls_choice_7aa0f6ee" ON "polls_choice" ("question_id");
COMMIT;
```

The sqlmigrate command doesn’t actually run the migration on your database - it just prints it to the screen so that you can see what SQL Django thinks is required. 

Now we can run the `migrate` command: 

```terminal
(py3) >>python manage.py migrate
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, polls, sessions
Running migrations:
  Applying polls.0001_initial... OK
```
## Introducing the Django Admin

First we’ll need to create a user who can login to the admin site. Run the following command:

```terminal
(py3) >>python manage.py createsuperuser
Username: brian
Email address: [email@email.com]
Password:
Password (again):
Superuser created successfully.
```

Now we can access the admin portal at `localhost:8000/admin/`

Next, we need to make the poll app modifiable in the admin. The `polls` app will not be visible from the portal at this point. We need to modify a file in our `polls` app:

*polls/admin.py*

```python
from django.contrib import admin

from .models import Question

admin.site.register(Question)
```

Now that we’ve registered Question, Django knows that it should be displayed on the admin index page. And it now is. 

# Part 3

This section focuses on creating the public interface, called "views" in Django. 

A view is a “type” of Web page in your Django application that generally serves a specific function and has a specific template. For example, in a blog application, you might have the following views:

- Blog homepage – displays the latest few entries.
- Entry “detail” page – permalink page for a single entry.
- Year-based archive page – displays all months with entries in the given year.
- Month-based archive page – displays all days with entries in the given month.
- Day-based archive page – displays all entries in the given day.
- Comment action – handles posting comments to a given entry.

In our poll application, we’ll have the following four views:

- Question “index” page – displays the latest few questions.
- Question “detail” page – displays a question text, with no results but with a form to vote.
- Question “results” page – displays results for a particular question.
- Vote action – handles voting for a particular choice in a particular question.

In Django, web pages and other content are delivered by views. Each view is represented by a simple Python function (or method, in the case of class-based views). Django will choose a view by examining the URL that’s requested (to be precise, the part of the URL after the domain name).

A URL pattern is simply the general form of a URL - for example: /newsarchive/<year>/<month>/.

To get from a URL to a view, Django uses what are known as ‘URLconfs’. A URLconf maps URL patterns (described as regular expressions) to views.

# Writing more views

*polls/views.py*

```python
[...]
def detail(request, question_id):
	return HttpResponse("You are looking at question %s." % question_id)

def results(request, question_id):
	response = "You're looking at the results of question %s."
	return HttpResponse(response % question_id)

def vote(request, question_id):
	return HttpResponse("You're voting on question %s." % question_id)
```

Next we need to "wire up" the `urls.py` file so that we can call these functions based on different URL patterns: 

*polls/urls.py*

```python
from django.conf.urls import url

from . import views

urlpatterns = [
	# ex: /polls/
	url(r'^$', views.index, name='index'), 

	# ex: /polls/5/
	url(r'^(?P<question_id>[0-9]+)/$', views.detail, name='detail'),

	# ex: /polls/5/results/
	url(r'^(?P<question_id>[0-9]+)/results/$', views.results, name='results'), 

	# ex: /polls/5/vote/
	url(r'^(?P<question_id>[0-9]+)/vote/$', views.vote, name='vote'),
]
```

When somebody requests a page from your website – say, “/polls/34/”, Django will load the mysite.urls Python module because it’s pointed to by the `ROOT_URLCONF` setting. It finds the variable named urlpatterns and traverses the regular expressions in order. After finding the match at '^polls/', it strips off the matching text ("polls/") and sends the remaining text – "34/" – to the ‘polls.urls’ URLconf for further processing. There it matches r'^(?P<question_id>[0-9]+)/$', resulting in a call to the detail() view like so:

```python
detail(request=<HttpRequest object>, question_id='34')
```

The question_id='34' part comes from (?P<question_id>[0-9]+). Using parentheses around a pattern “captures” the text matched by that pattern and sends it as an argument to the view function; ?P<question_id> defines the name that will be used to identify the matched pattern; and [0-9]+ is a regular expression to match a sequence of digits (i.e., a number).

Because the URL patterns are regular expressions, there really is no limit on what you can do with them. And there’s no need to add URL cruft such as `.html`.


## Writing views that actually do something


Each view is responsible for doing one of two things: 

1. returning an HttpResponse object containing the content for the requested page, or 
2. raising an exception such as Http404. 

The rest is up to you. Your view can read records from a database, or not. It can use a template system such as Django’s – or a third-party Python template system – or not. It can generate a PDF file, output XML, create a ZIP file on the fly, anything you want, using whatever Python libraries you want.

Here's an example of how we could list the 5 most recent questions on the `/polls/` page: 

*polls/views.py*

```python
def index(request):
	latest_question_list = Question.objects.order_by('-pub_date')[:5]
	output = ','.join([q.question_text for q in latest_question_list])
	return HttpResponse(output)
```

This shows the 5 most recent questions joined by commas. Next we will put these questions in a structured HTML list with a template. 

*polls/templates/polls/index.html*

```html
{% raw %}{% if latest_question_list %}
	<ul>
		{% for question in latest_question_list %}
			<li><a href="/polls/{{ question.id }}/">{{question.question_text }}</a></li>
		{% endfor %}
	</ul>
{% else %}
	<p>No polls are available.</p>
{% endif %}{% endraw %}
```

Next, we need to update our index view in `polls/views.py` to use the template:

*polls/views.py*

```python
from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

from .models import Question

def index(request):
	latest_question_list = Question.objects.order_by('-pub_date')[:5]
	template = loader.get_template('polls/index.html')
	context = {'latest_question_list': latest_question_list, }
	return HttpResponse(template.render(context, request))
[...]
```

## A shortcut

It’s a very common idiom to load a template, fill a context and return an HttpResponse object with the result of the rendered template. Django provides a shortcut. Here’s the full index() view, rewritten:


*polls/views.py*

```python
from django.shortcuts import render
from .models import Question

def index(request):
	latest_question_list = Question.objects.order_by('-pub_date')[:5]
	context = {'latest_question_list': latest_question_list, }
	return render(request, 'polls/index.html', context)
[...]
```

This is much simpler than the previous ways of writing the `index` function. 

## Raising a 404 error

This next section will introduct 404 errors and how to raise them. We also complete the view for `details`. 

*polls/views.py*

```python
from django.http import Http404
[...]
def detail(request, question_id):
	try: 
		question = Question.objects.get(pk=question_id)
	except Question.DoesNotExist:
		raise Http404('Question does not exist')
	return render(request, 'polls/detail.html', {'question': question})
[...]
```

The view raises the Http404 exception if a question with the requested ID doesn’t exist.

For now we can write a simple template for `detail.html`:

```html
{% raw %}{{ question }}{% endraw %}
```

## Another shortcut: *get_object_or_404()*

It’s a very common idiom to use get() and raise Http404 if the object doesn’t exist. Django provides a shortcut. Here’s the detail() view, rewritten:

*polls/views.py*

```python
from django.http import Http404
[...]
def detail(request, question_id):
	question = get_object_or_404(Question, pk=question_id)
	return render(request, 'polls/detail.html', {'question': question})
[...]
```

The get_object_or_404() function takes a Django model as its first argument and an arbitrary number of keyword arguments, which it passes to the get() function of the model’s manager. It raises Http404 if the object doesn’t exist.

There’s also a get_list_or_404() function, which works just as get_object_or_404() – except using filter() instead of get(). It raises Http404 if the list is empty.

Now we can improve the `detail.html` template: 

*polls/templates/polls/detail.html*

```html
{% raw %}<h1>{{ question.question_text }}</h1>
<ul>
{% for choice in question.choice_set.all %}
	<li>{{ choice.choice_text }}</li>
{% endfor %}
</ul>{% endraw %}
```

Method-calling happens in the {% raw %}{% for %}{% endraw %} loop: question.choice_set.all is interpreted as the Python code question.choice_set.all(), which returns an iterable of Choice objects and is suitable for use in the {% raw %}{% for %}{% endraw %} tag.

## Removing hardcoded URLs in templates 

In `polls/index.html` we used a hardcoded link: 

```html
{% raw %}<li><a href="/polls/{{ question.id }}/">{{ question.question_text }}</a></li>{% endraw %}
```

It would be very challening to change this URL if we had many such templates. However, since you defined the name argument in the url() functions in the polls.urls module, you can remove a reliance on specific URL paths defined in your url configurations by using the {% raw %}{% url %}{% endraw %} template tag:

```html
{% raw %}<li><a href="{% url 'detail' question.id %}">{{ question.question_text }}</a></li>{% endraw %}
```

The way this works is by looking up the URL definition as specified in the polls.urls module. Remember, we defined the name of `detail` in `urls.py`:

```python
[...]
url(r'(?P<question_id>[0-9]+)/$', view.detail, name='detail'),
[...]
```

The tutorial project has just one app, polls. In real Django projects, there might be five, ten, twenty apps or more. How does Django differentiate the URL names between them? For example, the polls app has a detail view, and so might an app on the same project that is for a blog. How does one make it so that Django knows which app view to create for a url when using the {% raw %}{% url %}{% endraw %} template tag?

The answer is to add namespaces to your URLconf. In the `polls/urls.py` file, go ahead and add an `app_name` to set the application namespace:

*polls/urls.py*

```python
from django.conf.urls import url

from . import views

app_name = 'polls'
urlpatterns = [
	# ex: /polls/
	url(r'^$', views.index, name='index'), 

	# ex: /polls/5/
	url(r'^(?P<question_id>[0-9]+)/$', views.detail, name='detail'),

	# ex: /polls/5/results/
	url(r'^(?P<question_id>[0-9]+)/results/$', views.results, name='results'), 

	# ex: /polls/5/vote/
	url(r'^(?P<question_id>[0-9]+)/vote/$', views.vote, name='vote'),
]
```

Now we can change the namespace in the `index.html` template to make use of this namespace:  

*polls/templates/polls/index.html*

```html
{% raw %}<li><a href="{% url 'polls:detail' question.id %}">{{ question.question_text }}</a></li>{% endraw %}
```

# Part 4

This part will cover simple form processing as well as simplifying the code we have written so far. 

Let’s update our poll detail template (“polls/detail.html”) from the last tutorial, so that the template contains an HTML `<form>` element:

*polls/templates/polls/detail.html*

```html
{% raw %}<h1>{{ question.question_text }}</h1>
{% if error_message %}<p><strong>{{ error_message }}</strong></p>{% endif %}

<form action="{% url 'polls:vote' question.id %}" method="post">
{% csrf_token %}
{% for choice in question.choice_set.all %}
	<input type="radio" name="choice" id="choice{{ forloop.counter }}">{{ chocie.choice_text }}</label><br />
{% endfor %}

<input type="submit" value="Vote" />

<ul>
{% for choice in question.choice_set.all %}
	<li>{{ choice.choice_text }}</li>
{% endfor %}
</ul>{% endraw %}
```

Now, let’s create a Django view that handles the submitted data and does something with it. We previously defined a dummy `vote()` function, now let's create a real version of it: 

*polls/views.py*

```python
{% raw %}
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect

from django.urls import reverse
from .models import Question, Choice
[...]
def vote(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    try:
        selected_choice = question.choice_set.get(pk=request.POST['choice'])
    except (KeyError, Choice.DoesNotExist):
        #display the question voting form
        return render(request, 'polls/detail.html', {'question': question, 'error_message':"You didn't select a choice",})
    else:
        selected_choice.votes += 1
        selected_choice.save()
        #Always submit an HttpResponseRedirect after successfully dealing with POST data
        #This prevents the form being posted twice if a user hits the back button
        return HttpResponseRedirect(reverse('polls:results', args=(question.id,))){% endraw %}
```

This code includes a few things we haven’t covered yet in this tutorial:

- `request.POST` is a dictionary-like object that lets you access submitted data by key name. In this case, `request.POST['choice']` returns the ID of the selected choice, as a string. `request.POST` values are always strings.

Note that Django also provides `request.GET` for accessing GET data in the same way – but we’re explicitly using `request.POST` in our code, to ensure that data is only altered via a `POST` call.

- `request.POST['choice']` will raise `KeyError` if `choice` wasn’t provided in `POST` data. The above code checks for `KeyError` and redisplays the question form with an error message if choice isn’t given.

- After incrementing the choice count, the code returns an `HttpResponseRedirect` rather than a normal `HttpResponse`. `HttpResponseRedirect` takes a single argument: the URL to which the user will be redirected (see the following point for how we construct the URL in this case).

As the Python comment above points out, you should always return an `HttpResponseRedirect` after successfully dealing with `POST` data. This tip isn’t specific to Django; it’s just good Web development practice.

- We are using the `reverse()` function in the `HttpResponseRedirect` constructor in this example. This function helps avoid having to hardcode a URL in the view function. It is given the name of the view that we want to pass control to and the variable portion of the URL pattern that points to that view. In this case, using the `URLconf` we set up in Tutorial 3, this `reverse()` call will return a string like:

```text
'/polls/3/results/'
```

where the 3 is the value of `question.id`. This redirected URL will then call the `'results'` view to display the final page. Here is the `results` view: 

*polls/views.py*

```python
[...]
def results(request, question_id):
	question = get_object_or_404(Question, pk=question_id)
	return render(request, 'polls/results.html', {'question': question})
[...]
```

Now we can create the `results.html` template:

*polls/results.html*

```html
{% raw %}<h1>{{ question.question_text }}</h1>

<ul>
{% for choice in question.choice_set.all %}
	<li>{{ choice.choice_text }} -- {{ choice.votes }} vote{{ choice.votes|pluralize }}</li>
{% endfor %}
</ul>

<a href="{% url 'polls:detail' question.id %}">Vote again?</a>{% endraw %}
```

If we visit `/polls/1/` and click on the `Vote` button, we are taken to `/polls/1/vote/` and we see the error message: `You didn't select a choice`. 

## Using Generic Views 

The detail() (from Tutorial 3) and results() views are very simple – and, as mentioned above, redundant. The index() view, which displays a list of polls, is similar.

These views represent a common case of basic Web development: getting data from the database according to a parameter passed in the URL, loading a template and returning the rendered template. Because this is so common, Django provides a shortcut, called the “generic views” system.

Generic views abstract common patterns to the point where you don’t even need to write Python code to write an app.

Let’s convert our poll app to use the generic views system, so we can delete a bunch of our own code. We’ll just have to take a few steps to make the conversion. We will:

1. Convert the URLconf.
2. Delete some of the old, unneeded views.
3. Introduce new views based on Django’s generic views.

This last part will redo some of the parts we have already completed to explore the concepts of generic views in Django. 

*polls/urls.py*

```python
from django.conf.urls import url

from . import views

app_name = 'polls'
urlpatterns = [
	# ex: /polls/
	url(r'^$', views.IndexView.as_view(), name='index'), 
	# ex: /polls/5/
	url(r'^(?P<pk>[0-9]+)/$', views.DetailView.as_view(), name='detail'),
	# ex: /polls/5/results/
	url(r'^(?P<pk>[0-9]+)/results/$', views.ResultsView.as_view(), name='results'), 
	# ex: /polls/5/vote/
	url(r'^(?P<question_id>[0-9]+)/vote/$', views.vote, name='vote'),
]
```

Note that the name of the matched pattern in the regexes of the second and third patterns has changed from `<question_id>` to `<pk>`.

Next, we’re going to remove our old index, detail, and results views and use Django’s generic views instead. 

**This is a new Django feature that can be tricky for beginnners. It is recommended to avoid class-based views (generic views) if you don't mind writing out function-based views.**

*polls/views.py*

```python 
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect
from django.views import generic
from django.urls import reverse

from .models import Question, Choice

class IndexView(generic.ListView):
	template_name = 'polls/index.html'
	context_object_name = 'latest_question_list'

	def get_queryset(self):
		"""Return last five published questions"""
		return Questions.objects.order_by('-pub_date')[:5]

class DetailView(generic.DetailView):
	model = Question
	template_name = 'polls/detail.html'

class ResultsView(generic.DetailView):
	model = Question
	template_name = 'polls/results.html'

def vote(request, question_id):
	question = get_object_or_404(Question, pk=question_id)
	try:
		selected_choice = question.choice_set.get(pk=request.POST['choice'])
	except (KeyError, Choice.DoesNotExist):
		#display the question voting form
		return render(request, 'polls/detail.html', {'question': question, 'error_message':"You didn't select a choice",})
	else:
		selected_choice.votes += 1
		selected_choice.save()
		#Always submit an HttpResponseRedirect after successfully dealing with POST data
		#This prevents the form being posted twice if a user hits the back button
		return HttpResponseRedirect(reverse('polls:results', args=(question.id,)))


""" Without Generic Views (for comparison)

def index(request):
	latest_question_list = Question.objects.order_by('-pub_date')[:5]
	context = {'latest_question_list': latest_question_list, }
	return render(request, 'polls/index.html', context)

def detail(request, question_id):
	question = get_object_or_404(Question, pk=question_id)
	return render(request, 'polls/detail.html', {'question': question})

def results(request, question_id):
	question = get_object_or_404(Question, pk=question_id)
	return render(request, 'polls/results.html', {'question': question})

def vote(request, question_id):
	question = get_object_or_404(Question, pk=question_id)
	try:
		selected_choice = question.choice_set.get(pk=request.POST['choice'])
	except (KeyError, Choice.DoesNotExist):
		#display the question voting form
		return render(request, 'polls/detail.html', {'question': question, 'error_message':"You didn't select a choice",})
	else:
		selected_choice.votes += 1
		selected_choice.save()
		#Always submit an HttpResponseRedirect after successfully dealing with POST data
		#This prevents the form being posted twice if a user hits the back button
		return HttpResponseRedirect(reverse('polls:results', args=(question.id,)))
"""
```

We’re using two generic views here: `ListView` and `DetailView`. Respectively, those two views abstract the concepts of “display a list of objects” and “display a detail page for a particular type of object.”

- Each generic view needs to know what model it will be acting upon. This is provided using the model attribute.

- The `DetailView` generic view expects the primary key value captured from the URL to be called "pk", so we’ve changed `question_id` to `pk` for the generic views.

By default, the DetailView generic view uses a template called `<app name>/<model name>_detail.html`. In our case, it would use the template "polls/question_detail.html". The `template_name` attributes we give our classes in `views.py` tell Django to use a specific template instead of the autogenerated default template view.

In previous parts of the tutorial, the templates have been provided with a context that contains the `question` and `latest_question_list` context variables. For `DetailView` the question variable is provided automatically – since we’re using a Django model (`Question`), Django is able to determine an appropriate name for the context variable. However, for ListView, the automatically generated context variable is `question_list`. To override this we provide the `context_object_name` attribute, specifying that we want to use `latest_question_list` instead. As an alternative approach, you could change your templates to match the new default context variables – but it’s a lot easier to just tell Django to use the variable you want.

# Part 5: Automated testing

Coming soon!

# Part 6: Static files

`django.contrib.staticfiles` collects static files from each of your applications (and any other places you specify) into a single location that can easily be served in production.

## Customize your app's look and feel

First, create a directory called `static` in your polls directory. Django will look for static files there, similarly to how Django finds templates inside `polls/templates/`.

Within the static directory you have just created, create another directory called polls and within that create a file called style.css. Now we can add to this file: 

*polls/static/polls/style.css*

```css
{% raw %}li a {
	color: green;
}{% endraw %}
```

Next, add the following at the top of `polls/templates/polls/index.html`:

```html
{% raw %}{% load static %}{% endraw %}

<link rel="stylesheet" type="text/css" href="{% raw %}{% static 'polls/style.css' %}{% endraw %}" /> 
```

The `{% raw %}{% static %}{% endraw %}` template tag generates the absolute URL of static files.

# Part 7 

This section focuses on customizing Django's automatically-generated admin site. At this point, we haven't authorized the admin site to create or access the `Choice` model. We are going to associate these two objects so that it is easier to create questions with choices in the admin panel. 

*polls/admin.py*

```python
from django.contrib import admin

from .models import Question

class QuestionAdmin(admin.ModelAdmin):
	fields = ['pub_date', 'question_text']

admin.site.register(Question, QuestionAdmin)
```

You’ll follow this pattern – create a model admin class, then pass it as the second argument to `admin.site.register()` – any time you need to change the admin options for a model.

All this does is change the order of the publication date and the question field. This is fairly simple, but it may be helpful if you have dozens of fields in a model. 

We can also split up the form on the admin panel by fieldsets:

*polls/admin.py*

```python
from django.contrib import admin

from .models import Question

class QuestionAdmin(admin.ModelAdmin):
	fieldsets = [(None, {'fields':['question_text']}), ('Date information', {'fields':['pub_date']}), ]

admin.site.register(Question, QuestionAdmin)
```

This groups fields together. Next we want to make the Choice object related to the Question object in the admin panel: 

*polls/admin.py*

```python
from django.contrib import admin

from .models import Choice, Question

class ChoiceInline(admin.TabularInline):
	model = Choice
	extra = 3

class QuestionAdmin(admin.ModelAdmin):
	fieldsets = [
		(None, {'fields':['question_text']}), 
		('Date information', {'fields': ['pub_date'], 'classes':['collapse']}),]
	inlines = [ChoiceInline]

admin.site.register(Question, QuestionAdmin)
```

This tells Django: “Choice objects are edited on the Question admin page. By default, provide enough fields for 3 choices.” 




