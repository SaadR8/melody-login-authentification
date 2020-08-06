from flask import Flask, redirect, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import sys
import numpy as np
import base64
from classifier import classify


app = Flask(__name__)
cors = CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)


class Login(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(200), unique=True, nullable=False)
    passwd = db.Column(db.String(200), nullable=False)
    timing = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username


# test = Login(id=1, username='test', passwd='test', timing='600,75,50')

# db.session.add(test)
# db.session.commit()


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        #timing = data.get('timing')
        passwd = data.get('passwd')
        user = data.get('user')

        log = Login.query.filter_by(username=user).first()

        if log == None:
            return {"result": False}

        if log.passwd == passwd:
            return {"result": True}
        else:
            return {"result": False}

        """
        timing2 = list(map(int, log.timing.split(',')))

        for i in range(len(timing2)):

            if abs(timing[i] - timing2[i]) > 100:
                return {"result": False}

        return {"result": True}
        """

    return {"result": 'pre-POST check'}


@app.route('/prelogin', methods=['GET'])
def prelogin():
    user = request.args.get('user')
    # data = request.get_json()

    # user = data.get('user')
    log = Login.query.filter_by(username=user).first()

    if log == None:
        return {"result": False}

    salt = log.passwd[0:29]

    return {"result": salt}


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        data = request.get_json()
        timing = data.get('timing')
        passwd = data.get('passwd')
        user = data.get('user')

        id = Login.query.order_by(-Login.id).first().id + 1

        print(id, file=sys.stderr)
        print(user, file=sys.stderr)
        print(passwd, file=sys.stderr)
        print(timing, file=sys.stderr)

        new_user = Login(id=id, passwd=passwd, username=user, timing=timing)

        try:
            db.session.add(new_user)
            db.session.commit()
            return {"result": "You have been registered"}
        except:
            return {"result": "Username has been taken"}

    return {"result": 'pre-POST check'}


@app.route('/soundlogin', methods=['GET', 'POST'])
def soundlogin():
    if request.method == 'POST':
        data = request.form
        audio = data['audio']
        #print(type(audio), file=sys.stderr)
        audio = base64.b64decode(audio)
        f = open('test.webm', 'wb')
        f.write(audio)
        f.close()
        #result = classify(audio)
        #print(result, file=sys.stderr)

        return {"result": "audio saved"}

    return {"result": 'pre-POST check'}


if __name__ == "__main__":
    app.run(debug=True)
