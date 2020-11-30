---
layout: post
title: How to authenticate Django REST Framework API calls from a (Vue) JS client using Session Authentication and HttpOnly cookies
date: 2020-11-27
comments: true
image: /static/padlocks.jpg
tags:
  - django
  - vue
  - authentication
  - api
---

This article will describe an authentication strategy using Django REST Framework with a Javascript frontend application. I'll be demonstrating this with Vue.js (Qusar Framework, using Vue 2), but the concepts should transfer to any other Javascript framework.

Here's a GitLab repository for a project that I will be referencing throughout this article: [https://gitlab.com/verbose-equals-true/django-postgres-vue-gitlab-ecs](https://gitlab.com/verbose-equals-true/django-postgres-vue-gitlab-ecs).

When I first started learning about how to do authentication from a Vue client, I found [this article from Sqreen](https://blog.sqreen.com/authentication-best-practices-vue/) which describes how to use JWT to authenticate a Vue application. The example uses a mocked backend, but it is a good proxy for what you would have if you were to use a library like [`django-rest-framework-simplejwt`](https://github.com/SimpleJWT/django-rest-framework-simplejwt), which I have previously used with success in Django projects.

JWT is an option for doing authentication with DRF [listed in the authentication documentation](https://www.django-rest-framework.org/api-guide/authentication/#json-web-token-authentication), but the documentation doesn't recommend when or how to use JWT authentication.

Session authentication is mentioned as well:

> This authentication scheme uses Django's default session backend for authentication. Session authentication is appropriate for AJAX clients that are running in the same session context as your website.

In my project, both in local development and in production environments, I serve the API and the Javascript clients on the same domain. `/api/*` requests go to the API, and all other request paths route to the frontend client. In other scenarios such as using `https://mysite.com` and `https://api.mysite.com` for hosting a frontend and API an different subdomains, there would need to be additional considerations for CORS, but since I have the frontend and the backend being served on the same domain (and same subdomain), this isn't a concern. You might need to watch out for this if your requirements are different.

## The authentication flow

Now let's describe the login process at a high level.

1. A user navigates to your site. There is currently nothing in the browser's `localStorage` or cookies related to authentication.

2. The user navigates to the `Login` page at `/login`.

3. Loading this Vue component makes a `GET` request to a special endpoint in our Django backend `/api/login-set-cookie/`. This request returns a simple JSON message: `"CSRF cookie set"`, and as the message says, the response sets a `csrf` cookie on our browser.

4. Once the CSRF cookie is set by the response from `/api/login-set-cookie/`, the user is presented with a login form and enters account credentials (email and password in my example, where email is the `USERNAME_FIELD` on my custom user model). Clicking "Login" dispatches a Vuex action that uses Axios to send a send a request to `/api/login/` with the `csrf` cookie set in a `X-CSRFToken` header.

5. `/api/login/` is handled by the `login_view` view which uses two important functions from `django.contrib.auth`: `authenticate` and `login`. `authenticate` gets the user from the provided credentials, and `login` sets a `sessionid` HttpOnly cookie on the response.

6. When the response from `/api/login/` comes back, two things happen: first the `sessionid` HttpOnly cookie is set on our browser. Second, we set a value in both Vuex and localStorage named `authenticated` to `success`. We are not storing any sensitive information in this value. Instead, we are using this value to signal to the rest of our Vue application that the user has authenticated. Storing this in Vuex allows us to use global Vuex `getters` so that we can change component state and other logic where authentication is concerned, such as route guards (for Vue router). We store it in localStorage so that when a new browser tab is opened, we can set the value of `authenticated` in Vuex based on the value in localStorage. (`authenticated: localStorage.getItem("authenticated") || "",`)

7. Since the `sessionid` cookie is HttpOnly, we can't use Javascript to interact with it, so when we want to logout the user we can't just delete the cookie. To logout the user, we make a request to `/api/logout/` when the user clicks on the logout button. The view for this endpoint does `logout(request)`. This returns a response with a new value for the `sessionid` cookie: `Set-Cookie: sessionid=""; expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; Path=/; SameSite=Lax`. Since the cookie's expiration is in the past, it is removed entirely. We also remove the `authenticated` localStorage item and set the Vuex store value of `authenticated` to `''` (which is falsey). This lets the Vue application know that user has been logged out. One consideration for this is that your user can't logout while offline.

8. This repo also implements social authentication with the fantastic Python Social Auth library. I used Facebook, Google and GitHub, but there are lots of other providers you can choose from depending on what you need. This is a lengthy topic, and I recommend that you read [How to Integrate OAuth 2 Into Your Django/DRF Back-end Without Going Insane](https://www.toptal.com/django/integrate-oauth-2-into-django-drf-back-end) on which I have based my implementation. Here's the short story of how this works. First, a user clicks on one of the social sign-in links. These links are the same for sign-in and sign-up.

9. The link has a few parts, here's an example: `https://github.com/login/oauth/authorize?client_id=r66bdfgsfsbferfef4&redirect_uri=http:%2F%2Flocalhost%2Fauth%2Fgithub%2Fcallback&login=&scope=user:email&state=ewori4t95k3vdzem`. The `client_id` is the app we created to allow our users to sign in. When you create this app, you specify the `redirect_uri` in the configuration, and you reference that here as well. `scope` specifies scope of access we are requesting from the user's social account. `state` is used for security.

10. When you click on the link above, you are redirected to GitHub and asked if you want to grant my GitHub application access to your account's associated email address. Clicking on "Authorize" then redirects you back to the `redirect_uri`: `http://localhost/auth/github/callback?code=veroi3409e203ej&state=ewori4t95k3vdzem`. Notice the `code` parameter.

11. When you navigate to `/auth/github/callback` on the Vue application, you see a message: "Logging in with GitHub...". On this page's `mounted` method we call `handleOauthCallback` which makes a request to our Django application: `/api/social/github/?code=veroi3409e203ej`.

12. This API endpoint uses the `exchange_token` view which is where Python Social Auth starts to do the heavy lifting. First, we need to make an API request to GitHub (`https://github.com/login/oauth/access_token`) with the `code` as a URL parameter, then we pass the access code that this API call returns into Python Social Auth's `do_auth` function to get our Django user. Finally, similar to the email/password login approach described above, we call `login(request, user)` and return a simple JSON response: `{"detail": "success"}`. This will set the `sessionid` automatically when the response returns, and we can dispatch the same Vuex action `AUTH_SUCCESS` to tell Vuex that a user has been logged in.

## Discussion

Using the default Django session authentication mechanism has some nice advantages. It allows us to easily navigate between our Javascript SPA which uses Django REST Framework, regular Django admin views that you may also be using, as well as the Django admin.

Using DRF's token authentication is still possible if you choose to use Session authentication for your JS frontend. For example, you may wish to allow users to make authenticated API requests to your public API using DRF Token Authentication.

JWT is a really interesting concept and important to know about, but it doesn't seem like a practical solution for any of my use cases with Django APIs or frontends. You also can't really "logout" a user if you are using this solution for authentication.

What I have described here is pretty simple scenario. It assumes that there is only one type of user and that there are no additional steps needed to make your account "active". Doing this would require additional logic on the Vue/Vuex side as well as the backend logic, including the User model. I also don't make use of any data from the social providers except for the user's email address.

Another thing to be aware of with this scenario is that a user can register with social authentication first, and then reset their password and login with email (I haven't implemented this client-side on this project yet). Or, you can login with an email account that was created through the Django admin and then login with a social account tied to that email. There are a lot of options for each backend in Python social auth, making it a very flexible library for handling social authentication.

## Next Steps

There is a lot more work to do on this example project regarding authentication, but I hope it can help point some people in the right direction. Here are some areas that I would like to work on next:

- Error handling for a bad authentication attempt
- A signup form with email confirmation, handling cases where the user trying to signup may already have signed in with social authentication
- Password reset with email
- Making use of Python Social Auth settings and options, including pipelines.

## Resources

- [https://www.toptal.com/django/integrate-oauth-2-into-django-drf-back-end](https://www.toptal.com/django/integrate-oauth-2-into-django-drf-back-end)
- [https://yoongkang.com/blog/cookie-based-authentication-spa-django/](https://yoongkang.com/blog/cookie-based-authentication-spa-django/)
- [https://github.com/encode/django-rest-framework/issues/7273](https://github.com/encode/django-rest-framework/issues/7273)
- [https://github.com/SimpleJWT/django-rest-framework-simplejwt/issues/71](https://github.com/SimpleJWT/django-rest-framework-simplejwt/issues/71)
- [http://cryto.net/~joepie91/blog/2016/06/13/stop-using-jwt-for-sessions/](http://cryto.net/~joepie91/blog/2016/06/13/stop-using-jwt-for-sessions/)