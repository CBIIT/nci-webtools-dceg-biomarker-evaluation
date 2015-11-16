#!flask/bin/python
from flask import Flask, Response, abort, request, make_response, url_for, jsonify
from functools import wraps
import cgi
from flask import current_app
import json
import numpy as np
import os
import pandas as pd
from pandas import DataFrame
import pandas.rpy.common as com
from rpy2.rinterface import RRuntimeError
import rpy2.robjects as robjects
from rpy2.robjects import r
import shutil
from socket import gethostname
import time
import urllib
from xml.sax.saxutils import escape, unescape

app = Flask(__name__)

r_getname_getApcData = robjects.globalenv['MTR']['getDataJSON']

def jsonp(func):
    """Wraps JSONified output for JSONP requests."""
    @wraps(func)
    def decorated_function(*args, **kwargs):
        callback = request.args.get('callback', False)
        if callback:
            data = str(func(*args, **kwargs).data)
            content = str(callback) + '(' + data + ')'
            mimetype = 'application/json'
            return current_app.response_class(content, mimetype=mimetype)
        else:
            return func(*args, **kwargs)
    return decorated_function

@app.route('/meanstoriskRest/', methods = ['GET','POST'])
@jsonp
def call_mean_RFunction():
    print "Data Start Time: " + str(time.time());
    stream = request.stream.read()
    try:
      jsondata = r_getname_getApcData(stream)
    except RRuntimeError as e:
      if ("FileNotFound" in e.args[0]):
        response = jsonify({'error': "Please choose a file to upload, or use the Normal Distribution input method."})
        response.status_code = 500;
        return response
      else:
        raise
    print "After Data Calculation: " + str(time.time());
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
