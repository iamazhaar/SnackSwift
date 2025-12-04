from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Profile


User = get_user_model()


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Profile
        fields = ['first_name', 'last_name', 'gender', 'phone_number']



class UserSerializer(serializers.ModelSerializer):
    # -----------------------------------------------------------------
    # Nesting the profile so I get all user info in one JSON object
    # -----------------------------------------------------------------
    profile = ProfileSerializer()

    class Meta:
        model = User
        # ------------------------------------------------------------------
        # I included 'shop' so the frontend knows if this user owns a shop
        # ------------------------------------------------------------------
        fields           = ['id', 'email', 'role', 'shop', 'profile']
        read_only_fields = ['id', 'email', 'role', 'shop']



class UserRegistrationSerializer(serializers.ModelSerializer):
    # ------------------------------------------------------------------------------
    # Explicitly adding these fields since they belong to Profile, not User model
    # ------------------------------------------------------------------------------
    first_name   = serializers.CharField(write_only=True, required=False)
    last_name    = serializers.CharField(write_only=True, required=False)
    phone_number = serializers.CharField(write_only=True, required=False)

    # --------------------------------------------------------------------------------------------
    # Django never exposes password in serializers because it should never be readable
    # Hence, I must manullay define it with write_only=True so user can pass it while registering
    # --------------------------------------------------------------------------------------------
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', 'phone_number']
    
    def create(self, validated_data):
        # ----------------------------------------------------------
        #  Extract and pop all fields that belong to the Profile
        # ----------------------------------------------------------
        profile_data = {
            'first_name'  : validated_data.pop('first_name',   ''),
            'last_name'   : validated_data.pop('last_name',    ''),
            'phone_number': validated_data.pop('phone_number', '')
        }

        password = validated_data.pop('password')

        # ----------------------------------------------------------------------
        # Create the User safely using the Manager (hashes password)
        # (This automatically triggers the signal to create a blank Profile)
        # ----------------------------------------------------------------------
        user = User.objects.create_user(
            email=validated_data['email'],
            password=password,
            role = User.Role.STUDENT
        )

        # ---------------------------------------------------
        # Update the Profile object created by the signal
        # ---------------------------------------------------
        Profile.objects.filter(user=user).update(**profile_data)

        return user