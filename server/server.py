import connexion
import os
from flask_cors import CORS


ENV = os.environ.get('PYTHON_ENV', 'development')
is_production = ENV == 'production'

CRT_PATH = os.environ.get('CRT_PATH')
KEY_PATH = os.environ.get('KEY_PATH')

if is_production:
    pass

if __name__ == '__main__':
    app = connexion.FlaskApp(__name__, specification_dir='./')
    app.add_api('swagger.yml', strict_validation=True)
    app.add_error_handler(500, lambda: ('Error', 500))
    CORS(app.app)
    if is_production:
        app.run(ssl_context=(CRT_PATH, KEY_PATH))
    else:
        app.run(debug=True)
