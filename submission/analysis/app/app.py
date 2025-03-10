#Import the dependencies 

import pandas as pd
from flask import Flask, jsonify, render_template, redirect, request
from sqlHelper import SQLHelper

######################## Flask Setup #####################################

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # remove caching

# SQL Helper
sqlHelper = SQLHelper()

######################## Flask Routes #####################################

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/dashboard1")
def dashboard1():
    return render_template("dashboard1.html")

@app.route("/dashboard2")
def dashboard2():
    return render_template("dashboard2.html")

@app.route("/map")
def map():
    return render_template("map.html")

@app.route("/about-us")
def about_us():
    return render_template("about-us.html")

@app.route("/work-cited")
def work_cited():
    return render_template("work-cited.html")

#######################################################################

@app.route("/api/v1.0/table")
def table():
    # Execute Query
    df = sqlHelper.queryTableData()

    # Turn DataFrame into List of Dictionary
    data = df.to_dict(orient="records")
    return jsonify(data)


@app.route("/api/v1.0/linechart_data")
def linechart_data():
    # Execute Query
    df = sqlHelper.queryLineChartData()

    # Turn DataFrame into List of Dictionary
    data = df.to_dict(orient="records")
    return jsonify(data)


@app.route("/api/v1.0/bubblechart_data")
def bubblechart_data():
    # Execute Query
    df = sqlHelper.queryBubbleChartData()

    # Turn DataFrame into List of Dictionary
    data = df.to_dict(orient="records")
    return jsonify(data)

@app.route("/api/v1.0/time_histogram")
def timeHistogram_data():
    # Execute queries
    df = sqlHelper.queryTimeHistogramData()

    # Turn DataFrame into List of Dictionary
    data = df.to_dict(orient="records")
    return jsonify(data)


@app.route("/api/v1.0/time_series")
def timeSeries_data():
    # Execute queries
    df = sqlHelper.queryTimeSeriesData()

    # Turn DataFrame into List of Dictionary
    data = df.to_dict(orient="records")
    return jsonify(data)


@app.route("/api/v1.0/scatter_data")
def scatter_data():
    # Execute queries
    df = sqlHelper.queryScatterChartData()

    # Turn DataFrame into List of Dictionary
    data = df.to_dict(orient="records")
    return jsonify(data)


@app.route("/api/v1.0/pie_chart")
def pie_chart():
    # Execute Query
    df = sqlHelper.queryPieChartData()

    # Turn DataFrame into List of Dictionary
    data = df.to_dict(orient="records")
    return jsonify(data)


@app.route("/api/v1.0/map")
def map_data():
    # Execute Query
    df = sqlHelper.queryMapData()

    # Turn DataFrame into List of Dictionary
    data = df.to_dict(orient="records")
    return jsonify(data)

#############################################################

# ELIMINATE CACHING
@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, public, max-age=0"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    return r

#############################################################

if __name__ == '__main__':
    app.run(debug=True)
