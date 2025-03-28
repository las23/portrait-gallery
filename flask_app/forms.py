from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import StringField, TextAreaField, HiddenField, SelectField
from wtforms.validators import DataRequired, Length


class PortraitForm(FlaskForm):
    """Form for adding or editing a portrait"""
    id = HiddenField('ID')
    name = StringField('Name', validators=[DataRequired(), Length(min=2, max=100)])
    company = StringField('Company', validators=[DataRequired(), Length(min=2, max=100)])
    bio = TextAreaField('Bio', validators=[DataRequired(), Length(min=10, max=1000)])
    image = FileField('Portrait Image', validators=[
        FileAllowed(['jpg', 'jpeg', 'png'], 'Images only!')
    ])


class SearchForm(FlaskForm):
    """Form for searching portraits"""
    query = StringField('Search', validators=[Length(max=100)])
    company = SelectField('Filter by Company', choices=[('', 'All Companies')])
    sort = SelectField('Sort by', choices=[
        ('name_asc', 'Name (A-Z)'),
        ('name_desc', 'Name (Z-A)'),
        ('company_asc', 'Company (A-Z)'),
        ('company_desc', 'Company (Z-A)'),
        ('created_at_desc', 'Newest first'),
        ('created_at_asc', 'Oldest first'),
    ])
