// Global variables
let table = d3.select("#tornado_table");
let tbody = table.select("tbody");
let dt_table;

// Trigger initial data load on page load
window.onload = function() {
    handleDataUpdate();  // Initialize data on page load
};

// Event listener for the filter button
d3.select("#filter-btn").on("click", handleDataUpdate);  // Filter and update chart/table when clicked


// Function to handle data fetching, filtering, and updating both chart and table
function handleDataUpdate() {
    const yearInput = d3.select("#year").property("value");
    const yearInputNumber = yearInput ? Number(yearInput) : null; // Default year if empty
    const stateInput = d3.select("#state").property("value") || "All States";  // Default state if empty

    // Fetch and process both table data and chart data in parallel
    Promise.all([
        d3.json("/api/v1.0/table"),
        d3.json("/api/v1.0/linechart_data"),
        d3.json("/api/v1.0/bubblechart_data")
    ]).then(function ([tableData, chartData, bubblechartData]) {
        // Filter data based on the year and state input
        const filteredTableData = filterData(tableData, yearInputNumber, stateInput);
        const filteredChartData = filterData(chartData, yearInputNumber);
        const filteredBubbleChartData = filterData(bubblechartData, yearInputNumber, stateInput);

        // Update table and chart with filtered data
        makeTable(filteredTableData);
        updateLineChartVisualization(filteredChartData, yearInputNumber);
        updateBubbleChartVisualization(filteredBubbleChartData, yearInputNumber);
    }).catch(function (error) {
        console.error("Error fetching data:", error);
    });
}

// Centralized filter function to handle both year and state filters
function filterData(data, yearInputNumber, stateInput = "All States") {
    return data.filter(row => {
        const yearMatch = yearInputNumber ? row.year === yearInputNumber : true;
        const stateMatch = stateInput !== "All States" ? row.state.toLowerCase().includes(stateInput.toLowerCase()) : true;
        return yearMatch && stateMatch;
    });
}

// Function to update the table with filtered data
function makeTable(data) {
    tbody.html("");  // Clear the existing table data

    // Destroy DataTable to avoid duplication
    if (dt_table) {
        dt_table.clear().destroy();
    }

    // Append filtered data to the table
    data.forEach(function (row) {
        let table_row = tbody.append("tr");
        table_row.append("td").text(row.year);
        table_row.append("td").text(row.state);
        table_row.append("td").text(row.Total_Fatalities);
        table_row.append("td").text(row.Total_Injuries);
        table_row.append("td").text(row.Total_Tornadoes);
    });

    // Reinitialize DataTable
    dt_table = new DataTable('#tornado_table', {
        order: [[0, 'desc']]  // Sort by year descending by default
    });
}

// Function to update all visualizations (charts)
function updateLineChartVisualization(filteredData, year) {
    makeLineChart(filteredData, year);
}

// Function to create the line chart
function makeLineChart(filteredData, year) {
    console.log("Year:", year);

    if (filteredData.length === 0) {
        console.error("No data available for the selected year.");
        return;
    }

    // Create chart traces for tornado count and fatalities
    const barTrace = {
        x: filteredData.map(row => row.year),
        y: filteredData.map(row => row.tornado_count),
        type: 'bar',
        name: 'Tornado Count',
        marker: { color: 'lightgreen' },
        width: 0.6
    };

    const lineTrace = {
        x: filteredData.map(row => row.year),
        y: filteredData.map(row => row.fatalities),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Fatalities',
        line: { color: 'red' },
        marker: { symbol: 'circle' }
    };

    // Layout for the chart with two y-axes
    const layout = {
        title: {
            text: `U.S. Tornado Count and Fatalities for ${year ? year : 'All Years'}`,
            font: { size: 22, weight: 'bold' }
        },
        xaxis: { title: 'Year', tickangle: 90 },
        yaxis: { title: 'Tornado Count', range: [0, Math.max(...filteredData.map(row => row.tornado_count)) + 10], showline: true },
        yaxis2: { title: 'Fatalities', overlaying: 'y', side: 'right', range: [0, Math.max(...filteredData.map(row => row.fatalities)) + 10], showline: true },
        width: 900,
        height: 600
    };

    // Render the chart
    Plotly.newPlot('line-chart', [barTrace, lineTrace], layout);
}

// Function to update the Bubble Chart with filtered data
function updateBubbleChartVisualization(filteredData, yearInputNumber) {
    // Clear the chart if there's no data for the selected filters
    if (filteredData.length === 0) {
        console.log("No data available for the selected state and year.");
        // Clear the bubble chart or display a message
        Plotly.newPlot('bubble-chart', []); // Clear the existing chart
        return;
    }

    // Proceed to build the chart if data exists
    makeBubbleChart(filteredData, yearInputNumber);
}

// Function to create the Bubble Chart
function makeBubbleChart(filteredData, yearInputNumber) {
    const years = filteredData.map(row => row.year);
    const tornadoCounts = filteredData.map(row => row.tornado_count);

    // Build the Bubble Chart
    const trace = {
        x: years,
        y: tornadoCounts,
        mode: 'markers',
        marker: {
            color: tornadoCounts,
            size: tornadoCounts,
            colorscale: 'Jet',  // Color scale
            showscale: true
        }
    };

    const layout = {
        title: {
            text: `Tornado Count for states in the year ${yearInputNumber ? yearInputNumber : ''}`,
            font: { size: 22, weight: 'bold' }
        },
        yaxis: { title: 'Tornado Count', rangemode: 'tozero', showline: true },
        xaxis: { title: 'Year', tickangle: -45 },
        height: 600,
        hovermode: 'closest'
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble-chart', [trace], layout);
}
