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


def setRWorkingDirectory():
    sourceReturn1 = robjects.r("path")
    return ""

@app.route('/riskStratAdvRest/cal', methods = ['POST'])
@jsonp
def call_rsa_RFunction():
    rSource = robjects.r('source')
    os.chdir('riskStratAdvanced')
    rSource('input.R')
    r_getname_getData = robjects.globalenv['getDataJSON']
    thestream=request.stream.read();
    print " input stream "+str(thestream);
    jsondata = r_getname_getData(thestream)
    print "json string >> "+str(jsondata[0]);
    os.chdir('..')
    return jsondata[0]



import argparse
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("-p", dest="port_number", default="9982", help="Sets the Port") 
    # Default port is production value; prod,stage,dev = 9982, sandbox=9983
    args = parser.parse_args()
    port_num = int(args.port_number);
	
    hostname = gethostname()
    app.run(host='0.0.0.0', port=port_num, debug = True)