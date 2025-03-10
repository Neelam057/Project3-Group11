// Event Listener for Filter Button
d3.select("#filter-btn").on("click", function () {
    handleDataUpdate();  // Call the helper function to filter and update charts
});

// On Page Load, fetch and display the charts

window.onload = function() {
    handleDataUpdate();  // Initialize data on page load
};

// Helper function to fetch, filter, and update charts

function handleDataUpdate() {
    const yearInput = d3.select("#year").property("value");

    // Fetch data for all charts in parallel
    Promise.all([
        d3.json("/api/v1.0/scatter_data"),
        d3.json("/api/v1.0/time_series"),
        d3.json("/api/v1.0/time_histogram"),
        d3.json("/api/v1.0/pie_chart")
    ]).then(([scatterData, timeSeriesData, timeHistogramData, pieChartData]) => {

        // Update all charts
        updateScatterChart(scatterData);
        updateTimeSeriesChart(timeSeriesData, yearInput);
        updateTimeSeriesHistogram(timeHistogramData, yearInput);
        updatePieChart(pieChartData);
    }).catch((error) => {
        console.error("Error fetching data:", error);
    });
}

// Scatter Chart Update Function
function updateScatterChart(scatterData) {
    const tornadoMagnitudes = scatterData.map(row => row.tornado_magnitude);
    const avgTornadoLengths = scatterData.map(row => row["Average Tornado Length"]);
    const avgTornadoWidths = scatterData.map(row => row["Average Tornado Width"]);

    const trace1 = {
        x: tornadoMagnitudes,
        y: avgTornadoLengths,
        mode: 'markers',
        type: 'scatter',
        marker: {
            color: avgTornadoLengths,
            size: avgTornadoWidths.map(w => w / 8),
            colorscale: 'Viridis',
            //showscale: true,
            opacity: 0.9
        },
        hoverinfo: 'text',
        text: avgTornadoWidths.map(width => `Average Width: ${width}`),
        hovertemplate: '%{text}',
        name: 'Average Tornado Width'
    };

    const regressionData = computeRegression(tornadoMagnitudes, avgTornadoLengths);

    const trace2 = {
        x: tornadoMagnitudes,
        y: regressionData,
        mode: 'lines',
        type: 'scatter',
        line: { color: 'red', width: 1 },
        hoverinfo: 'none',
        name: 'Regression Line'
    };

    const layout = {
        title: {
            text: 'Tornado Magnitude vs Length and Width with Regression Line',
            font: {size: 22, weight: 'bold'}
        },
        width: 800,
        height: 600,
        xaxis: {
            title: 'Tornado Magnitude',
            range: [-1, Math.max(...tornadoMagnitudes) + 1],
            zeroline: true,
            zerolinecolor: 'black',
            zerolinewidth: 2,
            position: -1
        },
        yaxis: {
            title: 'Tornado Length',
            range: [-1, Math.max(...avgTornadoLengths) + 10],
            zeroline: true,
            zerolinecolor: 'black',
            zerolinewidth: 2,
            position: 0
        },
        showlegend: true,
        hovermode: 'closest',
        dragmode: 'zoom',
    };

    Plotly.newPlot('chart', [trace1, trace2], layout);
}

// Regression Calculation Function
function computeRegression(x, y) {
    const n = x.length;
    let xSum = 0, ySum = 0, xySum = 0, x2Sum = 0;

    for (let i = 0; i < n; i++) {
        xSum += x[i];
        ySum += y[i];
        xySum += x[i] * y[i];
        x2Sum += x[i] * x[i];
    }

    const m = (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);
    const b = (ySum - m * xSum) / n;

    return x.map(xVal => m * xVal + b);
}


function filterDataByYear(data, yearInputNumber) {

    console.log(`Filtering data for year: ${yearInputNumber}`);
    yearInputNumber = Number(yearInputNumber);
    return data.filter(row => {
        const rowYear = Number(row.year); 
         // Ensure it's a number
        const yearMatch = yearInputNumber ? (rowYear === yearInputNumber) : true;
        return yearMatch;
    });
}


