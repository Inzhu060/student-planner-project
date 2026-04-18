from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class TaskManager(models.Manager):
    def overdue(self):
        return self.filter(deadline__lt=timezone.now(), is_completed=False)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
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

    def __str__(self):
        return self.name

class Task(models.Model):
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
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = TaskManager()

    def __str__(self):
        return self.title


class Reminder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reminders')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='reminders')
    remind_at = models.DateTimeField()
    message = models.CharField(max_length=255)
    is_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Reminder for {self.task.title}"