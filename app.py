from flask import Flask, json, render_template, request, session, url_for, jsonify
# from livereload import Server
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

# from webui import WebUI



mysql_pwd = "Ashu@12345"

myapp = Flask(__name__)

CORS(myapp)


db = Workbench(database = 'minProj', password = mysql_pwd)

    

# ui = WebUI(myapp, debug= True)
myapp.secret_key = 'ABCDEF'

allproducts = []

@myapp.route('/', methods = ['GET', 'POST'])
def index():
    login_status=None
    if request.method == 'POST':
        payload = request.form
        # print(payload)
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
        if 'login' in payload :
            whereClause = dict([x for x in payload.items() if 'login' not in x])
            userData = db.select_from(tableName, where_clause = whereClause)
            print(userData)
            if userData :
                login_status = True 
                if payload['email'] not in session:
                    session['email'] = payload['email']
                    session['firstname'] = userData[0]['firstname']
                    session['userID'] = userData[0][idName]
                if idPrefix == 'C-':
                    return redirect(url_for('home'))
                else:
                    return redirect(url_for('sellerHome'))
            else:
                login_status = False
                return render_template("index.html", login_status = login_status)
        else:
            print(payload)
            # values = dict([x for x in payload.items() if 'signup' not in x])
            # # print(values)
            # values[idName] = idPrefix + str(randint(1,9999999) + randint(1,999999))
            # values['joinDate'] = str(date.today())
            # try:
            #     db.insert_into(tableName, values)  
            #     if payload['email'] not in session:
            #         session['email'] = payload['email']
            #         session['firstname'] = payload['firstName']
            #         session['userID'] = payload[idName]
            #         if idPrefix == 'C-':
            #             return redirect(url_for('home'))
            #         else:
            #             return redirect(url_for('sellerHome'))
            #     else:
            #         return redirect(url_for('home'))
            # except Error as e:
            #     if 'Duplicate entry' in str(e):
            #         print(e)
            #         login_status = 'Already Exists'
            #         return render_template('index.html', login_status= login_status)
    
    else:    
        return render_template("index.html")


# login route
@myapp.route('/api/login', methods = ['POST'])
def login():
    data = request.json;
    # print(request.body)
    email, password, user = data.values()
    tableName = 'customers' if user == 'customer' else 'suppliers'
    idName = 'custID' if user == 'customer' else 'supplierID'
    try:
        userData = db.select_from(tableName, [idName, 'firstname'], {'email': email})
        # print(userID)
    except :
        print('error while trying to get userData')
        return jsonify({'status': 'Error trying to find the user data'})

    if not userData:
        return jsonify({'status':'User Not Found'})
    else:
        userID = userData[0][idName]
        try:
            hashedPassword = db.select_from('passwords', ['hash'], {'userID': userID})
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
@myapp.route('/api/register', methods = ['POST'])
def register():
    data = request.json
    # print(data)
    password = data['pwd']
    user = data['user']
    tableName, idName, idPrefix, redirectFunc = ('customers', 'custID', 'C-', 'home') if user == 'customer' else ('suppliers', 'supplierID', 'S-', 'sellerHome')
    data.pop('signup')
    data.pop('user')
    data.pop('pwd')
    data[idName] = idPrefix + str(randint(1,9999999) + randint(1,999999))
    data['joinDate'] = str(date.today())
    # print(data)
    userID = data[idName]
    try:
        db.insert_into(tableName, data)
        if data['email'] not in session:
            session['email'] = data['email']
            session['firstname'] = data['firstname']
            session['userID'] = data[idName]
    except Error as e:
        print(e)
        if 'Duplicate entry' in str(e):
            return jsonify("User already exists")
        else:
            return jsonify('Error inserting data into database')

    hashedPassword = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    try:
        db.insert_into('passwords', {
            'hash': hashedPassword.decode(),
            'userID': userID
        })
    except Error as e:
        print(e)
        return jsonify('Error hashing password to db')
        
    return jsonify('User registered successfully')




