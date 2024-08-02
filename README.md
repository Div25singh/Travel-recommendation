# Travel-recommendation

Step-by-Step Guide
1. Clone the Repository If the project is in a repository, clone it using:
bash
Copy code
git clone <repository_url>
cd <repository_directory>
2. Set Up Virtual Environment Create and activate a virtual environment:
bash
Copy code
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
3. Install Dependencies Install the required Python packages:
bash
Copy code
pip install flask networkx
4. Directory Structure Ensure your directory structure looks like this:
your-flask-app/
├── app.py
├── templates/
│ └── index.html
├── static/
│ ├── image.png
│ ├── styles.css
│ └── script.js
└── ...
5. Add Frontend Files Place your frontend files in the appropriate directories:
o index.html in the templates/ directory
o styles.css and script.js in the static/ directory
o image.png (the logo image) in the static/ directory
6. Run the Flask Application Start the Flask development server:
bash
Copy code
python app.py
You should see output indicating that the Flask server is running on http://127.0.0.1:5000/.
C:\Users\divysing\Downloads\Final NLPA\NLPA Assignment 1>python app.py
* Serving Flask app 'app'
* Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. 
Use a production WSGI server instead.
* Running on http://127.0.0.1:5000
Press CTRL+C to quit
* Restarting with stat
* Debugger is active!
* Debugger PIN: 504-024-609
7. Access the Application Open your web browser and navigate to http://127.0.0.1:5000/ to access 
the application
