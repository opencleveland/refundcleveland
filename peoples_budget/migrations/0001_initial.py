from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BudgetSubmission',
            fields=[
                ('the_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('submitter_email', models.EmailField(max_length=254)),
                ('submitter_address', models.TextField()),
                ('submitter_ward', models.IntegerField()),
                ('submitter_json', models.JSONField()),
            ],
        ),
    ]
