---

layout: post
title: Posting JSON data to the Django REST Framework with AJAX
date: 2017-07-22
comments: true

---


This article will explore the challenges I faced recently while trying to make POST requests with JSON data to the Django REST Framework using jQuery's AJAX function. After tracing down all of the error messages into the documentation for Django, Django REST Framework, jQuery and JavaScript and many Stack Overflow questions, I was finally able to see my "It worked!" alert pop up from the `success` callback.

{% raw %}

## Context

This issue came up over the weekend while working on a JavaScript game I started several months ago. The game is a '[dungeon crawler](https://en.wikipedia.org/wiki/Dungeon_crawl)' where the characters and environment are represented by Unicode emoji. In the initial version, you control a character who roams through a forest, slays a dragon that threatens a princess in distress, and then meet the King of the Land, hence the name of the game "King's Encounter". I wanted an easier way to design levels, and also wanted to let users create and share their own worlds and adventures.

The entire game state is stored in a JavaScript object. Here's a simplified representation of the structure:

```javascript
var game = {
  "map":{
    "0":[tree, tree, tree,],
    "1":[tree, player, tree,],
    "2":[tree, tree, tree,],
  }
}
```

The UI lets users manipulate the values of each row in the game state's `map` property. The values of the row arrays are objects themselves, which contain information about which emoji they represent and how they interact with the player (for example, you can't pass through a tree, so it has a `'wall':true` property).

I added a "Save Game" button, which when clicked would fire a POST or PUT request to create or update the user's game design. On the homepage of my personal website I includes a simple AJAX POST, so I first copied it over as boilerplate code to modify.

```HTML
$("#post-form").on('submit', function(event){
  event.preventDefault();
  var this_ = $(this)
  var gb_endpoint = this_.attr("data-href")
  $.ajax({
    url: gb_endpoint,
    type: "POST",
    data: { message : $("#post-text").val(),
            csrfmiddlewaretoken: '{{ csrf_token }}',
            city: "some city",
            state: "some state",
    },
    success: function(json){
      $('#post-text').val('');
      $('#post-form').blur();
      var gb_num = $("#gb-num").text();
      var new_gb_num = parseInt(gb_num) + 1
      $("#gb-num").text(new_gb_num);


      if (1 == 1){
        var user = json.user
        $('#guest-book-items').prepend('<div class="panel panel-success"><div class="panel-heading">From {% if user.is_authenticated %}{{ user }}{% else %}someone{% endif %} in the ' + json.city + ', ' + json.state + ' area | just now</div><div class="panel-body">' + json.message + '</div></div>')
      }
    },
  });
```

Here's the AJAX call that worked after lots of debugging:

```HTML
$("#save-level").click(function(event){
  event.preventDefault();
  $.ajax({
    type : "POST",
    url : "/api/kings/save/",
    csrfmiddlewaretoken: "{{ csrf_token }}",
    data : JSON.stringify({game:scene}),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
    success: function(){
        alert("Saved! It worked.");
      },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert("some error " + String(errorThrown) + String(textStatus) + String(XMLHttpRequest.responseText));
      }
    });
  });
```

## Django REST Framework settings and API endpoints

Before I started writing the AJAX call, I looked in the Django REST Framework documentation for instructions on how to post JSON data. Here are the REST Framework settings I added to `settings.py`:

```python
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
    'DEFAULT_PARSER_CLASSES': (
        'rest_framework.parsers.JSONParser',
    )
}
```

I'm not sure if this was completely necessary, but I think the [`JSONRenderer` helps with the serialization of Unicode data](http://www.django-rest-framework.org/api-guide/renderers/#jsonrenderer), since earlier attempts returned Unicode representation of emoji rather than the emoji themselves (e.g., U+1F600 instead of 😀).

I should also mention that I added a simple "Game" model in `models.py`:

```python
from django.contrib.postgres.fields import JSONField

class Game(models.Model):
    game = JSONField()
```

Next I added the views and serializers for the API endpoint (`/api/kings/save/`) for the POST request:

*kings/api/views.py*

```python
from ..models import Game
from .serializers import GameSerializer

from rest_framework.generics import CreateAPIView, # ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response

class GameCreateAPIView(CreateAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    def perform_create(self, serializer):
        game = self.request.data
        _ = serializer.save(game=game)
        return Response(_)

# class GameListAPIView(ListAPIView):
#     queryset = Game.objects.all()
#     serializer_class = GameSerializer
```

*kings/api/serializers.py*

```python
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from ..models import Game

class GameSerializer(ModelSerializer):

    class Meta:
        model = Game
        fields = [
            'game'
        ]
```

