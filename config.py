import os


class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'secret_string')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # mysql所在的主机名
    HOSTNAME = "127.0.0.1"
    # mysql监听的端口号
    PORT = 3306
    # 数据库名称
    DATABASE = "road_inspection_system"
    # 连接mysql的用户名
    USERNAME = os.getenv('DATABASE_USERNAME')
    # 连接密码
    PASSWORD = os.getenv('DATABASE_PASSWORD')
    DB_URI = 'mysql+pymysql://{}:{}@{}:{}/{}?charset=utf8'.format(USERNAME, PASSWORD, HOSTNAME, PORT, DATABASE)
    SQLALCHEMY_DATABASE_URI = DB_URI
    pass
