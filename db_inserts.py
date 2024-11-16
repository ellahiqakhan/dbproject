import mysql.connector
import json

# Database connection configuration
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "Puffy2004", 
    "database": "UniVerseDB" 
}

# Function to insert data into a table
def insert_data(cursor, table_name, data):
    """
    Inserts data into the specified table.
    Args:
        cursor: The MySQL cursor object.
        table_name (str): Name of the table to insert data.
        data (list): List of dictionaries containing data to insert as column-value pairs.
    """
    if isinstance(data, dict):
        data = [data]  # Convert single dictionary to list of dictionaries for batch insert
    
    # Construct columns and placeholders
    columns = ", ".join(data[0].keys())  
    placeholders = ", ".join(["%s"] * len(data[0]))  
    query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"

    # Debug: Print the query and data being inserted
    print(f"Executing query: {query}")
    print(f"Data: {data}")

    try:
        cursor.executemany(query, [tuple(d.values()) for d in data]) 
    except mysql.connector.Error as err:
        print(f"Error executing query: {err}")
        raise 

# Establish database connection
try:
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    # Load scraped data from JSON
    with open("scraped_data.json", "r") as file:
        scraped_data = json.load(file)

    # Insert data for each university
    for university, data in scraped_data.items():
        # Insert into University table
        university_data = {"Name": university}
        insert_data(cursor, "University", [university_data])  # Insert as list of dicts
        connection.commit()
        
        # Get the ID of the inserted university
        university_id = cursor.lastrowid
        
        # Insert Departments
        department_data = [{"Name": department, "UniversityID": university_id} for department in data["Departments"]]
        insert_data(cursor, "Department", department_data)
        
        # Insert Merit List URL
        if data["MeritList"]:
            merit_list_data = [{"MeritListURL": data["MeritList"], "UniversityID": university_id}]
            insert_data(cursor, "MeritList", merit_list_data)
        
        # Insert Scholarships
        scholarship_data = [{"Details": scholarship, "UniversityID": university_id} for scholarship in data["Scholarships"]]
        insert_data(cursor, "Scholarship", scholarship_data)
        
        # Insert Fee Policy Link
        if data["FeePolicyLink"]:
            fee_structure_data = [{"Program": "General", "EstimatedCost": None, "UniversityID": university_id}]
            insert_data(cursor, "FeeStructure", fee_structure_data)
        
        # Insert Contact Information (Phone Numbers)
        phone_data = [{"Phone": phone, "Email": None, "UniversityID": university_id} for phone in data["PhoneNumbers"]]
        insert_data(cursor, "Contact", phone_data)
        
        # Insert Contact Information (Emails)
        email_data = [{"Phone": None, "Email": email, "UniversityID": university_id} for email in data["Emails"]]
        insert_data(cursor, "Contact", email_data)
        
        connection.commit()

    print("Data inserted successfully!")

except mysql.connector.Error as err:
    print(f"Error: {err}")
finally:
    if connection.is_connected():
        cursor.close()
        connection.close()
