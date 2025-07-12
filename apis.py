from flask import jsonify, request, Blueprint
from datetime import datetime
from models import db, ConstructionUnit, Project, DamageType, InspectionTask, InspectionImage, DamageDetection


bp = Blueprint('apis', __name__)


# 辅助函数：将SQLAlchemy对象转为字典
def to_dict(obj):
    return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}


# ------------------------ Construction Units API ------------------------
@bp.route('/units', methods=['GET'])
def get_units():
    units = ConstructionUnit.query.all()
    return jsonify([to_dict(u) for u in units])


@bp.route('/units/<int:unit_id>', methods=['GET'])
def get_unit(unit_id):
    unit = ConstructionUnit.query.get_or_404(unit_id)
    return jsonify(to_dict(unit))


@bp.route('/units', methods=['POST'])
def create_unit():
    data = request.json
    new_unit = ConstructionUnit(
        unit_name=data['unit_name'],
        contact_person=data.get('contact_person'),
        contact_phone=data.get('contact_phone'),
        address=data.get('address')
    )
    db.session.add(new_unit)
    db.session.commit()
    return jsonify(to_dict(new_unit)), 201


@bp.route('/units/<int:unit_id>', methods=['PUT'])
def update_unit(unit_id):
    unit = ConstructionUnit.query.get_or_404(unit_id)
    data = request.json
    unit.unit_name = data.get('unit_name', unit.unit_name)
    unit.contact_person = data.get('contact_person', unit.contact_person)
    unit.contact_phone = data.get('contact_phone', unit.contact_phone)
    unit.address = data.get('address', unit.address)
    db.session.commit()
    return jsonify(to_dict(unit))


@bp.route('/units/<int:unit_id>', methods=['DELETE'])
def delete_unit(unit_id):
    unit = ConstructionUnit.query.get_or_404(unit_id)
    db.session.delete(unit)
    db.session.commit()
    return '', 204


# ------------------------ Projects API ------------------------
@bp.route('/projects', methods=['GET'])
def get_projects():
    projects = Project.query.all()
    return jsonify([to_dict(p) for p in projects])


@bp.route('/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    project = Project.query.get_or_404(project_id)
    return jsonify(to_dict(project))


@bp.route('/projects', methods=['POST'])
def create_project():
    data = request.json
    new_project = Project(
        project_name=data['project_name'],
        unit_id=data['unit_id'],
        construction_area=data.get('construction_area'),
        total_duration=data.get('total_duration'),
        start_date=datetime.strptime(data['start_date'], '%Y-%m-%d').date() if 'start_date' in data else None,
        end_date=datetime.strptime(data['end_date'], '%Y-%m-%d').date() if 'end_date' in data else None,
        project_description=data.get('project_description')
    )
    db.session.add(new_project)
    db.session.commit()
    return jsonify(to_dict(new_project)), 201


# 类似的PUT和DELETE方法需要为其他模型实现...

# ------------------------ Damage Types API ------------------------
@bp.route('/damage_types', methods=['GET'])
def get_damage_types():
    types = DamageType.query.all()
    return jsonify([to_dict(t) for t in types])


# ------------------------ Inspection Tasks API ------------------------
@bp.route('/tasks', methods=['POST'])
def create_task():
    data = request.json
    new_task = InspectionTask(
        project_id=data['project_id'],
        task_name=data['task_name'],
        inspector=data.get('inspector'),
        inspection_date=datetime.strptime(data['inspection_date'], '%Y-%m-%d').date(),
        inspection_area=data.get('inspection_area'),
        weather_condition=data.get('weather_condition'),
        notes=data.get('notes')
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify(to_dict(new_task)), 201


# ------------------------ Inspection Images API ------------------------
@bp.route('/images', methods=['POST'])
def create_image():
    data = request.json
    new_image = InspectionImage(
        task_id=data['task_id'],
        original_name=data['original_name'],
        storage_path=data['storage_path'],
        file_size=data.get('file_size'),
        width=data.get('width'),
        height=data.get('height'),
        capture_time=datetime.strptime(data['capture_time'], '%Y-%m-%d %H:%M:%S') if 'capture_time' in data else None,
        location_description=data.get('location_description'),
        gps_coordinates=data.get('gps_coordinates')
    )
    db.session.add(new_image)
    db.session.commit()
    return jsonify(to_dict(new_image)), 201


# ------------------------ Damage Detections API ------------------------
@bp.route('/detections', methods=['POST'])
def create_detection():
    data = request.json
    new_detection = DamageDetection(
        image_id=data['image_id'],
        type_id=data['type_id'],
        confidence=data['confidence'],
        area_pixels=data['area_pixels'],
        area_percentage=data['area_percentage'],
        x_min=data['x_min'],
        y_min=data['y_min'],
        x_max=data['x_max'],
        y_max=data['y_max'],
        is_repaired=data.get('is_repaired', False),
        repair_date=datetime.strptime(data['repair_date'], '%Y-%m-%d').date() if 'repair_date' in data else None,
        notes=data.get('notes')
    )
    db.session.add(new_detection)
    db.session.commit()
    return jsonify(to_dict(new_detection)), 201


# ------------------------ Statistics Views ------------------------
@bp.route('/project_overview', methods=['GET'])
def get_project_overview():
    # 实际应用中应使用数据库视图查询，这里简化为示例
    result = db.session.execute("SELECT * FROM project_overview")
    return jsonify([dict(row) for row in result.mappings()])


@bp.route('/inspection_summary', methods=['GET'])
def get_inspection_summary():
    result = db.session.execute("SELECT * FROM inspection_summary")
    return jsonify([dict(row) for row in result.mappings()])


@bp.route('/damage_statistics', methods=['GET'])
def get_damage_statistics():
    result = db.session.execute("SELECT * FROM damage_statistics")
    return jsonify([dict(row) for row in result.mappings()])
