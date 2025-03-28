from flask_app import create_app
import os

# Set environment variable to seed the database on first run
os.environ['FLASK_SEED_DB'] = 'True'

# Create the Flask application
app = create_app()

if __name__ == '__main__':
    # Run the Flask development server
    app.run(debug=True, host='0.0.0.0', port=7000)
