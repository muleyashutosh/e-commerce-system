from flask import Flask, json, render_template, request, session, url_for, jsonify
from mysql.connector import Error
from werkzeug.utils import redirect
from workbench import Workbench
from random import randint
from datetime import date
import re
from re import I
import webbrowser
from flask_cors import CORS
import bcrypt
from db_config import CONFIG


app = Flask(__name__)

CORS(app)


db = Workbench(**CONFIG)

app.secret_key = 'ABCDEF'

allproducts = []


@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template("index.html")


# login route
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    # print(data)
    email, password, user = data.values()
    tableName = 'customers' if user == 'customer' else 'suppliers'
    idName = 'custID' if user == 'customer' else 'supplierID'
    try:
        userData = db.select_from(
            tableName, [idName, 'firstname'], {'email': email})
        # print(userData)
    except Error as e:
        print('error while trying to get userData')
        print(e)
        return jsonify({'status': 'Error trying to find the user data'})

    if not userData:
        return jsonify({'status': 'User Not Found'})
    else:
        userID = userData[0][idName]
        try:
            hashedPassword = db.select_from(
                'passwords', ['hash'], {'userID': userID})
        except:
            # print(userID)
            print('error while trying to get the password hash')
            return jsonify({"status": 'Error trying to find the user data'})

        hashedPassword = hashedPassword[0]['hash']
        if bcrypt.checkpw(password.encode(), hashedPassword.encode()):
            if email not in session:
                session['email'] = email
                session['firstname'] = userData[0]["firstname"]
                session['userID'] = userID
            return jsonify({"status": 'verified'})
        else:
            return jsonify({'status': "Invalid Credentials"})


# register route
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    # print(data)
    password = data['pwd']
    user = data['user']
    tableName, idName, idPrefix = (
        'customers', 'custID', 'C-') if user == 'customer' else ('suppliers', 'supplierID', 'S-')
    # data.pop('signup')
    data.pop('user')
    data.pop('pwd')
    data[idName] = idPrefix + str(randint(1, 9999999) + randint(1, 999999))
    data['joinDate'] = str(date.today())
    # print(data)
    userID = data[idName]
    try:
        db.insert_into(tableName, data)
    except Error as e:
        print(e)
        if 'Duplicate entry' in str(e):
            return jsonify({"status": "User already exists"})
        else:
            return jsonify({"status": 'Error inserting data into database'})

    hashedPassword = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    try:
        db.insert_into('passwords', {
            'hash': hashedPassword.decode(),
            'userID': userID
        })
    except Error as e:
        print(e)
        return jsonify({"status": 'Error hashing password to db'})

    if data['email'] not in session:
        session['email'] = data['email']
        session['firstname'] = data['firstname']
        session['userID'] = data[idName]
    return jsonify({"status": 'User registered successfully'})

# filter products route


@app.route('/api/filter', methods=['POST'])
def filter():
    data = request.json
    # print(payload)
    query = 'SELECT * FROM products'
    filters = []
    if (len(data) >= 1 and 'price' not in data) or len(data) > 1:
        categoryIDs = []
        for k, v in data.items():
            if k != 'price':
                categoryIDs.append(v)
        print(categoryIDs)
        cat = ['categoryID = ' + x for x in categoryIDs]
        cat = '(' + ' OR '.join(cat) + ')'
        filters.append(cat)

    if('price' in data):
        priceconstraint = '(minPrice'
        if data['price'] == '1':
            priceconstraint += '< 1000)'
        elif data['price'] == '2':
            priceconstraint += '>= 1000 AND minPrice<= 5000)'
        elif data['price'] == '3':
            priceconstraint += '>= 5000 AND minPrice<= 10000)'
        elif data['price'] == '4':
            priceconstraint += '>= 10000 AND minPrice<= 20000)'
        else:
            priceconstraint += '> 20000)'
        filters.append(priceconstraint)

    filters = ' AND '.join(filters)
    filters += ';'
    query = ' WHERE '.join([query, filters])
    print(query)
    try:
        products = db.select_from_custom(query)
    except Error as e:
        print(e)
        return jsonify({
            status: "Error while accessing database"
        })
    return jsonify({
        "status": "OK",
        "data": products
    })


@app.route('/Customerhome/', methods=['GET', 'POST'])
@app.route('/Customerhome/<int:page>', methods=['GET', 'POST'])
def home(page=1):
    if 'email' in session:
        perPage = 20
        startAt = perPage * page - perPage
        user = session['email']
        firstname = session['firstname']
        global allproducts
        if not len(allproducts):
            allproducts = db.select_from('products')
        products = allproducts
        totalPages = len(products) // 20 + 1
        # print(totalPages)
        products = products[startAt:startAt + perPage]
        filter = False
        payload = {
            "user": user,
            "firstname": firstname,
            "products": products,
            "page": page,
            "totalPages": totalPages,
            "filter": filter,
            "login_status": True
        }
        return render_template('home.html', **payload)
    else:
        return redirect(url_for('index'))


