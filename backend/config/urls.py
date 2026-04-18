from django.contrib import admin
from django.urls import path
from planner.views import (
    register_view,
    login_view,
    dashboard_view,
    SubjectListCreateAPIView,
    TaskListCreateAPIView,
    TaskDetailAPIView,
    ReminderListCreateAPIView,
)


urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/register/', register_view),
    path('api/login/', login_view),

    path('api/dashboard/', dashboard_view),

    path('api/subjects/', SubjectListCreateAPIView.as_view()),

    path('api/tasks/', TaskListCreateAPIView.as_view()),
    path('api/tasks/<int:pk>/', TaskDetailAPIView.as_view()),

    path('api/reminders/', ReminderListCreateAPIView.as_view()),
]
