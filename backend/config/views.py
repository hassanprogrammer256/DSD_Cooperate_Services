from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
@api_view(["GET"])
def HealthCheck(request):
    return Response({"status": "healthy","message": "Service is running Fine"},status=status.HTTP_200_OK)