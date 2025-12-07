from django.urls import path
from .views import StudentRegistrationView, UserProfileView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)



urlpatterns = [
    path('register/', StudentRegistrationView.as_view(), name='student-register'),
    path('login/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('profile/', UserProfileView.as_view(), name='user-profile')
]