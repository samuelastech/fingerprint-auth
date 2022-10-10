from src import app

@app.route('/')
def hello_world():
    return 'hello world'