@app.route('/sellerHome')
def sellerHome():
    if 'email' in session:
        # user, firstname, uid = session.values()
        user = session['email']
        firstname = session['firstname']
        uid = session['userID']
        print(user, firstname, uid)
        productdetails = db.select_from(
            'supplierdet', where_clause={'supplierID': uid})
        productlist = [db.select_from('products', where_clause={'prodID': x['prodID']})[
            0] for x in productdetails]
        # print(productlist[0])

    else:
        return redirect(url_for('index'))

    return render_template('sellerHome.html', user=user, firstname=firstname, productdetails=productdetails, productlist=productlist, login_status=True)


@app.route('/Profile', methods=['GET', 'POST'])
def profile():
    if 'email' in session:
        login_status = True
        session['paymentdetailID'] = db.select_from("customers", attributes=[
                                                    'paymentdetailID'], where_clause={'custID': session['userID']})[0]['paymentdetailID']
        if request.method == 'POST':
            payload = request.form
            card = ['cardName', 'bankName', 'cardNum', 'cvv', 'expDate']
            payloads = dict([x for x in payload.items() if x[0]
                            not in card and x[0] != 'upiID'])
            cardinfo = dict([x for x in payload.items()
                            if x[0] in card and x[1] != ''])
            upiinfo = dict([x for x in payload.items()
                           if x[0] == 'upiID' and x[1] != ''])

            def dataenter():
                if session['paymentdetailID'] is None:
                    payinfo = dict()
                    payinfo['paymentdetailID'] = 'Pay-' + \
                        str(randint(1, 9999999) + randint(1, 999999))
                    if bool(cardinfo) != False:
                        cardinfo['carddetailID'] = 'Ca-' + \
                            str(randint(1, 9999999) + randint(1, 999999))
                        payinfo['carddetailID'] = cardinfo['carddetailID']
                        try:
                            db.insert_into("carddet", values=cardinfo)
                        except Error as e:
                            print(e)
                            return 'carddet.CardNum'
                    if bool(upiinfo) != False:
                        upiinfo['upidetailID'] = 'U-' + \
                            str(randint(1, 9999999) + randint(1, 999999))
                        payinfo['upidetailID'] = upiinfo['upidetailID']
                        try:
                            db.insert_into("upidet", values=upiinfo)
                        except Error as e:
                            print(e)
                            return 'upidet.upiID'
                    if 'upidetailID' in payinfo or 'carddetailID' in payinfo:
                        session['paymentdetailID'] = payinfo['paymentdetailID']
                        payloads['paymentdetailID'] = payinfo['paymentdetailID']
                        db.insert_into("paymentdet", values=payinfo)
                else:
                    print(session)
                    payinfo = db.select_from("paymentdet", where_clause={
                                             'paymentdetailID': session['paymentdetailID']})
                    print(payinfo)
                    if payinfo[0]['carddetailID'] != None:
                        if bool(cardinfo) != False:
                            try:
                                db.update_table("carddet", updates=cardinfo, where_clause={
                                                'carddetailID': payinfo[0]['carddetailID']})
                            except Error as e:
                                return 'carddet.CardNum'
                        else:
                            db.delete_from("carddet", where_clause={
                                           'carddetailID': payinfo[0]['carddetailID']})
                    elif bool(cardinfo) != False:
                        cardinfo['carddetailID'] = 'Ca-' + \
                            str(randint(1, 9999999) + randint(1, 999999))
                        payinfo[0]['carddetailID'] = cardinfo['carddetailID']
                        try:
                            db.insert_into("carddet", values=cardinfo)
                        except Error as e:
                            print(e)
                            return 'carddet.CardNum'
                        try:
                            db.update_table("paymentdet", updates=payinfo[0], where_clause={
                                            'paymentdetailID': session['paymentdetailID']})
                        except Error as e:
                            print(e)
                            return
                    if payinfo[0]['upidetailID'] != None:
                        if bool(upiinfo) != False:
                            try:
                                db.update_table("upidet", updates=upiinfo, where_clause={
                                                'upidetailID': payinfo[0]['upidetailID']})
                            except Error as e:
                                print(e)
                                return 'upidet.upiID'
                        else:
                            try:
                                db.delete_from("upidet", where_clause={
                                               'upidetailID': payinfo[0]['upidetailID']})
                            except Error as e:
                                print(e)
                                return
                    elif bool(upiinfo) != False:
                        upiinfo['upidetailID'] = 'U-' + \
                            str(randint(1, 9999999) + randint(1, 999999))
                        payinfo[0]['upidetailID'] = upiinfo['upidetailID']
                        try:
                            db.insert_into("upidet", values=upiinfo)
                        except Error as e:
                            print(e)
                            return 'upidet.upiID'
                        try:
                            db.update_table("paymentdet", updates=payinfo[0], where_clause={
                                            'paymentdetailID': session['paymentdetailID']})
                        except Error as e:
                            print(e)
                            return
            login_status = dataenter()
            try:
                db.update_table("customers", updates=payloads,
                                where_clause={'custID': session['userID']})
            except Error as e:
                if 'customers.pno_UNIQUE' in str(e):
                    print(e)
                    login_status = 'customers.pno_UNIQUE'
                if 'customers.email_UNIQUE' in str(e):
                    print(e)
                    login_status = 'customers.email_UNIQUE'
                else:
                    print(e)
        userinfo = db.select_from("customers", where_clause={
                                  'custID': session['userID']})
        result = None
        print(session)
        if session['paymentdetailID'] is not None:
            paymentdet = db.select_from("paymentdet", where_clause={
                                        'paymentdetailID': session['paymentdetailID']})[0]
            if paymentdet['carddetailID'] is not None:
                result = db.select_from("carddet", where_clause={
                                        'carddetailID': paymentdet['carddetailID']})[0]
            if paymentdet['upidetailID'] is not None:
                if result is not None:
                    print(result)
                    print(paymentdet)
                    result.update(db.select_from("upidet", where_clause={
                                  'upidetailID': paymentdet['upidetailID']})[0])
                else:
                    result = db.select_from("upidet", where_clause={
                                            'upidetailID': paymentdet['upidetailID']})[0]
        print(userinfo)
    else:
        return redirect(url_for('index'))
    return render_template('profile.html', user=userinfo, firstname=userinfo[0]['firstname'], payinfo=result, login_status=login_status)


