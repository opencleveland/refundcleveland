# rename to local_settings.py
DEBUG="TRUE"
SECRET_KEY="ENTER KEY HERE" # Django secret key
GOOGLE_API_KEY="ENTER KEY HERE" #Geocode Earth Api Key
MAILGUN_API_KEY="ENTER KEY HERE"

# these are rolling credentials, and may need to be updated occasionally
# retrieve them from Heroku
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': '<name>',
        'USER': '<user>',
        'PASSWORD': '<password>',
        'HOST': '<host>',
        'PORT': '<port>',
    }
}
