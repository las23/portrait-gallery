from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
from .models import db, Portrait, get_companies
from .forms import PortraitForm, SearchForm
import os
import uuid
import datetime

# Create blueprint
bp = Blueprint('portraits', __name__)


@bp.route('/')
def index():
    """Homepage that displays the portrait gallery"""
    # Initialize search form with company choices
    search_form = SearchForm()
    search_form.company.choices = [('', 'All Companies')] + [(c, c) for c in get_companies()]
    
    # Get query parameters
    query = request.args.get('query', '')
    company = request.args.get('company', '')
    sort = request.args.get('sort', 'name_asc')
    page = request.args.get('page', 1, type=int)
    
    # Build the query
    portrait_query = Portrait.query
    
    # Apply search filter if provided
    if query:
        search_term = f"%{query}%"
        portrait_query = portrait_query.filter(
            (Portrait.name.ilike(search_term)) | 
            (Portrait.company.ilike(search_term)) | 
            (Portrait.bio.ilike(search_term))
        )
    
    # Apply company filter if provided
    if company:
        portrait_query = portrait_query.filter(Portrait.company == company)
    
    # Apply sorting
    if sort == 'name_asc':
        portrait_query = portrait_query.order_by(Portrait.name.asc())
    elif sort == 'name_desc':
        portrait_query = portrait_query.order_by(Portrait.name.desc())
    elif sort == 'company_asc':
        portrait_query = portrait_query.order_by(Portrait.company.asc())
    elif sort == 'company_desc':
        portrait_query = portrait_query.order_by(Portrait.company.desc())
    elif sort == 'created_at_asc':
        portrait_query = portrait_query.order_by(Portrait.created_at.asc())
    elif sort == 'created_at_desc':
        portrait_query = portrait_query.order_by(Portrait.created_at.desc())
    
    # Paginate the results - 12 per page is good for gallery view
    portraits = portrait_query.paginate(page=page, per_page=12, error_out=False)
    
    # Set the form values from request args
    search_form.query.data = query
    search_form.company.data = company
    search_form.sort.data = sort
    
    return render_template('index.html', portraits=portraits, form=search_form)


@bp.route('/editor')
def editor():
    """Portrait editor page"""
    search_form = SearchForm()
    search_form.company.choices = [('', 'All Companies')] + [(c, c) for c in get_companies()]
    
    # Get query parameters
    query = request.args.get('query', '')
    company = request.args.get('company', '')
    sort = request.args.get('sort', 'name_asc')
    page = request.args.get('page', 1, type=int)
    
    # Build the query
    portrait_query = Portrait.query
    
    # Apply search filter if provided
    if query:
        search_term = f"%{query}%"
        portrait_query = portrait_query.filter(
            (Portrait.name.ilike(search_term)) | 
            (Portrait.company.ilike(search_term)) | 
            (Portrait.bio.ilike(search_term))
        )
    
    # Apply company filter if provided
    if company:
        portrait_query = portrait_query.filter(Portrait.company == company)
    
    # Apply sorting
    if sort == 'name_asc':
        portrait_query = portrait_query.order_by(Portrait.name.asc())
    elif sort == 'name_desc':
        portrait_query = portrait_query.order_by(Portrait.name.desc())
    elif sort == 'company_asc':
        portrait_query = portrait_query.order_by(Portrait.company.asc())
    elif sort == 'company_desc':
        portrait_query = portrait_query.order_by(Portrait.company.desc())
    elif sort == 'created_at_asc':
        portrait_query = portrait_query.order_by(Portrait.created_at.asc())
    elif sort == 'created_at_desc':
        portrait_query = portrait_query.order_by(Portrait.created_at.desc())
    
    # Paginate the results - 10 per page is good for list view
    portraits = portrait_query.paginate(page=page, per_page=10, error_out=False)
    
    # Set the form values from request args
    search_form.query.data = query
    search_form.company.data = company
    search_form.sort.data = sort
    
    return render_template('editor.html', portraits=portraits, form=search_form)


