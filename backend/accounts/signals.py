from django.dispatch import receiver
from django.db.models.signals import post_save
from .models import User, Profile



# ------------------------------------------------------------------------
# Automatically creates a Profile whenever a new User is created
# ------------------------------------------------------------------------
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)