---

layout: post
title: Setting up a Flask Backend with a ReactJS frontend using create-react-app
date: 2018-05-27
comments: true

---

This post will show how to setup a flask app that uses ReactJS for the frontend. 

I'll walk through setup step-by-step. The code for this project will be available [here](https://www.github.com).

# Project Setup

First, lets create a new directory for our flask/react project: 

```
mkdir flask-react-app && cd flask-react-app
virtualenv -p python3 env
source env/bin/activate
pip install flask
```

Next, let's setup a simple flask app as described in the [flask documentation](): 

*app.py*

```python
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"
```

Next, set the flask app name and run the app: 

```
export FLASK_APP=app.py
python -m flask run
 * Serving Flask app "app.py"
 * Environment: production
   WARNING: Do not use the development server in a production environment.
   Use a production WSGI server instead.
 * Debug mode: off
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```

Now that this is working, let's setup our react app. In the same folder where we have our virtual environment: 

```
create-react-app frontend
```

Here's our project structure: 

```
tree -L 2
.
├── app.py
├── env
│   ├── bin
│   ├── include
│   ├── lib
│   └── pip-selfcheck.json
└── frontend
    ├── node_modules
    ├── package.json
    ├── public
    ├── README.md
    ├── src
    └── yarn.lock
```

Now, we need to modify our flask app to: 

1. Serve the static folders in our `frontend` folder and
2. Use a "catch-all" route that will send requests to our react app.

The "catch-all" route will allow us to define other routes, like API endpoints that the React app can make requests to, such as `/api/widgets/` to return a JSON array of database items. 

This is important since our React app will use the `react-router` package to change the browser's URL when we change between different links in our React app. I found an example of how this type of route can be setup in [this Stack Overflow post](https://stackoverflow.com/questions/44209978/serving-a-create-react-app-with-flask/45634550):

*app.py*

```
import os
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='frontend/build')

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists("frontend/build/" + path):
        return send_from_directory('frontend/build', path)
    else:
        return send_from_directory('frontend/build', 'index.html')


if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)
```

A few things about this:

The latest version of flask uses Click (a python command line utility) to start flask. The last line (after `if __name__ == '__main__'`) are not used when you start flask with: 

```
python -m flask run
```

However, when you run

```
python app.py
```

these lines are executed.

If you are using `python -m flask run`, you should add `export FLASK_APP=app.py` to the virtual environment startup script: 

```
echo "export FLASK_APP=app.py" >> env/bin/activate
```

First, we import `Flask` and `send_from_directory`. Next, we instantiate our flask app and set the `static_folder` to be `frontend/build`. If you look at the `frontend` directory, you will see that there is no `build` folder. To make this, we need to run:

```
npm run build
```

Next, we see chained decorators. This pattern is described [here](http://flask.pocoo.org/snippets/57/):

> A simple way to create a Catch-All function which serves every URL including / is to chain two route filters. One for the root path '/' and one including a path placeholder for the rest.

> We can't just use one route filter including a path placeholder because each placeholder must at least catch one character.

## Eject create-react-app

Next we will run `npm run eject` to eject from the default settings that `create-react-app` provides. This allows us to edit the webpack files for development and production. The first change I make is to enable CSS modules.

After we run `npm run eject`, we must run `npm install` to add dependencies for webpack (I think).

To do this, add the following lines to `webpack.config.dev.js` and `webpack.config.prod.js`: 

```js
modules: true,
localIdentName: '[name]__[local]___[hash:base64:5]'
```

*frontend/config/webpack.config.dev.js*

```js
          {
            test: /\.css$/,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                  modules: true,
                  localIdentName: '[name]__[local]___[hash:base64:5]'
                },
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  // Necessary for external CSS imports to work
                  // https://github.com/facebookincubator/create-react-app/issues/2677
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                      browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9', // React doesn't support IE8 anyway
                      ],
                      flexbox: 'no-2009',
                    }),
                  ],
                },
              },
            ],
          },
```


*frontend/config/webpack.config.prod.js*

```js
          {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract(
              Object.assign(
                {
                  fallback: {
                    loader: require.resolve('style-loader'),
                    options: {
                      hmr: false,
                    },
                  },
                  use: [
                    {
                      loader: require.resolve('css-loader'),
                      options: {
                        importLoaders: 1,
                        minimize: true,
                        sourceMap: shouldUseSourceMap,
                        modules: true,
                        localIdentName: '[name]__[local]___[hash:base64:5]'
                      },
                    },
                    {
                      loader: require.resolve('postcss-loader'),
                      options: {
                        // Necessary for external CSS imports to work
                        // https://github.com/facebookincubator/create-react-app/issues/2677
                        ident: 'postcss',
                        plugins: () => [
                          require('postcss-flexbugs-fixes'),
                          autoprefixer({
                            browsers: [
                              '>1%',
                              'last 4 versions',
                              'Firefox ESR',
                              'not ie < 9', // React doesn't support IE8 anyway
                            ],
                            flexbox: 'no-2009',
                          }),
                        ],
                      },
                    },
                  ],
                },
                extractTextPluginOptions
              )
            ),
            // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
          },
```

This step is not absolutely necessary, but I think it is a great way to manage CSS classes for React components. 

## React Router

Next we will install react router, a package that will allow us to display different components for different URLs, and also easily create links between these pages. 

```
npm install react-router-dom --save
```

