from flask_app import db
import datetime
import json
import os
import shutil
import re
from flask import current_app


class Portrait(db.Model):
    """Portrait model representing a person in the gallery"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    bio = db.Column(db.Text, nullable=False)
    image_filename = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    def __repr__(self):
        return f'<Portrait {self.name}>'
    
    def to_dict(self):
        """Convert portrait to dictionary format"""
        return {
            'id': self.id,
            'name': self.name,
            'company': self.company,
            'bio': self.bio,
            'image': f'/static/portraits/{self.image_filename}',
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


def get_companies():
    """Get list of unique companies"""
    companies = db.session.query(Portrait.company).distinct().order_by(Portrait.company).all()
    return [company[0] for company in companies]


def import_portraits_from_js():
    """
    Import portraits from the original JavaScript file.
    This is a utility function to be used once when setting up the database.
    """
    try:
        # Path to the original scripts.js file
        js_file_path = os.path.join(current_app.root_path, '..', 'scripts.js')
        
        # Check if scripts.js exists
        if not os.path.exists(js_file_path):
            current_app.logger.error("scripts.js file not found")
            return False
        
        # Read the scripts.js file
        with open(js_file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Find all portrait objects using regex
        portrait_pattern = r'{\s*id:\s*(\d+),\s*image:\s*\'([^\']+)\',\s*name:\s*\'([^\']+)\',\s*company:\s*\'([^\']+)\',\s*bio:\s*\'([^\']+)\'\s*}'
        portraits_matches = re.findall(portrait_pattern, content)
        
        if not portraits_matches:
            current_app.logger.error("Could not extract portrait data from scripts.js")
            return False
        
        # Ensure the upload folder exists
        os.makedirs(current_app.config['UPLOAD_FOLDER'], exist_ok=True)
        
        # Process each portrait
        for portrait_match in portraits_matches:
            portrait_id = int(portrait_match[0])
            image_path = portrait_match[1]
            name = portrait_match[2]
            company = portrait_match[3]
            bio = portrait_match[4]
            
            # Check if portrait with this ID already exists
            existing_portrait = Portrait.query.filter_by(id=portrait_id).first()
            if existing_portrait:
                current_app.logger.info(f"Portrait with ID {portrait_id} already exists, skipping")
                continue
            
            # Extract the image filename from the path
            image_filename = os.path.basename(image_path)
            
            # Check if the image file exists
            src_path = os.path.join(current_app.root_path, '..', image_path)
            if not os.path.exists(src_path):
                current_app.logger.warning(f"Image file not found: {src_path}")
                continue
            
            # Copy the image to the Flask static folder
            dest_path = os.path.join(current_app.config['UPLOAD_FOLDER'], image_filename)
            shutil.copy2(src_path, dest_path)
            
            # Create a new Portrait object
            new_portrait = Portrait(
                id=portrait_id,
                name=name,
                company=company,
                bio=bio,
                image_filename=image_filename
            )
            
            # Add to the database
            db.session.add(new_portrait)
        
        # Commit all changes
        db.session.commit()
        current_app.logger.info(f"Successfully imported {len(portraits_matches)} portraits from scripts.js")
        return True
        
    except Exception as e:
        current_app.logger.error(f"Error importing portraits: {str(e)}")
        db.session.rollback()
        return False


def seed_db():
    """Seed the database with initial data if empty"""
    # Check if database is empty
    if Portrait.query.count() == 0:
        current_app.logger.info("Database is empty, importing portraits from scripts.js")
        import_portraits_from_js()
    else:
        current_app.logger.info("Database already contains portraits, skipping import")
