#!flask/bin/python
from flask import Flask, render_template, Response, abort, request, make_response, url_for, jsonify
from functools import wraps
from flask import current_app

import rpy2.robjects as robjects
from rpy2.robjects import r
from socket import gethostname
import json
import re

app = Flask(__name__, static_folder='', static_url_path='/')

r_getname_getCalculations = robjects.globalenv['RSA']['getCalculatedData']
r_getExcel = robjects.globalenv['RSA']['getExcelFile']
r_createExcel = robjects.globalenv['RSA']['createExcel']

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
            mimetype = 'application/json'
            return current_app.response_class(content, mimetype=mimetype)
        else:
            return func(*args, **kwargs)
    return decorated_function

@app.route('/riskStratAdvRest/cal', methods = ['POST'])

def call_rsa_RFunction():

    try:
        raw_data = request.stream.read().decode()
        sanitized_data = re.sub('[<>=()]', '', raw_data)
        data = json.loads(sanitized_data)
    except Exception as e:
        print(e)
        return jsonify({'data': None, 'excelFile': None,'error': 'invalid input'}), 400

    returnedData = list()
    if data[0]["export"] == True:
        returnedData = r_getExcel()[0]
    else:
        globalFixedValues = data[0]["fixed"]
        globalIndependentType = data[0]["independentType"]
        globalContourType = data[0]["contourType"]
        globalFixedType = data[0]["fixedType"]

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

            #            print "************************************ Before Sending to R **************************************************"
            #            print "getCalculatedData('" + independent + "', '" + fixed + "', '" + contour + "', '" + independent_type + "', '" + fixed_type + "', '" + contour_type + "', '" + abreviated_key + "', '" + key_index + "', '" + tab_value +"')"

            result = r_getname_getCalculations(independent, fixed, contour, independent_type,
                    fixed_type, contour_type, abreviated_key, key_index, tab_value, unique)

            #            print "************************************ Index " + str(i) + " returned ******************************************"

            # parse each returned json string and append to returnedData
            # use returnedData variable to pass entire dataset to a function for writing to excel
            returnedData.insert(i, json.loads(result[0]))

            #            print "+++++++++++++++++++++++++++++++++++ Returning Data +++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
        print(json.dumps(returnedData))
        excel_file = r_createExcel(json.dumps(returnedData), globalIndependentType, globalContourType, globalFixedType, globalFixedValues)[0]

    return json.dumps({"data": returnedData, "excelFile": excel_file})


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("-p", dest="port_number", default="9982", help="Sets the Port")
    parser.add_argument("--debug", action="store_true")
    # Default port is production value; prod,stage,dev = 9982, sandbox=9983
    args = parser.parse_args()
    port_num = int(args.port_number);

    hostname = gethostname()
    app.run(host='0.0.0.0', port=port_num, debug = args.debug, use_evalex = False)
