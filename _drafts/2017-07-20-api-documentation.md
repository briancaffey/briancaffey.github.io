---

layout: post
title: API Documentation
date: 2017-07-20
comments: true

---

# API Documentation

Here is a description of the API endpoints under development for Lead.

* `users/api`

This endpoint returns all users in the Lead Network. This endpoint requires the user to be authenticated. Here is a sample JSON response:

```JSON
[
  {
    "user":2,
    "first_name":"Nancy",
    "last_name":"Rubin",
    "job_title":"CTO",
    "current_company":"Ace Consulting",
    "is_linkedin_connected":true,
    "is_facebook_connected":true,
    "bio":"Nancy Rubin join Ace Consulting as CTO in 2015 and has helped grow the engineering team form 10 to 100 employees.",
    "photo_url":"http://loremflickr.com/320/240/woman",
    "user_profile_url":"users/2",
    "following":1,
    "follows_requesting_user":0,
    "follow_link":"users/2/connect/"
  },

    ...

]
```

The fields `following` and `follows_requesting_user` return 1 if the requesting user follows the user or the user in the list follows the requesting user, and 0 if the opposite is true.

### To-do

I need rearrange the URL structure so it is `/v1/api/users`, and I will be changing the `following` and `follows_requesting_user` fields to be Boolean values instead of integers 0 and 1.

* `/users/id/api`

Sample JSON response:

```JSON
{
  "user":2,
  "first_name":"Nancy",
  "last_name":"Rubin",
  "job_title":"CTO",
  "current_company":"Ace Consulting",
  "is_linkedin_connected":true,
  "is_facebook_connected":true,
  "bio":"Nancy Rubin join Ace Consulting as CTO in 2015 and has helped grow the engineering team form 10 to 100 employees.",
  "photo_url":"http://loremflickr.com/320/240/woman",
  "user_profile_url":"users/2"
}
```

This endpoint will display information about a given user.

### To-do

* Add relevant permissions
* Add data about relationship between the user and the requesting user (logged-in user)
