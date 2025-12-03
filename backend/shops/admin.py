from django.contrib import admin

# ------------------------------------------------------------------------------------------
# For Showing MENU ITEMS COUNT & Redirecting to the Sorted MenuItems Page of a Category
# ------------------------------------------------------------------------------------------
from django.db.models import Count
from django.urls import reverse
from django.utils.html import format_html, urlencode

from .models import Shop, OperatingHour, Category, MenuItem



# -----------------------------------------
# Create an Inline for Operating Hours
# -----------------------------------------
class OperatingHourInline(admin.TabularInline):
    model = OperatingHour
    extra = 0
    ordering = ["day"]



@admin.register(Shop)
class ShopAdmin(admin.ModelAdmin):
    list_display  = ["name", "area", "city", "is_active"]
    list_filter   = ["is_active", "city", "area"]
    search_fields = ["name", "street", "area", "city"]
    ordering      = ["name"]

    inlines = [OperatingHourInline]

    fieldsets = [
        (
            "Basic Info", 
            {"fields": ("name", "description", "is_active")}
        ),
        (
            "Address",
            {"fields": ("house", "street", "block", "area", "city")}
        )
    ]



@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display  = ["name", "menu_items_count"]
    search_fields = ["name"]
    ordering      = ["name"]

    @admin.display(ordering="menu_items_count")
    def menu_items_count(self, category):
        url = (
            reverse("admin:shops_menuitem_changelist")
            + "?"
            + urlencode({
                "category__id__exact": str(category.id)
            })
        )
        return format_html('<a href="{}">{}</a>', url, category.menu_items_count)
    
    def get_queryset(self, request):
        return super().get_queryset(request).annotate(
            menu_items_count = Count("menu_items")
        )



@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ["name", "shop", "category", "price", "is_available"]
    list_filter = ["is_available", "shop", "category"]
    search_fields = ["name", "shop__name", "category__name"]
    ordering = ["shop", "category", "name"]
    list_editable = ["price", "is_available"]
    autocomplete_fields = ["shop", "category"] 