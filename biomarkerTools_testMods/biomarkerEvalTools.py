from meanstorisk.meanstorisk import meanstorisk
from bc.bc import bc
from riskStratAdvanced import rsa

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
def route_tunnel(methodCall)
    if methodCall == 'bcRest'
        @bc.jsonp()
    if methodCall == 'riskStratAdvRest/cal'
        @rsa.jsonp()
    if methodCall == 'meanstoriskRest'
        @meanstorisk.jsonp()
    if methodCall == 'sampleSizeRest'
        @ss.sampleSizeRest()
    if methodCall == 'mrsRest'
        @mrs.mrsRest()
        
import argparse
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("-p", dest="port_number", default="<port#>", help="Sets the Port")

    args = parser.parse_args()
    port_num = int(args.port_number);
	
    hostname = gethostname()
    app.run(host='0.0.0.0', port=port_num, debug = True)