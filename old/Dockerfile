FROM ruby:2.3

RUN gem install jekyll

RUN mkdir /code

WORKDIR /code

EXPOSE 4000

CMD ["jekyll", "serve"]