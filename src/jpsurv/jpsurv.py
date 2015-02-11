<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!-->

<html class="no-js">
<!--<![endif]-->

<head>
<meta name="generator"
  content="HTML Tidy for Windows (vers 18 June 2008), see www.w3.org">
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="">
<meta name="author" content="">

<title>JPSurv</title>
<!--
<link rel="/LDlink/shortcut icon" href="LD.ico" >
-->
<link rel="stylesheet"
  href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css"
  type="text/css">
<!--
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ladda-bootstrap/0.9.4/ladda-themeless.min.css" type="text/css">
 -->
 <!--
<link rel="stylesheet"
  href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css"
  type="text/css">
  -->
<link rel="stylesheet" href="../common/css/font-awesome.css"
  type="text/css">
<link rel="stylesheet" href="../common/css/style.css" type="text/css">
<link rel="stylesheet" href="jpsurv.css" type="text/css">

</head>

<body role="document">
    <!--[if lt IE 7]>
            <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->

  <div id="logos">
    <div id="left">
      <a href="http://www.cancer.gov" target="_blank"><img
        src="/common/images/nci.jpg" width="286" height="40" border="0"
        alt="National Cancer Institute" title="National Cancer Institute"></a>
    </div>

    <div id="right">
      <a href="http://www.cancer.gov" target="_blank"><img
        src="/common/images/nih.jpg" width="322" height="40" border="0"
        alt="at the National Institutes of Health"
        title="at the National Institutes of Health"></a>
    </div>
  </div>

  <div class="container theme-showcase" role="main">

    <div id="banners">
      <div id="left">
          <a href="http://cancercontrol.cancer.gov/" target="_blank">
            <img height="90" alt="Banner for Cancer Control and Population Sciences" src="ccpc-banner.png">
          </a>

      </div>
      <div id="right">
          <a href="http://seer.cancer.gov/" target="_blank">
            <img height="90" alt="SEER" src="seer_logo.png" class="logo">
          </a>
      </div>
    </div>
    <div style="clear:both;"></div>

    <br><br>
    <!-- Main Menu Tabs -->

    <ul id="jpsurv-tabs" class="nav nav-tabs responsive">
      <li class="active"><a href="#home" data-toggle="tab">Home</a></li>

      <li><a href="#help-tab" data-toggle="tab">Help</a></li>

    </ul>
    <!-- Tab Content -->

    <div class="tab-content">
      <div class="tab-pane active" id="home">
<div class="jumbotron">
        <h3>Welcome to JPSurv!</h3>
        <p>Upload Data Files to begin.</p>
<div class="well" style="float:left;width:300px;">
<table class="container">
  <tr style="width:250px;">
    <td class="upload-pane">
      <P><label for='file_control'>Data Dictionary File: </label>
          <A style='font-size:small' href='jpsurv.json' download='example.json'>(example)</A>
          <input type="file" id="file_control"></P>
      <P><label for='file_data'>Data File: </label><input type="file" id="file_data"></P>
      <P><INPUT type='submit' id='upload_file_submit' value='Upload Files' ></P>
    </td>
  </tr>
  <tr>
    <td class="parameters-pane">
      <div id='parameters' style='display:none'>
        <P id='diagnosis_title'><P>
        <P> Range of Diagnosis:<BR>
        <SELECT id='year_of_diagnosis_start'></SELECT> to <SELECT id='year_of_diagnosis_end'></SELECT></P>
        <P>Cohort Variables:<BR>
        <SELECT id='cohort_select' multiple ></SELECT></P>
        <P id='cohort_sub_select'></P>
        <P style="clear:both; padding-top:10px;">Covariate Variables:<BR>
        <SELECT id='covariate_select' multiple></SELECT></P>
        <P id='covariate_sub_select'></P>
        <P style="clear:both; padding-top:10px;">Join Points: <SELECT id='join_point_select'><OPTION>1</OPTION><OPTION>2</OPTION><OPTION>3</OPTION><OPTION>4</OPTION></SELECT></P>
        <P><INPUT type='submit' id='calculate' value='Calculate' ></P>
      </div>
   </td>
 </tr>
</table>
</div>

