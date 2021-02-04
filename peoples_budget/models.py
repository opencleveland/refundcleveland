from django.db import models
from django.contrib.postgres.fields import JSONField
import uuid

# Create your models here.

class BudgetSubmission(models.Model):
    # https://docs.djangoproject.com/en/3.1/ref/models/fields/#model-field-types
    the_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submitter_email = models.EmailField()
    submitter_address = models.TextField()
    submitter_ward = models.IntegerField()
    submitter_json = models.JSONField()