// Time Series Chart Update Function
function updateTimeSeriesChart(timeSeriesData, year) {
    // Filter data by year if provided, otherwise use the full dataset
    const defaultyear= 1950;
    const filteredData = year ? filterDataByYear(timeSeriesData, year) : filterDataByYear(timeSeriesData, defaultyear);

    // Extract unique magnitudes
    const uniqueMagnitudes = [...new Set(filteredData.map(row => row.tornado_magnitude))];

    // Prepare traces array
    const traces = uniqueMagnitudes.map(magnitude => {
        // Filter data for the specific magnitude
        const magnitudeData = filteredData.filter(row => row.tornado_magnitude === magnitude);

        // Extract months and tornado counts for this magnitude
        const months = magnitudeData.map(row => row.month);
        const tornadoCountsByMonth = magnitudeData.map(row => row.tornado_count);

        // Create a trace for this magnitude
        return {
            type: "scatter",
            mode: "lines+markers",  // This enables both lines and markers (small circles)
            name: `Magnitude ${magnitude}`,  // Label the line by its magnitude
            x: months,
            y: tornadoCountsByMonth,
            line: { width: 2, color: getColorForMagnitude(magnitude) },  // Add color for magnitude
            marker: {
                size: 10,  // Size of the markers (small circles)
                opacity: 1.0,  // Make the markers slightly transparent
                symbol: 'circle'  // Use circular markers
            }
        };
    });

    // Layout for the chart
    const layout = {
        title: {
            text: `Tornado Counts by Magnitude (Monthly) for ${year ? year : '1950'}`,
            font: { size: 22, weight: 'bold' }
        },
        xaxis: {
            title: 'Month',
            showgrid: true,
            tickvals: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // Set months as 1-12
            ticktext: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yaxis: {
            title: 'Number of Tornadoes',
            showgrid: true,
            linewidth: 1,
            showline: true
        },
        hovermode: 'closest',
        width: 750,
        height: 600,
    };

    // Plot the chart (pass the array of traces)
    Plotly.newPlot('time-series', traces, layout);
}

// Function to get a color based on the magnitude (you can define your color scale here)
function getColorForMagnitude(magnitude) {
    switch (magnitude) {
        case 0: return 'green';
        case 1: return 'skyblue';
        case 2: return 'blue';
        case 3: return 'orange';
        case 4: return 'red';
        case 5: return 'darkred'
    }
}



const monthlyCounts=0;
// Time Series Histogram Update Function
function updateTimeSeriesHistogram(timeSeriesData, yearInputNumber) {
    const filteredData = yearInputNumber ? filterDataByYear(timeSeriesData, yearInputNumber) : timeSeriesData;
    const monthlyCounts = filteredData.map(row => row.tornado_count);

console.log(filteredData);
    //if (!filteredData.length) return;

  //  const monthlyCounts = Array(12).fill(0);
   // filteredData.forEach(d => {
      //  const month = new Date(d.date).getMonth();
     //   monthlyCounts[month] += 1;
    

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


    const trace = {
        type: "bar",
        name: `Tornado Counts`,
        x: months,
        y: monthlyCounts,
        opacity: 0.7,
        marker: { color: 'rgba(248, 6, 6, 0.79)' }
    };

    const layout = {
        title: {
            text: `Tornado Counts by Month for ${yearInputNumber ? yearInputNumber : '1950'}`,
            font: {size: 22, weight: 'bold' }  
        },
        xaxis: { 
            title: 'Month',
        },
        yaxis: { 
            title: {
                text: 'Tornado Count Frequency',
            },
            showline: true
        },
        hovermode: 'closest',
        width: 800,
        height: 600,
    };

    Plotly.newPlot('histogram', [trace], layout);
}



// Pie Chart Update Function
function updatePieChart(pieChartData) {
    const magnitudes = pieChartData.map(item => item.tornado_magnitude);
    const avgFatalities = pieChartData.map(item => parseFloat(item["Average Fatalities"].toFixed(2)));

    const trace = {
        labels: magnitudes,
        values: avgFatalities,
        type: 'pie',
        hole: 0.4,
        textinfo: 'percent',
        hoverinfo: 'label+value',
        marker: {
            colorscale: 'RdYlBu',
            color: avgFatalities,
            showscale: true
        }
    };

    const layout = {
        title: {
            text: 'Average Fatalities by Tornado Magnitude',
            font: {size: 22, weight: 'bold'}
        },
        showlegend: true,
        width: 600,
        height: 600,
    };

    Plotly.newPlot('pie-chart', [trace], layout);
}