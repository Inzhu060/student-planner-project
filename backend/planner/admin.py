from django.contrib import admin
from .models import Profile, Subject, Task, Reminder

admin.site.register(Profile)
admin.site.register(Subject)
admin.site.register(Task)
admin.site.register(Reminder)
