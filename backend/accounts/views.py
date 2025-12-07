from django.contrib.auth import get_user_model
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from .serializers import StudentRegistrationSerializer



User = get_user_model()



# ------------------------------------
# Student Registration View (POST)
# ------------------------------------
class StudentRegistrationView(CreateAPIView):
    # Handles the creation of a new Student account
    queryset = User.objects.all()
    serializer_class = StudentRegistrationSerializer
    permission_classes = [AllowAny]