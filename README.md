# US Tornadoes 1950-2021
The "US Tornadoes 1950-2021" project is a comprehensive data visualization and analysis webpage designed to explore trends and patterns in tornado occurrences across the United States. Utilizing a dataset of 67,558 entries, the project provides insights into tornado magnitudes, injuries, fatalities, and geographic distribution through interactive dashboards and maps.

---
## Introduction
Tornadoes frequently occur in the United States, resulting in vast destruction and often injuries and death. They occur more often in the United States and Canada than in other countries, with the most tornado-prone regions in the US being the central and southeastern states along a corridor sometimes called "Tornado Alley."

A tornado's destructiveness is derived largely from the wind speed within it. For this reason, meteorologists rate tornadoes using a scale based on wind speed. In the US, tornadoes were originally rated on the Fujita Scale, and since February 2007 on the Enhanced Fujita Scale. The two scales cover slightly different speed ranges, but for practical purposes are the same. The enhanced Fujita scale is shown below.

#### The Enhanced Fujita Scale

| Rating | Wind Speed | Damage                  |
|--------|-------------|-------------------------|
| EF0    | 65–85 mph   | Light damage            |
| EF1    | 86–110 mph  | Moderate damage         |
| EF2    | 111–135 mph | Considerable damage     |
| EF3    | 136–165 mph | Severe damage           |
| EF4    | 166–200 mph | Devastating damage      |
| EF5    | >200 mph    | Incredible damage       |

### Origin
This dataset was derived from a dataset produced by NOAA's Storm Prediction Center. The primary changes made to create this dataset were the deletion of some columns, change of some data types, and sorting by date.

### Column Definitions
- **year**: 4-digit year
- **month**: Month (1-12)
- **day**: Day of month
- **date**: Datetime object (e.g., 1950-01-01)
- **state**: State where tornado originated; 2-digit abbreviation
- **tornado_magnitude**: F rating through Jan 2007; EF rating after Jan 2007 (-9 if unknown rating)
- **injuries**: Number of injuries
- **fatalities**: Number of fatalities
- **start_latitude**: Starting latitude in decimal degrees
- **start_longitude**: Starting longitude in decimal degrees
- **end_latitude**: Ending latitude in decimal degrees (value of 0 if missing)
- **end_longitude**: Ending longitude in decimal degrees (value of 0 if missing)
- **tornado_length**: Length of track in miles
- **tornado_width**: Width in yards

---

## Key Features
- **Data Cleaning & Transformation:** Using Pandas and Numpy for preprocessing
- **Backend:** Flask with SQLite for robust data management
- **Frontend:** D3.js and Plotly.js for interactive charts and visualizations
- **Interactive Map:** Leaflet.js with clustering and heatmap layers
- **APIs:** Custom Flask API endpoints for data visualization

---

## Project Folder Structure

```
US_Tornado
│
├── app
│   ├── app.py
│   ├── sqlHelper.py
│   ├── static
│   │   ├── css
│   │   │   ├── style.css
│   │   │   └── leaflet.extra-markers.min.css
│   │   ├── js
│   │   │   ├── app.js
│   │   │   ├── app2.js
│   │   │   ├── leaflet.extra-markers.min.js
│   │   │   ├── leaflet-heat.js
│   │   │   └── map.js
│   ├── templates
│   │   ├── home.html
│   │   ├── dashboard1.html
│   │   ├── dashboard2.html
│   │   ├── map.html
│   │   ├── about-us.html
│   │   └── works-cited.html
│
├── database
│   ├── database-setup.ipynb
│   ├── test-visualizations.ipynb
│   ├── ERD.jpg
│   └── data
│       ├── database.db
│       ├── unclean-data.csv
│       └── transformed-data.csv
├── US_Tornado_Project-Presentation.pdf
├── US_Tornado_Project-Proposal.pdf
├── US_Tornado_Technical_Writeup.pdf
└── README.md

```

---

## Instructions on How to Use and Interact with the Project

### Prerequisites
- **Python 3.8+** installed
- **Flask**, **Pandas**, **SQLAlchemy**, **Plotly**, **D3.js**, **Leaflet.js**, and other dependencies installed

### Running the Application on PythonAnywhere
1. **Upload the Project:**
- Upload the entire project folder to PythonAnywhere account.

2. **Set up the Database:**
- Navigate to the `database` folder and run `database-setup.ipynb` to create and populate `database.db`.

3. **Configure the Web App:**
- On PythonAnywhere, go to the Web tab and set the working directory to your app folder.
- Set the Flask app entry point as `app.app`.
- Add any necessary static file mappings.

4. **Start the Web Server:**
- Reload the web app on PythonAnywhere.
- The application should be running at provided domain.

### Navigating the Dashboards
- **Home Page:** Overview of the project.
- **Dashboard 1:** Interactive charts including line and bubble charts.
- **Dashboard 2:** Histograms, scatter plots, and pie charts.
- **Map Dashboard:** Visualize tornado data on an interactive map.
- **About Us:** Learn more about the project and contributors.
- **Works Cited:** References and sources.

---

## Ethical Considerations
This project ensures ethical data usage by utilizing publicly available data from the NOAA's Storm Prediction Center, ensuring no personal or sensitive information is used. Data visualization and analysis are presented factually without bias or manipulation.

---

## References
- **Data Source:** NOAA's Storm Prediction Center
- **External Code:** Leaflet.js, Plotly.js, D3.js, and any referenced libraries in the codebase.

---
## Limitations & Bias
- **Data Quality:** Dependent on the completeness and accuracy of historical tornado records
- **Temporal Bias:** Older data may lack precision
- **Geographical Bias:** Reporting differences across regions

---

## Future Enhancements
- **Real-Time Data Integration:** Adding live tornado tracking
- **Predictive Analytics:** Utilizing machine learning models to forecast tornado occurrences
- **Advanced Filtering:** Adding more granular filter options to the dashboard

---

## Conclusion
The Tornado Data Visualization Project seamlessly integrates a robust Flask backend with a dynamic D3.js and Plotly.js frontend. The backend efficiently handles data processing and API management, while the frontend transforms raw tornado data into compelling visualizations. This holistic approach ensures a smooth user experience, enabling deep exploration of tornado trends and impacts.



