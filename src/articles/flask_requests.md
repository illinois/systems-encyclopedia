---
title: Flask Requests

date: 2022-09-20

authors:
  - smadha8
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-a11y-dark.min.css" integrity="sha512-bd1K4DEquIavX49RSZHIE0Ye6RFOVlGLhtGow9KDbLYqOd/ufhshkP0GoJoVR1jqj7FmOffvVIKuq1tcXlN9ZA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

# Making Web Requests 

Making HTTP requests is a core concept of networking, and Flask provides a built-in way to retrieve and post data to the browser. 

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

The minimal Flask python file above is an example of user-defined routes.

1. The first line imports the flask class for Python.
2. Next, an instance of this flask class is created and stores it in the variable "app."
   **name** is a shorthand directive so Flask can locate Flask templates.
3. The route() function gives Flask a direction to use a route.
4. The function hello_world renders the message 'Hello World' to the browser when the '\' is retreived via a user GET request.

## Compiling and running Flask microservices

```python
pip install Flask
```

To run the Flask application,

```python
python -m flask run
```

This command will run on a local browser.
To run it on an externally visible port with public IP's, use

```python
flask run --host=0.0.0.0
```

To run with specific flags, the flags can be added to the run command. A useful flag for developing is

```python
python --app {app name} --debug run
```

## Further Reading

Flask documentation is very organized:
https://flask.palletsprojects.com/en/2.2.x/quickstart/

The next articles will delve on tutorials on how to implement useful functionality in Flask.
