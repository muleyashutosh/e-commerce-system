from os import terminal_size
from flask import Flask, render_template, request, session, url_for
from werkzeug.utils import redirect
from workbench import Workbench
import os
from dotenv import load_dotenv


load_dotenv()
mysql_pwd = os.getenv('mySQL_muleyashutosh_password')


myapp = Flask(__name__)
myapp.secret_key = 'ABCDEF'

@myapp.route('/', methods = ['GET', 'POST'])
def Hello_World():
    if(request.method == 'POST'):
        payload = request.form
        # print(payload)
        dB = Workbench(password = mysql_pwd)

        if('login' in payload):
            whereClause = dict([x for x in payload.items() if 'login' not in x])
            # print(userDat)
            userData = dB.select_from('users', where_clause = whereClause)
            # print(userData)
            if(userData):
                login_status = True
                if payload['email'] not in session:
                    session['email'] = payload['email']
                    return redirect(url_for('home'))
                else:
                    return redirect(url_for('home'))
            else:
                login_status = False
                return render_template("index.html", login_status = login_status)
        else:
            values = dict([x for x in payload.items() if 'signup' not in x])
            # print(values)
            dB.insert_into('users', values)  
            data = True
            if payload['email'] not in session:
                    session['email'] = payload['email']
                    return redirect(url_for('home'))
            else:
                return redirect(url_for('home'))
            


    else:    
        return render_template("index.html")

@myapp.route('/home')
def home():
    
    user = session['email']
    return render_template('home.html',user = user, login_status = True)


if __name__ == "__main__":
    myapp.run(debug = True)