<div style="float:left;margin-left:30px;" id="plot-container">

    <p id="spinner" style="padding:200px 100px;display:none;"><i class="fa fa-spinner fa-spin fa-2x"></i>
    <span style="font-weight:bold;font-size:150%;margin-left:15px;">Calculating</span>
    </p>
    <div id="plot" style="display:none;">
        <h2 style="font-size:30px;">Relative Survival</h2>
        <img src="ExampleJPSurvPlot.png" alt="Uploaded" class="logo" style="width:600px;padding:10px;border:1px solid;margin-top:15px;">
    </div>
</div>

<div style="clear:both;"></div>
<div id="footer_output" style="border: 1px bold grey">
  <div>Input Data:</div>
</div>

</div>
    </div>

      <!-- Help -->
      <div class="tab-pane fade" id="help-tab">
      <div class="jumbotron">
<h2>Introduction</h2>
<p>JPSurv version 2.0 R package is a tool for estimating and presenting survival trend.  It can be used to predict survival in any given year and any time interval.  The tool is built on JPSurv version 1.0 (currently in CRAN).  Version 2.0.1 is still under development thus its function calls can still change and be revised based on the user interface design.</p>
<p>
Two statistical methods are implemented:</p>
<ul>
<li>joinpoint survival model</li>
<li>trend measures.</li>
</ul>


<p>Five types of trend measures are supported:</p>
<ul>
<li>Annual percentage changes of hazard</li>
<li>Annual percentage changes of cumulative relative survival</li>
<li>Annual changes of cumulative relative survival</li>
<li>Average annual absolute percent changes</li>
<li>Average annual relative percent changes</li>
</ul>

<p>The tool takes in raw data out of SEER*Stat or user defined raw data (not yet supported), maps the raw data into the model data expected by the tool.  The following model data are expected:</p>
<ul>
<li>Year of diagnosis: e.g. 1975-2009</li>
<li>Time Interval: e.g. one year, 2 year, …</li>
<li>The number of events (e.g. death): for each time interval</li>
<li>The number of alive: for each time interval</li>
<li>The number of lost to follow-up: for each time interval</li>
<li>The expected survival rate: for each time interval</li>
<li>The observed relative survival rate: for each time interval</li>
</ul>

</div>
      </div>
    </div>


    <div id="portal-footer">
      <div class="footerLinks">
        <a href="http://www.cancer.gov/" title="Home" data-toggle="tooltip"
          data-placement="left">Home</a>&nbsp;&nbsp;|&nbsp;&nbsp; <a
          href="mailto:jpsurv-admin@mail.nih.gov?subject=JP Surv"
          target="_top" title="Support">Support</a>&nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="http://www.cancer.gov/global/web/policies" title="Policies">Policies</a>&nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="http://www.cancer.gov/global/web/policies/accessibility"
          title="Accessibility">Accessibility</a>&nbsp;&nbsp;|&nbsp;&nbsp; <a
          href="http://cancer.gov/global/viewing-files" target="_blank"
          title="Viewing Files">Viewing Files</a>&nbsp;&nbsp;|&nbsp;&nbsp; <a
          href="http://www.cancer.gov/global/web/policies/foia" title="FOIA">FOIA</a><br>
        <br> <a href="http://www.dhhs.gov/">Department of Health
          and Human Services</a>&nbsp;&nbsp;|&nbsp;&nbsp; <a
          href="http://www.nih.gov/">National Institutes of Health</a>&nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="http://www.cancer.gov/">National Cancer Institute</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a
          href="http://www.usa.gov/">USA.gov</a>
      </div>
      <br> <br> NIH...Turning Discovery Into Health<sup>&#174;</sup>
    </div>
  </div>

  <script
    src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.js"
    type="text/javascript">
  </script>
  <script
    src="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"
    type="text/javascript">

    </script>
  <!-- Modernizr not in use

Temporarily removing to see if it effects anything.

<script
  src="http://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js"
  type="text/javascript">
</script>
-->
  <script
    src="http://cdnjs.cloudflare.com/ajax/libs/knockout/3.1.0/knockout-min.js"
    type="text/javascript">

    </script>
  <script
    src="http://cdnjs.cloudflare.com/ajax/libs/knockout.mapping/2.4.1/knockout.mapping.min.js"
    type="text/javascript">

    </script>
  <script type="text/javascript"
    src="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-validator/0.4.5/js/bootstrapvalidator.min.js">

    </script>

  <script src="jpsurv.js" type="text/javascript">

    </script>

<!--
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/ladda-bootstrap/0.9.4/ladda.min.js"></script>

  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/ladda-bootstrap/0.9.4/spin.min.js"></script>
-->
  </body>
</html>

