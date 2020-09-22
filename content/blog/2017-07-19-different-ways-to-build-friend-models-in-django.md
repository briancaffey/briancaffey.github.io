---

layout: post
title: Comparing different ways to build friend objects in Django
date: 2017-07-19
comments: true

---

This post will briefly explore two different methods of creating models in Django for friends, relationships, followers or connections on a social network. The first method is one I learned from [this youtube tutorial series](https://www.youtube.com/watch?v=IXJ46DitsIg&index=55&list=PLw02n0FEB3E3VSHjyYMcFadtQORvl1Ssj) by [Max Goodridge](https://github.com/maxg203) when I first started learning Django.

## 1st Method: **ManytoManyField** to store friends

Using Django's `ManyToManyField`, we can define the following `Friend` model:

```python
from django.db import models
from accounts.models import UserProfile

class Friend(models.Model):
    users = models.ManyToManyField(UserProfile)
    current_user = models.ForeignKey(UserProfile, related_name="owner", null=True)

    @classmethod
    def make_friend(cls, current_user, new_friend):
        friend, created = cls.objects.get_or_create(
            current_user = current_user
        )
        friend.users.add(new_friend)

    @classmethod
    def remove_friend(cls, current_user, new_friend):
        friend, created = cls.objects.get_or_create(
            current_user = current_user
        )
        friend.users.remove(new_friend)

    def __str__(self):
        return str(self.current_user)
```

With this type of model, we define the following views to add and remove friends:

```python
from django.shortcuts import render, get_object_or_404, redirect
from accounts.models import UserProfile
from django.contrib.auth.models import User
from friends.models import Friend
from django.contrib.auth.decorators import login_required

@login_required
def add_or_remove_friends(request, username, verb):
    n_f = get_object_or_404(User, username=username)
    owner = request.user.userprofile
    new_friend = UserProfile.objects.get(user=n_f)

    if verb == "add":
        new_friend.followers.add(owner)
        Friend.make_friend(owner, new_friend)
    else:
        new_friend.followers.remove(owner)
        Friend.remove_friend(owner, new_friend)

    return redirect(new_friend.get_absolute_url())
```

The `Friend` model has a `ForeignKey` relationship ("owner"), a given user, and a `ManyToManyField` relationship with other `UserProfile` objects.

I am using a UserProfile model to build the `Friend` model and view. This is a common practice in Django, you can read more about it [this article about extending the user model](https://simpleisbetterthancomplex.com/tutorial/2016/07/22/how-to-extend-django-user-model.html).

In this example, the `UserProfile` also has a `ManyToManyField` called followers that store the users following that user. I access this field in the `add_or_remove_friends` method.

Because I am using `UserProfile` model in the `ManyToManyField` and `ForeignKey` relationships in the `Friend` model, in the `add_or_remove_friends` view I need to first get the `User` model by username, and then find the `UserProfile` model.

The class methods in the `Friend` model make use of a very helpful method called `get_or_create`. This method returns the existing or new model, and a boolean value indicating whether or not a new object was created.

This approach is helpful when you want to track the users someone is following and the followers of any given user. For example, to get the users that follow a particular user, we can do the following in a template:

```html
{% for friend in request.user.userprofile.followers.all %}
    <p>{{ friend }}</p>
{% endfor %}
```

To get the users that a user follows, we could access the friend model in a view and then get a list of users in the `ManyToManyField`:

```python
def list_friends(request):
    friend_object, created = Friend.objects.get_or_create(current_user=request.user.userprofile)
    friends = [friend for friend in friend_object.users.all() if friend != request.user.userprofile]
    return render(request, 'template.html', {"friends":friends})
```

Alternatively, we could write a class method to do this for is in the friend model.

This is a good way to track relationships if relationships is the only piece of information we need to track. However, if we want to track more information about a relationship, such as the date and time the relationship was formed, we will quickly see the limits of this model schema. The next method provides another way that allows us to store more information about each relationship.

## 2nd Method: **ForeignKey** with one relationship per object

Another popular solution for making a `Friend` model in Django discussions around the internet describes the following method (originally seen on Stack Overflow in [this post](https://stackoverflow.com/questions/4564760/best-way-to-make-djangos-user-system-have-friends)). Let's call this model `Connection`:

```python
class Connection(models.Model):
    created = models.DateTimeField(auto_now_add=True, editable=False)
    creator = models.ForeignKey(User, related_name="friendship_creator_set")
    following = models.ForeignKey(User, related_name="friend_set")
```

With this model, we would want to create additional class methods on our `UserProfile` model to easily get a list of connections (users the user is following) and followers (users following the user) in a template or view:

```python
from friends.models import Friendship
class UserProfile(models.Model):

    ...

    def get_connections(self):
  		connections = Connection.objects.filter(creator=self.user)
  		return connections
          
    def get_followers(self):
        followers = Connection.objects.filter(following=self.user)
        return followers
```

## Accessing Connection Information in API Data

In a recent project I have been looking for a way to display all users in a network, and also show the connection status between each user listed and the currently logged-in user. This could be done by writing additional model methods on the UserProfile model and then access these methods in the template. Since I am using React.js to display the user list, I can't access a model method in the template. Instead, I will have get the connection data inside of the API. Using the Django REST Framework, this can be accomplished with `SerializerMethodField`.

Here's a quick description of `SerializerMethodField` from the [Django REST Framework documentation](http://www.django-rest-framework.org/api-guide/fields/#serializermethodfield):

>This is a read-only field. It gets its value by **calling a method on the serializer class it is attached to**. It can be used to add any sort of data to the serialized representation of your object.

Here's a view and serializer that I use to show all users in a social network, along with Boolean Fields that indicate if each user is following or followed by the logged-in user making the request.


*api/views.py*

```python
class UserListAPIView(ListAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserListSerializer
```

*api/serializers.py*

```python
from ..models import UserProfile, Connection
class UserListSerializer(ModelSerializer):

    following = serializers.SerializerMethodField()
    follows_requesting_user = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = [
            'user',
            'first_name',
            'last_name',
            'bio',
            ...
            'following',
            'follows_requesting_user',
            'follow_link',
        ]

    def get_following(self, obj):
        creator = self.context['request'].user
        following = obj.user
        connected = Connection.objects.filter(creator=creator, following=following)
        return len(connected)

    def get_follows_requesting_user(self, obj):
        creator = self.context['request'].user
        following = obj.user
        connected = Connection.objects.filter(creator=following, following=creator)
        return len(connected)
```

Finally, here's look into the `index.js` file that includes the React component which consumes this API data:

*assets/js/index.js*

```js
...

if(document.getElementById('users-container')) {
  var UserList = React.createClass({
    loadUsersFromServer: function(){
      console.log('something')
      $.ajax({
        url: this.props.url,
        datatype: 'json',
        cache: false,
        success: function(data){
          this.setState({data:data});
        }.bind(this)
      })
    },

    getInitialState: function(){
      return {data: []};
    },

    componentDidMount: function(){
      this.loadUsersFromServer();
      setInterval(this.loadUsersFromServer,
                  this.props.pollInterval)
    },
    render: function(){
      if (this.state.data){
        var userNodes = this.state.data.map(function(user){
          return (
            <div className="thumbnail" key={user.user}>
            <div className="caption post-detail-item">
              <div className="row">
              <div className="col-md-3">
                <img className="img-responsive" src={user.photo_url}/>
                <br />
                {user.following == 1 ? <label className="label label-primary">following</label> : <a className="btn btn-warning" href={'/'+user.follow_link}>Follow</a>}<br />
                {user.follows_requesting_user == 1 ? <label className="label label-primary">follows you</label> : ''}
              </div>
                <div className="col-md-9">
                <h2>{user.first_name} {user.last_name}</h2>
                <h4>{user.job_title} @ {user.current_company}</h4>
                {user.is_facebook_connected ? <button className="btn btn-default">Facebook: Connected</button> :''}
                {user.is_linkedin_connected ? <button className="btn btn-default">LinkedIn: Connected</button> :''}
                <br /><br />
                <a className="btn btn-primary" href={"/"+user.user_profile_url}>View</a>
                </div>
              </div>
            </div>
          </div>)
        })
      }
      return (
        <div>
          <h1>Women in the Lead Network</h1>
            {userNodes}
        </div>
      )
    }
  })


  ReactDOM.render(<UserList url='/api/users/' pollInterval={10000} />,
  document.getElementById('users-container'))

}
```

## A third way?

There is a lot you can do with Connection models. This models explored here are fairly simple "following" relationships. The following process does not require that the user being followed accepts the initiating users "follow". Since I am designing this for a small, invite-only social-network, it is ok to keep things relatively simple for now.

The major difference between the first and second methods of building friendship/follower/connection models is that you can store more detailed information about each relationship. However, if we wanted to store data about the non-directional relationship between two people, we would have to make another model (perhaps with signals), or update the information in both Connection models (a -> b and b -> a).
