from django.contrib import admin
from .models import Order, OrderItem


# --------------------------------------------------------------
# Inline for Order Items (Shown inside each Order)
# --------------------------------------------------------------
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ["name_at_purchase", "price_at_purchase"]
    fields = ["menu_item", "quantity", "name_at_purchase", "price_at_purchase"]
    autocomplete_fields = ["menu_item"]
    ordering = ["menu_item"]


# --------------------------------------------------------------
# Order Admin
# --------------------------------------------------------------
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display  = ["id", "student", "shop", "status", "pickup_time", "total_price", "created_at"]
    list_filter   = ["status", "created_at"]
    search_fields = ["id", "student__email", "shop__name"]
    ordering      = ["-created_at"]

    autocomplete_fields = ["student", "shop"]

    readonly_fields = ["created_at", "updated_at", "total_price"]

    fieldsets = [
        ("Order Info", {
            "fields": ("student", "shop", "status", "pickup_time")
        }),
        ("Financials", {
            "fields": ("total_price",)
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at")
        }),
    ]

    inlines = [OrderItemInline]