Writing this view was the first big hurdle. I was under the impression that the JSON data was to be accessed in `self.request.body`. The error message said [You cannot access body after reading from request's data stream](https://github.com/encode/django-rest-framework/issues/2774), and there were some elaborate solutions that I didn't think I would be able to implement.

[This topic](http://www.django-rest-framework.org/api-guide/requests/#request-parsing) in the DRF documentation describes the `.data` method for parsing requests.

## Debugging the AJAX call and formatting JSON data

The next important clue came from a footnote in this section about requests:

>Note: If a client sends malformed content, then accessing request.data may raise a ParseError. By default REST framework's APIView class or @api_view decorator will catch the error and return a 400 Bad Request response.
If a client sends a request with a content-type that cannot be parsed then a UnsupportedMediaType exception will be raised, which by default will be caught and return a 415 Unsupported Media Type response.

I resolved the `415` error by adding the following to the AJAX call.

```html
headers: {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
  },
```

One aspect of all of the debugging which was frustrating is that the sqlite3 database on my local environment does not support storing JSON data (as far as I know), so I committed and pushed code to my production server on Heroku (which uses PostgreSQL) for each step in the debug process. Eventually I realized that a `500` server error on my local environment meant that everything was working correctly except for the very last step: saving the `Game` object.

At this point I thought I was pretty close. I could successfully POST data using the DRF web interface, and I got the following type of error messages (which were `HTTP 400 Bad Request`) when I tried to post malformed data:

```json
{
    "detail": "JSON parse error - Expecting value: line 2 column 13 (char 14)"
}
```

To see what error message I was getting using AJAX, I found that jQuery makes the error message available in `XMLHttpRequest.responseText`. I then added the following to the AJAX `error` callback:

```html
$.ajax({
  ...
  error: function(XMLHttpRequest, textStatus, errorThrown) {
    alert("some error " + String(errorThrown) + String(textStatus) + String(XMLHttpRequest.responseText));
    }
  });
```

This error message was saying:

```
ValueError: Expecting value: line 1 column 1 (char 0)
```

This led me to believe that there was an issue with the `data` attribute being passed into the AJAX call. It was particularly difficult to figure out how to write the JSONified version of JavaScript object. SO posts had many different ways, and I eventually found that the following worked:

```html
$.ajax({
  ...
  data : JSON.stringify({game:scene}),
```

Since I named the `JSONField()` field in my Game model `game`, I believe that `game` needed to be the "main attribute" of the JSON in the POST request. `scene` is the name of the variable that held the JavaScript object I wanted to send. `JSON.stringify()` was a little confusing, and there was lots of confusion online about what it returns. Here's the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) that was helpful in figuring out `JSON.stringify()`.

## Cross-site Request Forgery issue when using AJAX with Django

At some point in all of this debugging I got a strange error message saying the CSRF Token was missing or incorrect. I had included `csrfmiddlewaretoken: "{{ csrf_token }}",` in the AJAX call, and it wasn't an issue I had experienced with making my other POST request with AJAX. I found [this Stack Overflow answer](https://stackoverflow.com/questions/5100539/django-csrf-check-failing-with-an-ajax-post-request) with 143 votes and 90,322 views, and was pleased that the proposed solution worked just fine. It involves adding `$.ajaxSetup()` before the AJAX call:

```html
$.ajaxSetup({
     beforeSend: function(xhr, settings) {
         function getCookie(name) {
             var cookieValue = null;
             if (document.cookie && document.cookie != '') {
                 var cookies = document.cookie.split(';');
                 for (var i = 0; i < cookies.length; i++) {
                     var cookie = jQuery.trim(cookies[i]);
                     // Does this cookie string begin with the name we want?
                     if (cookie.substring(0, name.length + 1) == (name + '=')) {
                         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                         break;
                     }
                 }
             }
             return cookieValue;
         }
         if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
             // Only send the token to relative URLs i.e. locally.
             xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
         }
     }
});
```

I won't go into to much detail here, but you can read more about this issue which apparently also impacts Ruby on Rails as well. Here's a [link to a security post on the Django Project blog](https://www.djangoproject.com/weblog/2011/feb/08/security/).

Finally, I pressing the `Save Game` button gave me the long-awaited succss message: `Saved! It worked.`

## Conclusion

I still have quite a bit of work to do before the "level-building" feature is complete for this game. Hopefully there are not as many issues in retrieving JSON data stored in the database.

It would probably make more sense to build this type of game with a JS backend and a NoSQL database, but it is good to know that Django + DRF + PostgreSQL can handle this.

A live demo of the level-building is available here: [http://briancaffey.com/kings/kingsencounter/level_builder](http://briancaffey.com/kings/kingsencounter/level_builder), and you can find a demo of the game here: [http://briancaffey.com/kings/kingsencounter/](http://briancaffey.com/kings/kingsencounter/). Here's what the game looks like:

![png](/img/kings_encounter.png)

If you save your game, you can see the JSON in the list of all saved games using the DRF web UI: [http://briancaffey.com/api/kings/games/](http://briancaffey.com/api/kings/games/). One of the very next things I need to do on the backend assign a unique URL to each `Game` object and update that `Game` model rather than creating new games with each request. This will involve something like `UpdateAPIView` in the REST Framework.

Hopefully this article is helpful if you are struggling with making an AJAX POST request to DRF on the backend. Thanks for reading and feel free to leave a comment if you have any thoughts or questions or can point out something I can improve.


{% endraw %}
