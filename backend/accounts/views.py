from django.contrib.auth import get_user_model
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .serializers import StudentRegistrationSerializer, UserSerializer, ProfileSerializer



User = get_user_model()



# ------------------------------------
# Student Registration View (POST)
# ------------------------------------
class StudentRegistrationView(CreateAPIView):
    # Handles the creation of a new Student account
    queryset = User.objects.all()
    serializer_class = StudentRegistrationSerializer
    permission_classes = [AllowAny]



# ------------------------------------
# Profile Management View (GET, PUT)
# ------------------------------------
class UserProfileView(RetrieveUpdateAPIView):
    """
    Allows authenticated users to view their profile (GET) and update it (PUT/PATCH)
    """
    serializer_class = UserSerializer

    # Only authenticated users (students/owners/admins) can access their profile
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Always returns the currently logged-in user object
        return self.request.user
    
    # I override the update method to handle nested Profile update
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # 1. Update User Data (Email, etc.)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # 2. Update Profile Data (Safely)
        profile_data = request.data.get('profile')
        if profile_data:
            # Initialize serializer with the instance AND data
            profile_serializer = ProfileSerializer(instance.profile, data=profile_data, partial=True)
            if profile_serializer.is_valid(raise_exception=True):
                profile_serializer.save()
        
        return Response(serializer.data)