#!flask/bin/python
from flask import Flask, render_template, Response, abort, request, make_response, url_for, jsonify
from functools import wraps
from flask import current_app

import rpy2.robjects as robjects
from rpy2.robjects import r
import cgi
import shutil
import os
from xml.sax.saxutils import escape, unescape
from socket import gethostname
import json
import pandas as pd
import numpy as np
from pandas import DataFrame
import pandas.rpy.common as com
import urllib

app = Flask(__name__, static_folder='', static_url_path='/')
#app = Flask(__name__, static_folder='static', static_url_path='/static')

# r_getname_getData = robjects.globalenv['RSA']['getDataJSON']
r_getname_getCalculations = robjects.globalenv['RSA']['getCalculatedData']

@app.route('/')
def index():
    return render_template('../index.html')

def jsonp(func):
    """Wraps JSONified output for JSONP requests."""
    @wraps(func)
    def decorated_function(*args, **kwargs):
        callback = request.args.get('callback', False)
        if callback:
            data = str(func(*args, **kwargs).data)
            content = str(callback) + '(' + data + ')'
            #mimetype = 'application/javascript'
            mimetype = 'application/json'
            return current_app.response_class(content, mimetype=mimetype)
        else:
            return func(*args, **kwargs)
    return decorated_function

@app.route('/riskStratAdvRest/cal', methods = ['POST'])
# @jsonp
def call_rsa_RFunction():
    data = request.json

    returnedData = list()

    for i,x in enumerate(data):
        abreviated_key = x["abreviatedKey"] #cNPV or PPV
        key_index=x["keyIndex"] #1 or 2

        contour = str(x["contour"])
        independent = str(x["independent"])
        fixed = str(x["fixed"])

        contour_type = str(x["contourType"]) # contour dropdown values
        independent_type = str(x["independentType"]) # independent dropdown values
        fixed_type = str(x["fixedType"]) # fixed dropdown values
        
        unique = str(x["uniqueId"])
        tab_value = str(x["tabValue"])
        # add a variable for export when we start working on the export piece

        #getCalculatedData("0.6,0.75,0.8,0.86,0.92","1,1.5,2,3","0.01,0.05,0.1","specificity","delta","prevalence","cNPV","1","3",123456)
	
    	print "************************************Before Sending to R **************************************************"
    	
    	result = r_getname_getCalculations(independent, fixed, contour, independent_type, 
                fixed_type, contour_type, abreviated_key, key_index, tab_value, unique)

	print "************************************Index "+ str(i) + " returned******************************************"
	# parse each returned json string and append to returnedData
    # use returnedData variable to pass entire dataset to a function for writing to excel
        returnedData.insert(i, json.loads(result[0]))

    print "+++++++++++++++++++++++++++++++++++Returning Data+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"    
    return json.dumps(returnedData)

import argparse
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("-p", dest="port_number", default="9982", help="Sets the Port") 
    # Default port is production value; prod,stage,dev = 9982, sandbox=9983
    args = parser.parse_args()
    port_num = int(args.port_number);
	
    hostname = gethostname()
    app.run(host='0.0.0.0', port=port_num, debug = True)
