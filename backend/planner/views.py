from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

from .models import Subject, Task, Reminder
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    SubjectSerializer,
    TaskSerializer,
    ReminderSerializer
)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        return Response({"message": "User created successfully"}, status=201)

    return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)

            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            })

        return Response({"error": "Invalid credentials"}, status=401)

    return Response(serializer.errors, status=400)


@api_view(['GET'])
def dashboard_view(request):
    user = request.user

    total = Task.objects.filter(user=user).count()
    completed = Task.objects.filter(user=user, is_completed=True).count()
    pending = Task.objects.filter(user=user, is_completed=False).count()
    overdue = Task.objects.overdue().filter(user=user).count()

    return Response({
        "total_tasks": total,
        "completed_tasks": completed,
        "pending_tasks": pending,
        "overdue_tasks": overdue
    })



class SubjectListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        subjects = Subject.objects.filter(user=request.user)
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SubjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class TaskListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tasks = Task.objects.filter(user=request.user)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class TaskDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        task = Task.objects.get(id=pk, user=request.user)
        serializer = TaskSerializer(task, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        task = Task.objects.get(id=pk, user=request.user)
        task.delete()
        return Response(status=204)


class ReminderListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        reminders = Reminder.objects.filter(user=request.user)
        serializer = ReminderSerializer(reminders, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ReminderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)