@app.route('/cart')
def cart():
    if 'email' in session:
        user = session['email']
        firstname = session['firstname']
    else:
        return redirect(url_for('index'))
    return render_template('cart.html', user=user, firstname=firstname, login_status=True)


@app.route('/sellerProfile', methods=['GET', 'POST'])
def sellerProfile():
    if 'email' in session:
        login_status = True
        print(session)
        session['paymentdetailID'] = db.select_from("suppliers", attributes=[
                                                    'paymentdetailID'], where_clause={'supplierID': session['userID']})[0]['paymentdetailID']
        if request.method == 'POST':
            payload = request.form
            card = ['cardName', 'bankName', 'cardNum', 'cvv', 'expDate']
            payloads = dict([x for x in payload.items() if x[0]
                            not in card and x[0] != 'upiID'])
            cardinfo = dict([x for x in payload.items()
                            if x[0] in card and x[1] != ''])
            upiinfo = dict([x for x in payload.items()
                           if x[0] == 'upiID' and x[1] != ''])

            def dataenter():
                if session['paymentdetailID'] is None:
                    payinfo = dict()
                    payinfo['paymentdetailID'] = 'Pay-' + \
                        str(randint(1, 9999999) + randint(1, 999999))
                    if bool(cardinfo) != False:
                        cardinfo['carddetailID'] = 'Ca-' + \
                            str(randint(1, 9999999) + randint(1, 999999))
                        payinfo['carddetailID'] = cardinfo['carddetailID']
                        try:
                            db.insert_into("carddet", values=cardinfo)
                        except Error as e:
                            print(e)
                            return 'carddet.CardNum'
                    if bool(upiinfo) != False:
                        upiinfo['upidetailID'] = 'U-' + \
                            str(randint(1, 9999999) + randint(1, 999999))
                        payinfo['upidetailID'] = upiinfo['upidetailID']
                        try:
                            db.insert_into("upidet", values=upiinfo)
                        except Error as e:
                            print(e)
                            return 'upidet.upiID'
                    if 'upidetailID' in payinfo or 'carddetailID' in payinfo:
                        session['paymentdetailID'] = payinfo['paymentdetailID']
                        payloads['paymentdetailID'] = payinfo['paymentdetailID']
                        db.insert_into("paymentdet", values=payinfo)
                else:
                    print(session)
                    payinfo = db.select_from("paymentdet", where_clause={
                                             'paymentdetailID': session['paymentdetailID']})
                    print(payinfo)
                    if payinfo[0]['carddetailID'] != None:
                        if bool(cardinfo) != False:
                            try:
                                db.update_table("carddet", updates=cardinfo, where_clause={
                                                'carddetailID': payinfo[0]['carddetailID']})
                            except Error as e:
                                print(e)
                                return 'carddet.CardNum'
                        else:
                            db.delete_from("carddet", where_clause={
                                           'carddetailID': payinfo[0]['carddetailID']})
                    elif bool(cardinfo) != False:
                        cardinfo['carddetailID'] = 'Ca-' + \
                            str(randint(1, 9999999) + randint(1, 999999))
                        payinfo[0]['carddetailID'] = cardinfo['carddetailID']
                        try:
                            db.insert_into("carddet", values=cardinfo)
                        except Error as e:
                            print(e)
                            return 'carddet.CardNum'
                        try:
                            db.update_table("paymentdet", updates=payinfo[0], where_clause={
                                            'paymentdetailID': session['paymentdetailID']})
                        except Error as e:
                            print(e)
                            return
                    if payinfo[0]['upidetailID'] != None:
                        if bool(upiinfo) != False:
                            try:
                                db.update_table("upidet", updates=upiinfo, where_clause={
                                                'upidetailID': payinfo[0]['upidetailID']})
                            except Error as e:
                                print(e)
                                return 'upidet.upiID'
                        else:
                            try:
                                db.delete_from("upidet", where_clause={
                                               'upidetailID': payinfo[0]['upidetailID']})
                            except Error as e:
                                print(e)
                                return
                    elif bool(upiinfo) != False:
                        upiinfo['upidetailID'] = 'U-' + \
                            str(randint(1, 9999999) + randint(1, 999999))
                        payinfo[0]['upidetailID'] = upiinfo['upidetailID']
                        try:
                            db.insert_into("upidet", values=upiinfo)
                        except Error as e:
                            print(e)
                            return 'upidet.upiID'
                        try:
                            db.update_table("paymentdet", updates=payinfo[0], where_clause={
                                            'paymentdetailID': session['paymentdetailID']})
                        except Error as e:
                            print(e)
                            return
            login_status = dataenter()
            try:
                db.update_table("suppliers", updates=payloads, where_clause={
                                'supplierID': session['userID']})
            except Error as e:
                if 'suppliers.pno_UNIQUE' in str(e):
                    print(e)
                    login_status = 'suppliers.pno_UNIQUE'
                if 'suppliers.email_UNIQUE' in str(e):
                    print(e)
                    login_status = 'suppliers.email_UNIQUE'
                else:
                    print(e)
        userinfo = db.select_from("suppliers", where_clause={
                                  'supplierID': session['userID']})
        result = None
        print(session)
        if session['paymentdetailID'] is not None:
            paymentdet = db.select_from("paymentdet", where_clause={
                                        'paymentdetailID': session['paymentdetailID']})[0]
            if paymentdet['carddetailID'] is not None:
                result = db.select_from("carddet", where_clause={
                                        'carddetailID': paymentdet['carddetailID']})[0]
            if paymentdet['upidetailID'] is not None:
                if result is not None:
                    print(result)
                    print(paymentdet)
                    result.update(db.select_from("upidet", where_clause={
                                  'upidetailID': paymentdet['upidetailID']})[0])
                else:
                    result = db.select_from("upidet", where_clause={
                                            'upidetailID': paymentdet['upidetailID']})[0]
    else:
        return redirect(url_for('index'))
    return render_template('sellerprofile.html', user=userinfo, firstname=userinfo[0]['firstname'], payinfo=result, login_status=login_status)


@app.route('/myOrders')
def myOrders():
    pass


@app.route('/productPage')
def productPage():
    pass


@app.route('/payment')
def payment():
    pass


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))


@app.route('/api/getproducts', methods=['GET', 'POST'])
def searchApi():
    # print(request.form)
    search = request.form['search']
    cat = int(request.form['category'])
    print(search)
    # db = Workbench('minProj', password=mysql_pwd)
    if(cat != 0):
        products = [x for x in allproducts if (re.search(search, x['prodName'], I) or re.search(
            search, x['prodDesc'], I)) and x['categoryID'] == cat]
        # products = db.select_from_custom(f"SELECT * FROM products WHERE (REGEXP_LIKE(prodName,'{search}') OR REGEXP_LIKE(prodDesc,'{search}')) AND categoryID= {cat}")
    else:
        products = [x for x in allproducts if re.search(
            search, x['prodName'], I)]
        # products = db.select_from_custom(f"SELECT * FROM products WHERE (REGEXP_LIKE(prodName,'{search}') OR REGEXP_LIKE(prodDesc,'{search}'))")

    # print(len(products))
    return (
        jsonify({
            "status": "OK",
            "data": products
        })
    )