@myapp.route('/Customerhome/', methods = ['GET', 'POST'])
@myapp.route('/Customerhome/<int:page>', methods = ['GET', 'POST'])
def home(page = 1):
    if 'email' in session:
        perPage = 20
        startAt = perPage * page - perPage
        user = session['email']
        firstname = session['firstname']
        if request.method == 'POST' and request.form:
            payload = request.form
            # print(payload)
            query = 'SELECT * FROM products'
            filters = []
            if (len(payload) >= 1 and 'price' not in payload) or len(payload) > 1:
                categoryIDs = []
                for k,v in payload.items():
                    if k != 'price':
                        categoryIDs.append(v)
                print(categoryIDs)
                cat = ['categoryID = ' + x for x in categoryIDs]
                cat = '(' + ' OR '.join(cat) + ')'
                filters.append(cat)
            
            if('price' in payload):
                priceconstraint = '(minPrice'
                if payload['price'] == '1':
                    priceconstraint += '< 1000)'
                elif payload['price'] == '2':
                    priceconstraint += '>= 1000 AND minPrice<= 5000)'
                elif payload['price'] == '3':
                    priceconstraint += '>= 5000 AND minPrice<= 10000)'
                elif payload['price'] == '4':
                    priceconstraint += '>= 10000 AND minPrice<= 20000)'
                else :
                    priceconstraint += '> 20000)'
                filters.append(priceconstraint)

            filters = ' AND '.join(filters)
            filters += ';'
            query = ' WHERE '.join([query, filters])
            print(query)
            products = db.select_from_custom(query)
            filter = True
            return render_template('home.html',user = user, firstname = firstname, products=products, page = page, filter=filter, login_status = True)
        else:
            products = db.select_from('products')
            global allproducts
            allproducts = products
            totalPages = len(products) // 20 + 1
            # print(totalPages)
            products = products[startAt:startAt + perPage]
            filter = False
            return render_template('home.html',user = user, firstname = firstname, products=products, page = page,totalPages=totalPages, filter=filter, login_status = True)
    else:
        return redirect(url_for('index'))
    
    

@myapp.route('/sellerHome')
def sellerHome():
    if 'email' in session:
        user = session['email']
        firstname = session['firstname']
        uid = session['userID']
        productdetails = db.select_from('supplierdet',where_clause={'supplierID':uid})
        productlist = [db.select_from('products',where_clause={'prodID':x['prodID']})[0] for x in productdetails]
        # print(productlist[0])
         
    else:
        return redirect(url_for('index'))
    
    return render_template('sellerHome.html',user = user, firstname = firstname, productdetails=productdetails, productlist=productlist, login_status = True)

@myapp.route('/Profile',methods=['GET','POST'])
def profile():
    if 'email' in session:
        login_status=True
        session['paymentdetailID']=db.select_from("customers",attributes=['paymentID'] ,where_clause = {'custID':session['userID']})[0]['paymentID']
        if request.method == 'POST':
            payload = request.form
            card=['cardName','bankName','cardNum','cvv','expDate']
            payloads=dict([x for x in payload.items() if x[0] not in card and x[0]!='upiID'])
            cardinfo=dict([x for x in payload.items() if x[0] in card and x[1]!=''])
            upiinfo=dict([x for x in payload.items() if x[0]=='upiID' and x[1]!=''])
            def dataenter():
                if session['paymentdetailID'] is None:
                    payinfo=dict()
                    payinfo['paymentdetailID'] = 'Pay-' + str(randint(1,9999999) + randint(1,999999))
                    if bool(cardinfo) != False:
                        cardinfo['carddetailID'] = 'Ca-' + str(randint(1,9999999) + randint(1,999999))
                        payinfo['carddetailID']=cardinfo['carddetailID']
                        try:
                            db.insert_into("carddet",values=cardinfo)
                        except Error as e:
                            print(e)
                            return 'carddet.CardNum'
                    if bool(upiinfo) != False:
                        upiinfo['upidetailID'] = 'U-' + str(randint(1,9999999) + randint(1,999999))
                        payinfo['upidetailID']=upiinfo['upidetailID']
                        try:
                            db.insert_into("upidet",values=upiinfo)
                        except Error as e:
                            print(e)
                            return 'upidet.upiID'
                    if 'upidetailID' in payinfo or 'carddetailID' in payinfo:
                        session['paymentdetailID']=payinfo['paymentdetailID']
                        payloads['paymentID']=payinfo['paymentdetailID']
                        db.insert_into("paymentdet",values=payinfo)
                else:
                    print(session)
                    payinfo = db.select_from("paymentdet", where_clause = {'paymentdetailID':session['paymentdetailID']})
                    print(payinfo)
                    if payinfo[0]['carddetailID'] != None:
                        if bool(cardinfo) != False:
                            try:
                                db.update_table("carddet",updates=cardinfo,where_clause={'carddetailID':payinfo[0]['carddetailID']})
                            except Error as e:
                                return 'carddet.CardNum'
                        else:
                            db.delete_from("carddet",where_clause={'carddetailID':payinfo[0]['carddetailID']})
                    elif bool(cardinfo) != False:
                        cardinfo['carddetailID'] = 'Ca-' + str(randint(1,9999999) + randint(1,999999))
                        payinfo[0]['carddetailID']=cardinfo['carddetailID']
                        try:
                            db.insert_into("carddet",values=cardinfo)
                        except Error as e:
                            print(e)
                            return 'carddet.CardNum'
                        try:
                            db.update_table("paymentdet",updates=payinfo[0],where_clause={'paymentdetailID':session['paymentdetailID']})
                        except Error as e:
                            print(e)
                            return 
                    if payinfo[0]['upidetailID'] != None:
                        if bool(upiinfo) != False:
                            try:
                                db.update_table("upidet",updates=upiinfo,where_clause={'upidetailID':payinfo[0]['upidetailID']})
                            except Error as e:
                                print(e)
                                return 'upidet.upiID'
                        else:
                            try:
                                db.delete_from("upidet",where_clause={'upidetailID':payinfo[0]['upidetailID']})
                            except Error as e:
                                print(e)
                                return
                    elif bool(upiinfo) != False:
                        upiinfo['upidetailID'] = 'U-' + str(randint(1,9999999) + randint(1,999999))
                        payinfo[0]['upidetailID']=upiinfo['upidetailID']
                        try:
                            db.insert_into("upidet",values=upiinfo)
                        except Error as e:
                            print(e)
                            return 'upidet.upiID'
                        try:
                            db.update_table("paymentdet",updates=payinfo[0],where_clause={'paymentdetailID':session['paymentdetailID']})
                        except Error as e:
                            print(e)
                            return
            login_status= dataenter()
            try:
                db.update_table("customers",updates=payloads,where_clause={'custID':session['userID']})
            except Error as e:
                if 'customers.pno_UNIQUE' in str(e):
                    print(e)
                    login_status = 'customers.pno_UNIQUE'
                if 'customers.email_UNIQUE' in str(e):
                    print(e)
                    login_status = 'customers.email_UNIQUE'
                else:
                    print(e)
        userinfo = db.select_from("customers", where_clause = {'custID':session['userID']})
        result=None
        print(session)
        if session['paymentdetailID'] is not None:
            paymentdet=db.select_from("paymentdet", where_clause = {'paymentdetailID':session['paymentdetailID']})[0]
            if paymentdet['carddetailID'] is not None:
                result=db.select_from("carddet", where_clause = {'carddetailID':paymentdet['carddetailID']})[0]
            if paymentdet['upidetailID'] is not None:
                if result is not None:
                    print(result)
                    print(paymentdet)
                    result.update(db.select_from("upidet", where_clause = {'upidetailID':paymentdet['upidetailID']})[0])
                else:
                    result=db.select_from("upidet", where_clause = {'upidetailID':paymentdet['upidetailID']})[0]
        print(userinfo)
    else:
        return redirect(url_for('index'))
    return render_template('profile.html',user = userinfo,firstname=userinfo[0]['firstname'],payinfo=result ,login_status = login_status)


