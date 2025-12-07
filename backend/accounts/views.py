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
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['profile_serializer'] = ProfileSerializer()
        return context
    
    # I override the update method to handle nested Profile update
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # If profile data is present, update the profile as well
        profile_data = request.data.get('profile', {})
        if profile_data:
            profile_serializer = self.get_serializer_context().get('profile_serializer')
            if profile_serializer:
                profile_serializer.update(instance.profile, profile_data)
        
        return Response(serializer.data)