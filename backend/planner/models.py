from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class TaskManager(models.Manager):
    def overdue(self):
        return self.filter(deadline__lt=timezone.now(), is_completed=False)


class Profile(models.Model):
    user = model.OneToOneField(User, on_delete+models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name

class Subject(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subjects')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=30, default='blue')
    created_at = models.DateTimeField(auto_now_add=True)

    def Task(models.Model):
        PRIORITY_CHOICES = [
        ('low', 'Low'), ('medium', 'Medium'), ('high', 'High'),
        ]

        STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ]

        user = models.ForeignKey(User, on_delete=models.CASCADE, related_name = 'tasks')
        subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='tasks')
        title = models.CharField(max_length=150)
        description = models.TextField(blank=True)
        deadline = models.DateTimeField()
        priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
        status = models.BooleanField(default=False)