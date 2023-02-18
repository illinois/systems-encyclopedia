---
title: Flask Ports

date: 2022-09-20

authors:
  - smadha8
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism-themes/1.9.0/prism-a11y-dark.min.css" integrity="sha512-bd1K4DEquIavX49RSZHIE0Ye6RFOVlGLhtGow9KDbLYqOd/ufhshkP0GoJoVR1jqj7FmOffvVIKuq1tcXlN9ZA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

# Default Port

By default, Flask servers run on port 5000 or the local host in the  main `app.py` file. However, the port can be changed or configured for back-end microservices or secondary microservices outside of the topmost hierarchical `app.py` Flask file. 

# Changing Ports 
Adding the `app.run` command in the main Flask app file can choose a different port to expose the microservice on.

```python
app.run(host='0.0.0.0', port=8080)
```

The above command starts the web app on the local host at port 8080. 

# Adding Ports
Adding microservices involve running them on separate ports so they can function together, or feed into a single middleware. 

For example, in an Flask application  that uses the Courses Microservice, the microservice URL needs to be run separately by performing a `cd` into the relevant directory. Without the run command present as mentioned in the previous section, a `.env` file can be specified. 


For example, `.env` in the root directory of the project mentioned above can include the following line. 
```
COURSES_MICROSERVICE_URL="http://127.0.0.1:24000"
```

Many microservices can have many different `.env` files, however they should all be on different ports. 

A subject microservice can be created with `.env`
```
COURSES_MICROSERVICE_URL="http://127.0.0.1:24001"
```

This URL can be accessed via a GET request in the main `app.py` using the requests library mentioned in the previous article. 

# Flask CLI Options
Here are other config variables that can be added.

FLASK_ENV - Controls the environment.
FLASK_DEBUG - Enables debug mode.
FLASK_RUN_EXTRA_FILES - A list of files that will be watched by the reloader in addition to the Python modules.
FLASK_RUN_HOST - The host you want to bind your app to.
FLASK_RUN_PORT - The port you want to use.
FLASK_RUN_CERT - A certificate file for your app, so that it can be run with HTTPS.
FLASK_RUN_KEY - The key file for your certificate.

These options can also be indicated in the environment file. 

```python
#.flaskenv
FLASK_APP=demo
FLASK_ENV=development
FLASK_RUN_PORT=8080
```

# Virtual Environments
Python projects live in virtual environments, however the user can specify virtual environments to avoid conflicts. 

For example if Project 1 needs 1.0 of Flask or a package such as PIL for reading images, and Project 2 needs version 2.0, installing these packages system-wide can interfere and cause package conflicts.  

Follow these steps in a terminal to create a virtual environment. 

```shell 
sudo apt-get install python3-venv
```

You can create a project directory via
```shell
mkdir flaskexample
cd flaskexample
```

Creating a virtual environment within the project directory can be performed via a simple creation command to set the env to name 'venv.':

```shell
python3 -m venv venv
```

Activating the virtual environment on Linux:

```shell
source venv/bin/activate
```

and on Windows:

```shell
venv\Scripts\activate
```

The following message should appear on the terminal

```shell
(venv) ➜  flaskexample 
```



## Further Reading

https://flask.palletsprojects.com/en/2.2.x/config/


