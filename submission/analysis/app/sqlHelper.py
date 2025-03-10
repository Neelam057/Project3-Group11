# Import the dependencies
from sqlalchemy import create_engine, text
import pandas as pd

# Define the SQLHelper Class
# PURPOSE: Deal with all of the database logic

class SQLHelper():


    # Database Setup and parameters/Variables Initialization
    def __init__(self):
        self.engine = create_engine("sqlite:///../database/data/database.db")

    ########## First table/chart on dashboard1 ######################################################
    def queryTableData(self):
        # Create our session (link) from Python to the DB
        conn = self.engine.connect() # Raw SQL/Pandas

        # Define Query
        query = text(""" SELECT 
                            year,
                            state,
                            SUM(fatalities) AS Total_Fatalities,
                            SUM(injuries) AS Total_Injuries,
                            COUNT(*) AS Total_Tornadoes
                        FROM 
                            tornado
                        GROUP BY
                            year, state;""")
        df = pd.read_sql(query, con=conn)

        # Close the connection
        conn.close()
        return(df)
    
    ########## Second chart on dashboard1 ######################################################

    def queryLineChartData(self):
    # Create our session (link) from Python to the DB
        conn = self.engine.connect() # Raw SQL/Pandas

        # Define Query
        query = text("""SELECT 
                            year, 
                            COUNT(*) AS tornado_count, 
                            SUM(fatalities) AS fatalities
                        FROM 
                            tornado
                        GROUP BY 
                            year
                        ORDER BY 
                            year ASC;""")

        df = pd.read_sql(query, con=conn)

        #Close the connection
        conn.close()
        return(df)
    
    ########## Third chart on dashboard1 ######################################################

    def queryBubbleChartData(self):
    # Create our session (link) from Python to the DB
        conn = self.engine.connect() # Raw SQL/Pandas

    # Define Query
        query = text("""SELECT 
                            state,
                            year, 
                            COUNT(*) AS tornado_count
                        FROM 
                            tornado
                        GROUP BY 
                            state, year;""")
        df = pd.read_sql(query, con=conn)

        # Close the connection
        conn.close()
        return(df)
    

    ########## First chart on dashboard2 ######################################################
    
    def queryTimeHistogramData(self):
        # Create our session (link) from Python to the DB
        conn = self.engine.connect() # Raw SQL/Pandas

        # Define Query
        query = text("""SELECT 
                            month,
                            year,
                            tornado_magnitude,
                            COUNT(*) AS tornado_count
                        FROM 
                            tornado
                        GROUP BY 
                            year,month;""")
        df = pd.read_sql(query, con=conn)

        # Close the connection
        conn.close()
        return(df)
    
    ################ Second chart on dashboard2 ######################################################

    def queryTimeSeriesData(self):
        # Create our session (link) from Python to the DB
        conn = self.engine.connect() # Raw SQL/Pandas

        # Define Query
        query = text("""SELECT 
                            month,
                            year,
                            tornado_magnitude,
                            COUNT(tornado_magnitude) AS tornado_count
                        FROM 
                            tornado
                        GROUP BY 
                            year, month, tornado_magnitude;""")
        df = pd.read_sql(query, con=conn)

        # Close the connection
        conn.close()
        return(df)
    
    ########## Third chart on dashboard2 ######################################################

    def queryScatterChartData(self):
    # Create our session (link) from Python to the DB
        conn = self.engine.connect() # Raw SQL/Pandas

    # Define Query
        query = text("""SELECT tornado_magnitude, 
                            AVG(tornado_length) AS "Average Tornado Length",
                            AVG(tornado_width) as "Average Tornado Width"
                        FROM tornado
                        GROUP BY tornado_magnitude
                        ORDER BY tornado_magnitude;""")
        df = pd.read_sql(query, con=conn)

        # Close the connection
        conn.close()
        return(df)
        
    ########## Forth chart on dashboard2 ######################################################

    def queryPieChartData(self):
        # Create our session (link) from Python to the DB
        conn = self.engine.connect() # Raw SQL/Pandas

        # Define Query
        query = text("""SELECT 
                            tornado_magnitude,
                            AVG(fatalities) AS "Average Fatalities"
                        FROM 
                            tornado
                        GROUP BY 
                            tornado_magnitude;
                     """)
        df = pd.read_sql(query, con=conn)

        # Close the connection
        conn.close()
        return(df)
    
    ########## SQL query to show map on dashboard2 ######################################################
    
    def queryMapData(self):
        # Create our session (link) from Python to the DB
        conn = self.engine.connect() # Raw SQL/Pandas

        # Define Query
        query = text(""" SELECT 
                        year, 
                        tornado_magnitude,
                        start_latitude,
                        start_longitude,
                        state
                    FROM 
                        tornado;""")
        df = pd.read_sql(query, con=conn)
            #Close the connection
        conn.close()
        return(df)




    






