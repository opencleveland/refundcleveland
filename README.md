# Refund Cleveland

a website for residents to City of Cleveland change their Budget to show what they want the city to value and 
share their proposed budget with their elected councilperson in city government.

Project outline is at: 
https://docs.google.com/document/d/1ydc5Bw0Ctp8LJFEWECu9f9wMeUfM-FKlhTROik0QJiY/edit

We have a [Miro Board](https://miro.com/app/board/o9J_kj4DePU=/) to sketch out a wireframe. 

You can view our project, live, at https://refundcleveland.com

### Errors / Bugs:

If something is not behaving as you expected, it could be a bug, or if you have an idea, it can be reported in our issue tracker at https://github.com/opencleveland/refundcleveland

## How to become involved: 

Join our slack channel - #refundcleveland. Complete self-sign up link https://opencle-slack.herokuapp.com/ to join our slack instance. 

Most of our features, issues, and discussion is coordinated through our slack channel.

We also meet weekly at 7:30 PM (Eastern Standard Time) on a Zoom call on Mondays (Details in the slack channel)

## Developer Instructions

### Configuring and running locally
Pre-Requisites:
- Git
- Python 3.8+

#### Clone repo and install requirements

```sh
git clone https://github.com/refundcleveland
cd refundcleveland
pip3 install -r requirements.txt
```
#### Add local settings
Copy and rename **local_settings_template.py** to **local_settings.py**, and fill in environmental variables:

`SECRET_KEY` -- Django’s Secret Key used by the project

#### Run the app

```sh
python3 manage.py runserver
```

Navigate to http://localhost:8000/

### Running in a production environment
This is currently done through heroku.

### Dependencies
We used the following open source libraries/tools:
d3, django, python3

### Note on Patches/Pull Requests 
* Fork the project.
* Make your feature addition or bug fix.
* Send us a pull request. Bonus points for making a new name your branch that describes your changes. For example, if you're improving the css by adding margins for input range element, `css-range-margins` would be appropriate. 

### Copyright

TBD; will be open source :p
