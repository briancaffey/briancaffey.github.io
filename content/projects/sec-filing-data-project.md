---
layout: project
title: "Open SEC Data: A web app and API for processing 13F Filing data from SEC.gov"
comments: true
permalink: /projects/six-degrees-of-subreddits
github: briancaffey/sec-filings-app
image: /static/sec.jpg
link: /2020/11/29/weekend-project-update-open-sec-data
date: 2020-11-29
---


Here's an early look at a project I have been working on to practice some Django and Vue.js concepts: Open SEC Data.

- [https://opensecdata.ga](https://opensecdata.ga) (project staging website, deployed to docker swarm cluster running on DigitalOcean)
- [https://gitlab.com/briancaffey/sec-filings-app](https://gitlab.com/briancaffey/sec-filings-app) (main repository, requires GitLab account)
- [https://github.com/briancaffey/sec-filings-app](https://github.com/briancaffey/sec-filings-app) (mirror, no account required to view)

This project uses Django, DRF and Celery to read public SEC filings from [sec.gov](https://www.sec.gov/Archives/edgar/full-index/), build it into an API which is consumed through a Vue.js application. I'm currently focused on 13F filings which are required for large US investment funds managing over $100 million USD. There is data dating back to 1993 and it is published quarterly.

Here are some of the things I'm focusing on in this project in no particular order:

- Getting better at Django REST Framework. This project has been helping me apply some of the parts of DRF that I have found difficult. I'm currently using ViewSets which feels function-based views inside of class-based views. They are flexible, but I would like to add more abstraction with filtering

- Django admin. While this project primarily uses Django as a REST API with Django REST Framework, I have tried to take advantage of the Django admin to build out helpful views that can be used to spot check the data I'm creating. Most of my API is read-only, this makes things pretty simple.

- Moderately complex paginated data tables with Vue. I work with lots of paginated table data, and I think there is a better way to do abstract some of the repeated logic that I use (getting and setting current page, rows per page). I'm using Vuex, and I have heard of module factories, but I'm thinking that there will be a better way to do this when Vue 3 officially comes to Quasar Framework (Quasar is a Vue.js framework).

- Session authentication with DRF. There are a lot of guides showing how to use JWT and Token Authentication for DRF with Javascript frontends. The DRF recommends using Session Authentication for such use cases as a web-base Javascript client, so I hope I can promote some best practices around how to use Django's built-in session authentication for use with the Django REST Framework using an HttpOnly session cookie. I also understand that all security decisions have trade-offs, and I'm trying to understand what trade-offs come with handling authentication in this way.

- Social authentication. I have previously setup social authentication with Google, Facebook and GitHub using Python Social Auth. I think it is a great package, and it adds a lot of flexibility with it's concept of pipelines, but I haven't done much with these yet, so I'm hoping to dig in further and better understand how I can make better use of social authentication in my app. This app uses Linkedin 0Auth2 with a custom user model. Logging in with Linkedin account gives you the ability to request an API Token (Django REST Framework's Token) to access the public API.

- Automatic API documentation with OpenAPI. Swagger/OpenAPI seems like nice way to document and API, so I'm hoping to build best practices around how to document a DRF API automatically with OpenAPI and Swagger UI.

- CI/CD with GitLab and docker swarm. I will admit that I am huge GitLab fan. I love how flexible their CI/CD pipelines are. Being a docker fan as well, I chose to use docker swarm for this project to keep things simple and straightforward. I think one under-appreciate feature of docker is being able to set `DOCKER_HOST` to an SSH connection, such as `ssh://root@123.456.789.10`. This let's you control the remote docker host without needing to SSH to it first, and it is also how I'm able to deploy and run management commands "manually" through the GitLab UI.

- Productive development environment. To start the project, you only need to run docker-compose up (after copying `.env.template` to `.env` in the root directory for storing sensitive data outside of git such as LinkedIn OAuth2 keys). The development environment is very similar to how this project runs in production with some additional utilities for monitoring and debugging such as pgadmin4, flower (for celery), redis commander (a GUI for viewing redis databases), Django debug toolbar (a must have for any Django project, I believe), runserver_plus with Werkzeug, and others. Also, the backend and frontend hot reload automatically with the help of webpack for Vue and watchdog for Django and Celery.

- Automatic TLS certificate generation with Traefik. For a simple project in docker swarm, I'm really happy with how simple it is to request TLS certificates from Let's Encrypt automatically with Traefik. There are no scripts, cron jobs or one-time setup jobs, it just seems to work out of the box if configured correctly.

- Testing with pytest. I have only been trying to test most of my API views so far. I really like using factory with pytest, so I use that in most of my tests.

That's all I have for now. I have a long list of questions, things I want to improve, add and experiment with, here are just a few that come to mind:

- Frontend testing. I don't have any component testing or e2d tests, so this would be good to add eventually. Since I'm using a component library and my app uses these components directly, I'm not exactly sure how much testing I should be doing.

- Data verification/validation. There are a lot of site that do provide similar data, WhaleWisdom is the biggest one that I know of. Once I get more data built on the site it would be good to spot check some of the values. There are some nuances to the filing data that I haven't addressed, such as Amendment filings and additions.

- Calculating period changes. One of the features that I'm not sure how best to implement is the ability to sort holdings for a filer in a given period on the percent increase from the last period. One way would be to add these as additional fields to the Holding model and then calculate these values as I process the data in celery. If I process the data from recent periods to later periods, I will have to update these values once the previous period has been processed, so it would be an additional check to do. I'll probably post this question here in more detail later. Here's [an example of what this means from WhaleWisdom](https://whalewisdom.com/filer/ubs-ag#tabholdings_tab_link).

- Accessing LinkedIn profile data to populate fields on my CustomUser model.

- Scaling? I have a lot more experience with deploying projects to AWS which is built around the ability to scale. I don't know a project on DigitalOcean would be scaled automatically. A single node docker swarm cluster while take some time to process all of the data. I would probably be better of scaling vertically with much bigger droplets and higher celery concurrency.

- Docker swarm secrets. I'm currently using environment variables to pass secrets stored in GitLab CI when I build images and deploy to docker swarm. I would like to learn how to properly use swarm secrets and work them into my CI/CD pipeline.

- As I mentioned above, I'm also interested in updating this project to Vue3 and to apply some of its new features to this project.

- Use pipenv, poetry or some other way of pinning secondary python dependencies. Does anyone have a recommendation on how best to do this with docker. I have always thought that docker *is* the virtual environment, but I realize that some versions of indirect dependencies may change when pip installing without using a lockfile similar to `package-lock.json`.