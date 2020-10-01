# refundcleveland

## Developer info

### Configure and run locally

#### Clone repo and install requirements

```sh
git clone https://github.com/jessicalynch/refundcleveland
cd refundcleveland
pip3 install -r requirements.txt
```
#### Add local settings
Duplicate **local_settings_template.py**. Rename to **local_settings.py** and fill in environmental variables:

`SECRET_KEY` -- Django’s Secret Key used by the project

#### Run the app

```sh
python3 manage.py runserver
```

Navigate to http://localhost:8000/
