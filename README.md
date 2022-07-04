# Sing-along App

## Installation

- Backend
  - Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
  - Install poetry
    - `pip3 install "poetry==1.1.13"`
  - Run `docker-compose up`
- Frontend
  - Install NPM
    - `brew install node`
  - Install Yarn
    - `npm install --global yarn`

## Stack brainstorming

- Web server
  - Typescript
  - React
  - Python/Django
  - Websockets
  - Material UI
  - Docker
  - Datadog?
- Async
  - RQ

https://profy.dev/article/react-tech-stack#1-most-popular-react-libraries

## App design

Standard web server w/ db, when songs are requested search the db to see if they already exist. If they don’t exist, fire off a request to the async server which can go out and locate the song, then hit a webhook on the web server with the result

# References

- [Docker tutorial for python](https://docs.docker.com/samples/django/)
- [Building a hybrid python/react app](https://fractalideas.com/blog/making-react-and-django-play-well-together-hybrid-app-model/)
