from configparser import Error
from os import terminal_size
from flask import Flask, render_template, request, session, url_for
# from livereload import Server
from mysql.connector import Error
from werkzeug.utils import redirect
from workbench import Workbench
from random import randint
from datetime import date
# from webui import WebUI

mysql_pwd = "1234"

myapp = Flask(__name__)
# ui = WebUI(myapp, debug= True)
myapp.secret_key = 'ABCDEF'

@myapp.route('/', methods = ['GET', 'POST'])
def index():
    login_status=None
    if request.method == 'POST':
        payload = request.form
        print(payload)
        payload = payload.copy()
        if payload['user'] == 'customer':
                tableName = "customers"
                idName = 'custID'
                idPrefix = 'C-'
                if 'orgname' in payload: 
                    payload.pop('orgname')
        else:
            tableName = 'suppliers'
            idName = 'supplierID'
            idPrefix = 'S-'
        payload.pop('user')
        dB = Workbench(database = 'minProj', password = mysql_pwd)
        if 'login' in payload :
            whereClause = dict([x for x in payload.items() if 'login' not in x])
            # print(userDat)
            userData = dB.select_from(tableName, where_clause = whereClause)
            # print(userData)
            if userData :
                login_status = True 
                if payload['email'] not in session:
                    session['email'] = payload['email']
                    session['userid'] = userData[0][idName]
                    session['firstname'] = userData[0]['firstname']
                if idPrefix == 'C-':
                    return redirect(url_for('home'))
                else:
                    return redirect(url_for('sellerHome'))
            else:
                login_status = False
                return render_template("index.html", login_status = login_status)
        else:
            print(payload)
            values = dict([x for x in payload.items() if 'signup' not in x])
            # print(values)
            values[idName] = idPrefix + str(randint(1,9999999) + randint(1,999999))
            values['joinDate'] = str(date.today())
            try:
                dB.insert_into(tableName, values)  
                if payload['email'] not in session:
                    session['email'] = payload['email']
                    session['userid'] = payload[idName]
                    session['firstname'] = payload['firstName']
                    if idPrefix == 'C-':
                        return redirect(url_for('home'))
                    else:
                        return redirect(url_for('sellerHome'))
                else:
                    return redirect(url_for('home'))
            except Error as e:
                if 'Duplicate entry' in str(e):
                    print(e)
                    login_status = 'Already Exists'
                    return render_template('index.html', login_status= login_status)
    
    else:    
        return render_template("index.html")

@myapp.route('/Customerhome/')
@myapp.route('/Customerhome/<int:items>')
def home(items = 20):
    if 'email' in session:
        user = session['email']
        firstname = session['firstname']
        db = Workbench('minProj', password=mysql_pwd)
        products = db.select_from('products')
    else:
        return redirect(url_for('index'))
    
    return render_template('home.html',user = user, firstname = firstname, products=products , items=items, login_status = True)

@myapp.route('/sellerHome')
def sellerHome():
    if 'email' in session:
        user = session['email']
        firstname = session['firstname']
        db = Workbench('minproj',password='1234')
        uid = session['userid']
        productdetails = db.select_from('supplierdet',where_clause={'supplierID':uid})
        productlist = []
        for x in productdetails:
            product=db.select_from('products',where_clause={'prodID':x['prodID']})[0]
            productlist.append(product)
         
    else:
        return redirect(url_for('index'))
    
    return render_template('sellerHome.html',user = user, firstname = firstname, productdetails=productdetails, productlist=productlist, login_status = True)

@myapp.route('/profile')
def profile():
    if 'email' in session:
        user = session['email']
        firstname = session['firstname']
    else:
        return redirect(url_for('index'))
    return render_template('profile.html',user = user, firstname = firstname, login_status = True)


@myapp.route('/cart')
def cart():
    if 'email' in session:
        user = session['email']
        firstname = session['firstname']
    else:
        return redirect(url_for('index'))
    return render_template('cart.html',user = user, firstname = firstname, login_status = True)



@myapp.route('/sellerProfile')
def sellerProfile():
    pass    

@myapp.route('/myOrders')
def myOrders():
    pass

@myapp.route('/productPage')
def productPage():
    pass

@myapp.route('/payment')
def payment():
    pass

@myapp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

if __name__ == "__main__":
    myapp.run(debug=True)

