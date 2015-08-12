# We need to import the jsonify object, it will let us
# output json, and it will take care of the right string
# data conversion, the headers for the response, etc
import os
import re
import time
import json
from flask import Flask, render_template, request, jsonify
from rpy2.robjects.packages import SignatureTranslatedAnonymousPackage
from rpy2.robjects.vectors import IntVector, FloatVector
from socket import gethostname

# Initialize the Flask application
app = Flask(__name__)

r_saveAllSensGraphs = robjects.globalenv['SS$saveAllSensGraphs']

@app.route('/')
def index():
    # Render template
    return render_template('../index.html')

# This route will return a list in JSON format
@app.route('/sampleSizeRest/', methods=['POST'])
def sampleSizeRest():
    # Get the parsed contents of the form data
    data = request.json
    #print(json)

    k=data["k"].split(',')
    prev=data["prev"]
    N=data["N"]
    unique_id=data["unique_id"]
    fixed_flag=data["fixed_flag"]
    sens=data["sens"].split(',')
    spec=data["spec"].split(',')
    
    start = time.time()
    print "Starting Benchmark"
    
    if fixed_flag == "Specificity":
    	jsonrtn = (r_saveAllSensGraphs(FloatVector(k), FloatVector(sens), FloatVector(spec), float(prev), IntVector(N), unique_id))
    else:
        jsonrtn = (r_saveAllSpecGraphs(FloatVector(k), FloatVector(sens), FloatVector(spec), float(prev), IntVector(N), unique_id))

    jsonlist=list(jsonrtn)

    #2
    jsonstring=''.join(jsonlist)
    print jsonstring
    return jsonstring 

import argparse
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("-p", dest="port_number", default="9982", help="Sets the Port")
    # Default port is production value; prod,stage,dev = 9982, sandbox=9983
    args = parser.parse_args()
    port_num = int(args.port_number);

    hostname = gethostname()
    app.run(host='0.0.0.0', port=port_num, debug = True)
