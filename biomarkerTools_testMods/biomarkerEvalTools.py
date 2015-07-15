from meanstorisk.meanstorisk import jsonp as meanstoriskRest
from bc.bc import jsonp as bcRest
from riskStratAdvanced import jsonp as riskStratAdvRest
from sampleSize.sampleSize import sampleSizeRest as sampleSizeRest
from meanRiskStratification.mrs import mrsRest
from flask import Flask, url_for

app = Flask(__name__, static_folder='', static_url_path='/')

@app.route('/')
@app.route('/biomarkerToolsRest')

def index():
    return render_template('index.html')

def api_tool_calls():
    return 'List of calls: '

@app.route('/biomarkerToolsRest/')
@api_tool_calls

# determine what python script to access and which method to call
@app.route('/biomarkerToolsRest/<methodCall>', methods = ['GET','POST'])
def route_tunnel(methodCall):
    if methodCall == 'bcRest':
        bcRest
    if methodCall == 'riskStratAdvRest/cal':
        riskStratAdvRest
    if methodCall == 'meanstoriskRest':
        meanstoriskRest
    if methodCall == 'sampleSizeRest':
        sampleSizeRest
    if methodCall == 'mrsRest':
        mrsRest
        
import argparse
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    # sandbox 9160, dev 8160
    parser.add_argument("-p", dest="port_number", default="8160", help="Sets the Port")

    args = parser.parse_args()
    port_num = int(args.port_number);

    hostname = gethostname()
    app.run(host='0.0.0.0', port=port_num, debug = True)