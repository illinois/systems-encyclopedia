---
title: Flask Requests

date: 2022-09-20

authors:
  - smadha8
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-a11y-dark.min.css" integrity="sha512-bd1K4DEquIavX49RSZHIE0Ye6RFOVlGLhtGow9KDbLYqOd/ufhshkP0GoJoVR1jqj7FmOffvVIKuq1tcXlN9ZA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

# Making Web Requests 

Making HTTP requests is a core concept of networking, and Flask provides a built-in way to retrieve and post data to the browser. 

The requests library can be imported for use via

```python
from flask import Flask, request
```

In order to use the requests library, the type of request must be specified in the route, for example 

```python
@app.route('/login', methods='POST')
def login():
    error = None
    
    if valid_login(request.form['username'],
        request.form['password']):
        return "log_the_user_in", 200
        else:
            error = 'Invalid username/password'

```

The route above represents a POST request made through a form on the browser, where the data can be automatically accessed. 

Data posted can also be accessed via JSON. 

```python
@app.route('/courseTime', methods='POST')
def login():
    request.json()
    course_time = request['course']
    return course_time  

```

More than one request can also be handled at once. For example, one can respond differently to a GET and POST request. 

```python 
from flask import request

@app.route('/', methods=['GET', 'POST'])
def parse_request():
    if request.method == 'POST'
      data = request.data 
      # modify the data based on what is inputted
    return render_template('index.html')
```

The attributes available on the request object (from the requests library) can involve unique ways of accessing the request body. 

## request.data 
Contains the incoming request data as string in case it came with a mimetype Flask does not handle.

## request.args
The key/value pairs in the URL query string.

## request.form
The key/value pairs in the body, from a HTML post form, or JavaScript request that isn't JSON encoded.


## request.files
The files in the body, which Flask keeps separate from form. HTML forms must use enctype=multipart/form-data or files will not be uploaded.

## request.values
Combined args and form, preferring args if keys overlap.

## request.json
Parsed JSON data. The request must have the application/json content type, or use request.get_json(force=True) to ignore the content type.
All of these are MultiDict instances (except for json). You can access values using:

request.form['name']: Use indexing if you know the key exists
request.form.get('name'): Use get if the key might not exist
request.form.getlist('name'): Use getlist if the key is sent multiple times and you want a list of values and only returns the first value.

## Further Reading

Request library documentation: https://tedboy.github.io/flask/generated/generated/flask.Request.html


