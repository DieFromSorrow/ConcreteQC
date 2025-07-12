from flask import Flask, render_template
from extends import db
from config import Config
from apis import bp as api_bp


app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
app.register_blueprint(api_bp)


@app.route('/')
def index():  # put application's code here
    return render_template('index.html')



