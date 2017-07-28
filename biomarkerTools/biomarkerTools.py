from rpy2.robjects import r
r.source('biomarkerToolsSuite.R')

from bc.bc import *
from meanRiskStratification.mrs import *
from meanstorisk.meanstorisk import *
from riskStratAdvanced.riskStratAdvanced import *
from sampleSize.sampleSize import *

from flask import Flask, url_for
app = Flask(__name__, static_folder='', static_url_path='/')

@app.route('/')
@app.route('/biomarkerToolsRest')
def index():
    return render_template('index.html')

def api_tool_calls():
    return 'List of calls: '

@app.route('/biomarkerToolsRest/')
@app.route('/biomarkerToolsRest/<toolName>/', methods = ['GET','POST'])
# determine what python script to access and which method to call
def api_tunnel(toolName):
    print toolName
    if toolName == 'bc':
        return call_bc_RFunction()
    if toolName == 'riskStratAdvanced':
        return call_rsa_RFunction()
    if toolName == 'meanstorisk':
        return call_mean_RFunction()
    if toolName == 'sampleSize':
        return sampleSizeRest()
    if toolName == 'meanRiskStratification':
        return mrsRest()
        

if __name__ == '__main__':
    # sandbox/dev (9160/8160)
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("-p", dest="port_number", default="9160", help="Sets the Port")
    parser.add_argument("--debug", action="store_true")

    args = parser.parse_args()
    port_num = int(args.port_number);
	
    hostname = gethostname()
    app.run(host='0.0.0.0', port=port_num, debug = args.debug, use_evalex = False)
