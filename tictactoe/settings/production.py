from tictactoe.settings.staging import *

# There should be only minor differences from staging

DATABASES['default']['NAME'] = 'tictactoe_production'
DATABASES['default']['USER'] = 'tictactoe_production'

EMAIL_SUBJECT_PREFIX = '[Tictactoe Prod] '

# Uncomment if using celery worker configuration
# BROKER_URL = 'amqp://tictactoe_production:%(BROKER_PASSWORD)s@%(BROKER_HOST)s/tictactoe_production' % os.environ