---
title: Authenticating requests with JWT tokens stored in HTTPOnly cookies in Django
date: '2021-08-01'
description: This article describes how you can use JWT tokens in Django applications with decoupled frontend JavaScript applications running the browser in secure way using HttpOnly cookies.
tags:
  - django
  - vue
  - jwt
  - authentication
---

## tl;dr

If you want to use JWTs to securely authenticate requests to Django REST Framework applications in a decoupled frontend JavaScript application, you can do the following: store the access token in memory and store the refresh token  in an HttpOnly cookie. The refresh token is used to request new access tokens on an regular interval.

## Some context

Django is a web framework based on the Model, Template, View (MTV) paradigm. Django is increasingly used as an API server that is coupled with a Javascript or native frontend application.

## JWT Auth with HttpOnly Cookies

Following this guide:

https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/#jwt_security

We can reimplement our JWT authentication setup to be more secure.

### DRF Simple JWT modifications

We need to change the default behavior of the views from DRF simple JWT as described in this issue:

https://github.com/jazzband/djangorestframework-simplejwt/issues/71


![png](/static/jwt-authentication.png)

This diagram shows how authentication data moves between the Django backend and the Vue.js frontend running in the browser.

*This article is almost complete*
