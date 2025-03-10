let table = d3.select("#tornado_table")
let tbody = table.select("tbody")

let data_table = new DataTable("#tornado_table")

function init() {

    // bar chart #1
    d3.json("/api/v1.0/bar-chart-1").then(data => {
        makeBarChart1(data)
    })

    // bar chart #2
    d3.json("/api/v1.0/bar-chart-2").then(data => {
        makeBarChart2(data)
    })

    // bar chart #3
    d3.json("/api/v1.0/bar-chart-3").then(data => {
        makeBarChart3(data)
    })

    // pie chart
    d3.json("/api/v1.0/pie-chart").then(data => {
        makePieChart(data)
    })

    // table
    d3.json("/api/v1.0/table").then(data => {
        makeTable(data)
    })

}

function makeBarChart1(data) {

    let trace = {
        type: "bar",
        marker: {
            color: "firebrick"
        },
        x: data.map(row => row.month),
        y: data.map(row => row.tornado_count),
    }
    let traces = [trace]

    let layout = {
        title: {
            text: "Months"
        },
        yaxis: {
            title: {
                text: "Tornado Count"
            }
        },
        height: 600
    }

    Plotly.newPlot("bar-chart-1", traces, layout)

}

function makeBarChart2(data) {

    let trace = {
        type: "bar",
        marker: {
            color: "blue"
        },
        x: data.map(row => row.year),
        y: data.map(row => row.Total_Fatalities),
    }
    let traces = [trace]

    let layout = {
        title: {
            text: "Tornado Fatalities by Year"
        },
        xaxis: {
            title: {
                text: "Year"
            }
        },
        yaxis: {
            title: {
                text: "Deaths"
            } 
        },
        height: 600
    }

    Plotly.newPlot("bar-chart-2", traces, layout)

}

function makeBarChart3(data) {

    let trace = {
        type: "bar",
        marker: {
            color: "green"
        },
        x: data.map(row => row.state),
        y: data.map(row => row.tornado_count),
    }
    let traces = [trace]

    let layout = {
        title: {
            text: "Top 20 States with the Most Tornadoes"
        },
        xaxis: {
            text: "State"
        },
        yaxis: {
            title: {
                text: "Tornado Count"
            }
        },
        height: 600
    }

    Plotly.newPlot("bar-chart-3", traces, layout)

}

function makePieChart(data) {

    let trace = {
        type: "pie",
        labels: data.map(row => row.tornado_count),
        values: data.map(row => row.month), 
    }
    let traces = [trace]

    let layout = {
        title: "Tornado Distribution by Month in Texas (2021)",
        height: 600
    }

    Plotly.newPlot("pie-chart", traces, layout)

}

function makeTable(data) {

    tbody.html("")
    data_table.destroy()

    for (let i = 0; i < data.length; i++) {

        let row = data[i]

        let table_row = tbody.append("tr")
        table_row.append("td").text(row.year)
        table_row.append("td").text(row.tornado_magnitude)
        table_row.append("td").text(row.start_latitude)
        table_row.append("td").text(row.start_longitude)
        table_row.append("td").text(row.state)
        /*
        table_row.append("td").text(row.latitude)
        table_row.append("td").text(row.longitude)
        table_row.append("td").text(row.description)
        */

    }

    data_table = new DataTable("#tornado_table", {
        order: [[0, "desc"]]
    })

}

init()