@myapp.route('/cart')
def cart():
    if 'email' in session:
        user = session['email']
        firstname = session['firstname']
    else:
        return redirect(url_for('index'))
    return render_template('cart.html',user = user, firstname = firstname, login_status = True)



@myapp.route('/sellerProfile',methods=['GET','POST'])
def sellerProfile():
    if 'email' in session:
        login_status=True
        print(session)
        session['paymentdetailID']=db.select_from("suppliers",attributes=['paymentID'] ,where_clause = {'supplierID':session['userID']})[0]['paymentID']
        if request.method == 'POST':
            payload = request.form
            card=['cardName','bankName','cardNum','cvv','expDate']
            payloads=dict([x for x in payload.items() if x[0] not in card and x[0]!='upiID'])
            cardinfo=dict([x for x in payload.items() if x[0] in card and x[1]!=''])
            upiinfo=dict([x for x in payload.items() if x[0]=='upiID' and x[1]!=''])
            def dataenter():
                if session['paymentdetailID'] is None:
                    payinfo=dict()
                    payinfo['paymentdetailID'] = 'Pay-' + str(randint(1,9999999) + randint(1,999999))
                    if bool(cardinfo) != False:
                        cardinfo['carddetailID'] = 'Ca-' + str(randint(1,9999999) + randint(1,999999))
                        payinfo['carddetailID']=cardinfo['carddetailID']
                        try:
                            db.insert_into("carddet",values=cardinfo)
                        except Error as e:
                            print(e)
                            return 'carddet.CardNum'
                    if bool(upiinfo) != False:
                        upiinfo['upidetailID'] = 'U-' + str(randint(1,9999999) + randint(1,999999))
                        payinfo['upidetailID']=upiinfo['upidetailID']
                        try:
                            db.insert_into("upidet",values=upiinfo)
                        except Error as e:
                            print(e)
                            return 'upidet.upiID'
                    if 'upidetailID' in payinfo or 'carddetailID' in payinfo:
                        session['paymentdetailID']=payinfo['paymentdetailID']
                        payloads['paymentID']=payinfo['paymentdetailID']
                        db.insert_into("paymentdet",values=payinfo)
                else:
                    print(session)
                    payinfo = db.select_from("paymentdet", where_clause = {'paymentdetailID':session['paymentdetailID']})
                    print(payinfo)
                    if payinfo[0]['carddetailID'] != None:
                        if bool(cardinfo) != False:
                            try:
                                db.update_table("carddet",updates=cardinfo,where_clause={'carddetailID':payinfo[0]['carddetailID']})
                            except Error as e:
                                print(e)
                                return 'carddet.CardNum'
                        else:
                            db.delete_from("carddet",where_clause={'carddetailID':payinfo[0]['carddetailID']})
                    elif bool(cardinfo) != False:
                        cardinfo['carddetailID'] = 'Ca-' + str(randint(1,9999999) + randint(1,999999))
                        payinfo[0]['carddetailID']=cardinfo['carddetailID']
                        try:
                            db.insert_into("carddet",values=cardinfo)
                        except Error as e:
                            print(e)
                            return 'carddet.CardNum'
                        try:
                            db.update_table("paymentdet",updates=payinfo[0],where_clause={'paymentdetailID':session['paymentdetailID']})
                        except Error as e:
                            print(e)
                            return 
                    if payinfo[0]['upidetailID'] != None:
                        if bool(upiinfo) != False:
                            try:
                                db.update_table("upidet",updates=upiinfo,where_clause={'upidetailID':payinfo[0]['upidetailID']})
                            except Error as e:
                                print(e)
                                return 'upidet.upiID'
                        else:
                            try:
                                db.delete_from("upidet",where_clause={'upidetailID':payinfo[0]['upidetailID']})
                            except Error as e:
                                print(e)
                                return
                    elif bool(upiinfo) != False:
                        upiinfo['upidetailID'] = 'U-' + str(randint(1,9999999) + randint(1,999999))
                        payinfo[0]['upidetailID']=upiinfo['upidetailID']
                        try:
                            db.insert_into("upidet",values=upiinfo)
                        except Error as e:
                            print(e)
                            return 'upidet.upiID'
                        try:
                            db.update_table("paymentdet",updates=payinfo[0],where_clause={'paymentdetailID':session['paymentdetailID']})
                        except Error as e:
                            print(e)
                            return
            login_status= dataenter()
            try:
                db.update_table("suppliers",updates=payloads,where_clause={'supplierID':session['userID']})
            except Error as e:
                if 'suppliers.pno_UNIQUE' in str(e):
                    print(e)
                    login_status = 'suppliers.pno_UNIQUE'
                if 'suppliers.email_UNIQUE' in str(e):
                    print(e)
                    login_status = 'suppliers.email_UNIQUE'
                else:
                    print(e)
        userinfo = db.select_from("suppliers", where_clause = {'supplierID':session['userID']})
        result=None
        print(session)
        if session['paymentdetailID'] is not None:
            paymentdet=db.select_from("paymentdet", where_clause = {'paymentdetailID':session['paymentdetailID']})[0]
            if paymentdet['carddetailID'] is not None:
                result=db.select_from("carddet", where_clause = {'carddetailID':paymentdet['carddetailID']})[0]
            if paymentdet['upidetailID'] is not None:
                if result is not None:
                    print(result)
                    print(paymentdet)
                    result.update(db.select_from("upidet", where_clause = {'upidetailID':paymentdet['upidetailID']})[0])
                else:
                    result=db.select_from("upidet", where_clause = {'upidetailID':paymentdet['upidetailID']})[0]
    else:
        return redirect(url_for('index'))
    return render_template('sellerprofile.html',user = userinfo,firstname=userinfo[0]['firstname'],payinfo=result ,login_status = login_status)

        

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

@myapp.route('/api/getproducts', methods = ['GET','POST'])
def searchApi():
    # print(request.form)
    search = request.form['search']
    cat = int(request.form['category'])
    print(search)
    # db = Workbench('minProj', password=mysql_pwd)
    if(cat != 0):
        products = [ x for x in allproducts if (re.search(search, x['prodName'], I) or re.search(search, x['prodDesc'], I)) and x['categoryID'] == cat ]
        # products = db.select_from_custom(f"SELECT * FROM products WHERE (REGEXP_LIKE(prodName,'{search}') OR REGEXP_LIKE(prodDesc,'{search}')) AND categoryID= {cat}")
    else:
        products = [ x for x in allproducts if re.search(search, x['prodName'], I) ]
        # products = db.select_from_custom(f"SELECT * FROM products WHERE (REGEXP_LIKE(prodName,'{search}') OR REGEXP_LIKE(prodDesc,'{search}'))")

    # print(len(products))
    return (jsonify(products))
    


if __name__ == "__main__":
    myapp.run(debug=True)
    
