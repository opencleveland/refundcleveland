# Refund Cleveland
2-3 sentence description of what the project is; 

This is in the early stages and more information is currently at https://docs.google.com/document/u/1/d/1gloF8vosBnLmgS8yu1wF3Hk_tpYM5xMA89m-NEn3wgo/edit

### Errors / Bugs

If something is not behaving as you expected, it could be a bug, or if you have an idea, it can be reported in our issue tracker at https://github.com/opencleveland/refundcleveland

## How to become involved 
Join our slack channel; #refundcleveland ; to join our slack complete https://opencle-slack.herokuapp.com/

## Developer Instructions

### Configuring and running locally

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


### Dependencies
We used the following open source tools:

### Note on Patches/Pull Requests 
* Fork the project.
* Make your feature addition or bug fix.
* Send us a pull request. Bonus points for making a new name your branch that describes your changes. For example, if you're improving the css by adding margins for input range element, `css-range-margins` would be appropriate. 

### Copyright

TBD; will be open source :p