@bp.route('/portraits/add', methods=['GET', 'POST'])
def add_portrait():
    """Add a new portrait"""
    form = PortraitForm()
    
    if form.validate_on_submit():
        try:
            # Generate a unique filename for the image
            image_file = form.image.data
            if not image_file:
                flash('Image is required when adding a new portrait', 'danger')
                return render_template('portrait_form.html', form=form, title='Add New Portrait')
            
            filename = secure_filename(image_file.filename)
            # Add timestamp and random string to ensure uniqueness
            name_parts = os.path.splitext(filename)
            unique_filename = f"{name_parts[0]}_{uuid.uuid4().hex[:8]}{name_parts[1]}"
            
            # Save the file
            image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
            image_file.save(image_path)
            
            # Create new portrait
            portrait = Portrait(
                name=form.name.data,
                company=form.company.data,
                bio=form.bio.data,
                image_filename=unique_filename
            )
            
            # Add to database
            db.session.add(portrait)
            db.session.commit()
            
            flash('Portrait added successfully!', 'success')
            return redirect(url_for('portraits.editor'))
            
        except Exception as e:
            current_app.logger.error(f"Error adding portrait: {str(e)}")
            db.session.rollback()
            flash(f'Error adding portrait: {str(e)}', 'danger')
    
    return render_template('portrait_form.html', form=form, title='Add New Portrait')


@bp.route('/portraits/<int:id>/edit', methods=['GET', 'POST'])
def edit_portrait(id):
    """Edit an existing portrait"""
    portrait = Portrait.query.get_or_404(id)
    form = PortraitForm(obj=portrait)
    
    if request.method == 'GET':
        # Don't populate the file field for GET requests
        form.image.data = None
    
    if form.validate_on_submit():
        try:
            # Update portrait data
            portrait.name = form.name.data
            portrait.company = form.company.data
            portrait.bio = form.bio.data
            
            # Handle image upload if provided
            image_file = form.image.data
            if image_file:
                # Generate a unique filename
                filename = secure_filename(image_file.filename)
                name_parts = os.path.splitext(filename)
                unique_filename = f"{name_parts[0]}_{uuid.uuid4().hex[:8]}{name_parts[1]}"
                
                # Save the file
                image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)
                image_file.save(image_path)
                
                # Delete old image if it exists
                if portrait.image_filename:
                    old_image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], portrait.image_filename)
                    if os.path.exists(old_image_path):
                        os.remove(old_image_path)
                
                # Update image filename
                portrait.image_filename = unique_filename
            
            # Update timestamp
            portrait.updated_at = datetime.datetime.utcnow()
            
            # Save changes
            db.session.commit()
            
            flash('Portrait updated successfully!', 'success')
            return redirect(url_for('portraits.editor'))
            
        except Exception as e:
            current_app.logger.error(f"Error updating portrait: {str(e)}")
            db.session.rollback()
            flash(f'Error updating portrait: {str(e)}', 'danger')
    
    return render_template('portrait_form.html', form=form, portrait=portrait, title='Edit Portrait')


@bp.route('/portraits/<int:id>/delete', methods=['POST'])
def delete_portrait(id):
    """Delete a portrait"""
    portrait = Portrait.query.get_or_404(id)
    
    try:
        # Delete the image file
        if portrait.image_filename:
            image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], portrait.image_filename)
            if os.path.exists(image_path):
                os.remove(image_path)
        
        # Delete from database
        db.session.delete(portrait)
        db.session.commit()
        
        flash('Portrait deleted successfully!', 'success')
    except Exception as e:
        current_app.logger.error(f"Error deleting portrait: {str(e)}")
        db.session.rollback()
        flash(f'Error deleting portrait: {str(e)}', 'danger')
    
    return redirect(url_for('portraits.editor'))


@bp.route('/portraits/<int:id>/view')
def view_portrait(id):
    """View a single portrait"""
    portrait = Portrait.query.get_or_404(id)
    return render_template('portrait_view.html', portrait=portrait)


@bp.route('/api/portraits', methods=['GET'])
def api_portraits():
    """API endpoint to get all portraits as JSON"""
    portraits = Portrait.query.all()
    return jsonify([portrait.to_dict() for portrait in portraits])

@bp.route('/api/portraits/<int:id>', methods=['GET'])
def api_portrait(id):
    """API endpoint to get a specific portrait as JSON"""
    portrait = Portrait.query.get_or_404(id)
    return jsonify(portrait.to_dict())

@bp.route('/api/companies', methods=['GET'])
def api_companies():
    """API endpoint to get list of all companies"""
    companies = get_companies()
    return jsonify(companies)


@bp.route('/original')
def original_index():
    """Render the original index page with dynamically loaded portraits"""
    # Get companies for the filter
    companies = get_companies()
    return render_template('original_index.html', companies=companies)


@bp.route('/standalone')
def standalone():
    """Serve the standalone portrait gallery page"""
    return send_from_directory('static', 'standalone.html')


@bp.route('/grid-test')
def grid_test():
    """Serve the grid test page for debugging"""
    return send_from_directory('static', 'grid_test.html')


@bp.route('/simple')
def simple():
    """Serve the simple portrait gallery page"""
    return send_from_directory('static', 'simple.html')
