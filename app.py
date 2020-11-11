from configparser import Error
from os import terminal_size
from flask import Flask, render_template, request, session, url_for
from mysql.connector import Error
from werkzeug.utils import redirect
from workbench import Workbench
from random import randint
from datetime import date
# from webui import WebUI



mysql_pwd = "Ashu@12345"


myapp = Flask(__name__)
# ui = WebUI(myapp, debug= True)
myapp.secret_key = 'ABCDEF'

@myapp.route('/', methods = ['GET', 'POST'])
def index():
    login_status=None
    if(request.method == 'POST'):
        payload = request.form
        # print(payload)
        dB = Workbench(database = 'minProj', password = mysql_pwd)
        if('login' in payload):
            whereClause = dict([x for x in payload.items() if 'login' not in x])
            # print(userDat)
            userData = dB.select_from('Customers', where_clause = whereClause)
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
            print(payload)
            values = dict([x for x in payload.items() if 'signup' not in x])
            # print(values)
            values['custID'] = randint(1,9999999) + randint(1,999999)
            values['joinDate'] = str(date.today())
            try:
                dB.insert_into('Customers', values)  
                if payload['email'] not in session:
                    session['email'] = payload['email']
                    return redirect(url_for('home'))
                else:
                    return redirect(url_for('home'))
            except Error as e:
                if 'Duplicate entry' in str(e):
                    print(e);
                    login_status = 'Already Exists'
                    return render_template('index.html', login_status= login_status)
    
    else:    
        return render_template("index.html")

@myapp.route('/home')
def home():
    if 'email' in session:
        user = session['email']
    else:
        return redirect(url_for('index'));
    
    return render_template('home.html',user = user, login_status = True)

@myapp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

if __name__ == "__main__":
    myapp.run(debug=True)

