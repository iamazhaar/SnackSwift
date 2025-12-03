from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Profile



# -------------------------------------
# Inline Profile in UserAdmin
# -------------------------------------
class ProfileInline(admin.StackedInline):
    model = Profile
    extra = 0
    can_delete = False
    readonly_fields = ["created_at", "updated_at"]

    # ---------------------------------------------------------
    # Hides "Save and add another" Button From ProfileInline
    # ---------------------------------------------------------
    def has_add_permission(self, request, obj=None):
        return False



# -------------------------------------
# Custom User Admin
# -------------------------------------
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display        = ["email", "role", "shop", "is_active", "is_staff", "is_superuser", "date_joined"]
    list_filter         = ["role", "is_active", "is_staff", "is_superuser"]
    search_fields       = ["email__istartswith", "profile__first_name__istartswith", "profile__last_name__istartswith", "profile__phone_number"]
    autocomplete_fields = ["shop"]
    ordering            = ["-date_joined"]

    inlines = [ProfileInline]

    fieldsets = [
        ("Login Credentials", {"fields": ("email", "password")}),
        ("Role & Permissions", {"fields": ("role", "shop", "is_active", "is_staff", "is_superuser")}),
        ("Groups & Permissions", {"fields": ("groups", "user_permissions")})
    ]

    add_fieldsets = [
        (
            "Create User",
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2", "role", "shop", "is_active")
            }
        )
    ]

    # ---------------------------------------------------------
    # Removes "Save and add another" Button From UserAdmin
    # ---------------------------------------------------------
    def changeform_view(self, request, object_id=None, form_url="", extra_context=None):
        extra_context = extra_context or {}
        extra_context["show_save_and_add_another"] = False
        
        return super().changeform_view(request, object_id, form_url, extra_context)