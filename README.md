# {{project_name}}

- [{{project_name}}](#projectname)
  - [Overview](#overview)
  - [Features](#features)
  - [How to install](#how-to-install)
  - [Environment variables](#environment-variables)
  - [How to start](#how-to-start)

## Overview

This is a simple **Django 2.0+** project template with my preferred setup. It is setup so Django acts as an **API** to a **ReactJS client**. Django wraps the client application in a **Template View**, utilizing Django's auth decorator.

## Features

- Django 2.0+
- Uses [Pipenv](https://github.com/kennethreitz/pipenv) - the officially recommended Python packaging tool from Python.org.
- Development, Staging and Production settings with [django-configurations](https://django-configurations.readthedocs.org).
- Get value insight and debug information while on Development with [django-debug-toolbar](https://django-debug-toolbar.readthedocs.org).
- Collection of custom extensions with [django-extensions](http://django-extensions.readthedocs.org).
- HTTPS and other security related settings on Staging and Production.
- PostgreSQL database support with psycopg2.

## How to install

```bash
$ django-admin.py startproject \
  --template=https://github.com/marksmall/django-project-template/archive/master.zip \
  --extension=py,md,template \
  project_name
$ mv example.env .env
$ mv Dockerfile.docker Dockerfile
$ mv docker-compose.yml.docker docker-compose.yml
$ pipenv install
```

This will scaffold a new Django/React project, ran inside Docker containers. `project_name` should be the name you want to give to your project. The name you give your project will be interpolated through the files with the **extensions**, named in the command.

## Environment variables

These are common between environments. The `ENVIRONMENT` variable loads the correct settings, possible values are: `DEVELOPMENT`, `STAGING`, `PRODUCTION`.

```bash
ENVIRONMENT=DEVELOPMENT
DJANGO_SECRET_KEY=dont-tell-eve
DJANGO_DEBUG=yes
```

These settings(and their default values) are only used on staging and production environments.

```bash
DJANGO_SESSION_COOKIE_SECURE=yes
DJANGO_SECURE_BROWSER_XSS_FILTER=yes
DJANGO_SECURE_CONTENT_TYPE_NOSNIFF=yes
DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS=yes
DJANGO_SECURE_HSTS_SECONDS=31536000
DJANGO_SECURE_REDIRECT_EXEMPT=
DJANGO_SECURE_SSL_HOST=
DJANGO_SECURE_SSL_REDIRECT=yes
DJANGO_SECURE_PROXY_SSL_HEADER=HTTP_X_FORWARDED_PROTO,https
```

## How to start

Starting the project starts 3 separate **Docker containers** (in order):

1. Database
1. Client front-end
1. Server api

```bash
$ docker-compose up --build
$ docker-compose exec server createsuperuser
```
