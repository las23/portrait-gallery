from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

# Initialize SQLAlchemy
db = SQLAlchemy()

def create_app():
    """Create and configure the Flask application"""
    # Create Flask app
    app = Flask(__name__, instance_relative_config=True)
    
    # Ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    
    # Configure the app
    app.config.from_mapping(
        SECRET_KEY='dev',
        SQLALCHEMY_DATABASE_URI=f'sqlite:///{os.path.join(app.instance_path, "portraits.sqlite")}',
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        UPLOAD_FOLDER=os.path.join(app.static_folder, 'portraits'),
        MAX_CONTENT_LENGTH=16 * 1024 * 1024  # 16MB max upload size
    )
    
    # Initialize extensions with app
    db.init_app(app)
    
    # Register blueprints
    from . import views
    app.register_blueprint(views.bp)
    
    # Register context processors
    from .helpers import get_context_processors
    for processor in get_context_processors():
        app.context_processor(processor)
    
    # Create database tables
    with app.app_context():
        db.create_all()
        
        # Import seed_db function and call it if needed
        from .models import seed_db
        
        # Check if we should seed the database
        if os.environ.get('FLASK_SEED_DB', 'False').lower() == 'true':
            seed_db()
    
    # Return the configured app
    return app
