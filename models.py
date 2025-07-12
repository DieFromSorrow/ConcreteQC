from extends import db
from sqlalchemy import Enum


class ConstructionUnit(db.Model):
    __tablename__ = 'construction_units'
    unit_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    unit_name = db.Column(db.String(100), nullable=False)
    contact_person = db.Column(db.String(50))
    contact_phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

    projects = db.relationship('Project', backref='construction_unit', lazy=True)


class Project(db.Model):
    __tablename__ = 'projects'
    project_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    project_name = db.Column(db.String(100), nullable=False)
    unit_id = db.Column(db.Integer, db.ForeignKey('construction_units.unit_id'), nullable=False)
    construction_area = db.Column(db.Float, comment='建筑面积(平方米)')
    total_duration = db.Column(db.Integer, comment='总工期(天)')
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    project_description = db.Column(db.Text)
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

    inspection_tasks = db.relationship('InspectionTask', backref='project', lazy=True)


class DamageType(db.Model):
    __tablename__ = 'damage_types'
    type_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type_name = db.Column(db.String(50), nullable=False)
    severity = db.Column(Enum('low', 'medium', 'high', name='severity_enum'),
                         nullable=False, default='medium')
    description = db.Column(db.Text)
    repair_guideline = db.Column(db.Text)

    detections = db.relationship('DamageDetection', backref='damage_type', lazy=True)


class InspectionTask(db.Model):
    __tablename__ = 'inspection_tasks'
    task_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.project_id'), nullable=False)
    task_name = db.Column(db.String(100), nullable=False)
    inspector = db.Column(db.String(50))
    inspection_date = db.Column(db.Date, nullable=False)
    inspection_area = db.Column(db.Float, comment='巡检面积(平方米)')
    weather_condition = db.Column(db.String(50))
    notes = db.Column(db.Text)
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

    images = db.relationship('InspectionImage', backref='inspection_task', lazy=True)


class InspectionImage(db.Model):
    __tablename__ = 'inspection_images'
    image_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    task_id = db.Column(db.Integer, db.ForeignKey('inspection_tasks.task_id'), nullable=False)
    original_name = db.Column(db.String(255), nullable=False)
    storage_path = db.Column(db.String(255), nullable=False)
    file_size = db.Column(db.Float, comment='文件大小(KB)')
    width = db.Column(db.Integer)
    height = db.Column(db.Integer)
    capture_time = db.Column(db.DateTime)
    location_description = db.Column(db.Text)
    gps_coordinates = db.Column(db.String(100))
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())

    detections = db.relationship('DamageDetection', backref='inspection_image', lazy=True)


class DamageDetection(db.Model):
    __tablename__ = 'damage_detections'
    detection_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    image_id = db.Column(db.Integer, db.ForeignKey('inspection_images.image_id'), nullable=False)
    type_id = db.Column(db.Integer, db.ForeignKey('damage_types.type_id'), nullable=False)
    detection_time = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp())
    confidence = db.Column(db.Float, nullable=False, comment='置信度0-1')
    area_pixels = db.Column(db.Integer, nullable=False, comment='病害像素面积')
    area_percentage = db.Column(db.Float, nullable=False, comment='占图像面积百分比')
    x_min = db.Column(db.Integer, nullable=False)
    y_min = db.Column(db.Integer, nullable=False)
    x_max = db.Column(db.Integer, nullable=False)
    y_max = db.Column(db.Integer, nullable=False)
    is_repaired = db.Column(db.Boolean, default=False)
    repair_date = db.Column(db.Date)
    notes = db.Column(db.Text)
