from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from shops.models import Shop, MenuItem



class Order(models.Model):

    class OrderStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"
        PREPARING = "PREPARING", "Preparing"
        READY_FOR_PICKUP = "READY", "Ready for Pickup"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"

    pickup_time = models.DateTimeField()
    status      = models.CharField(max_length=50, choices=OrderStatus.choices, default=OrderStatus.PENDING)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(1)])
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        limit_choices_to={'role': 'STUDENT'}
    )

    shop = models.ForeignKey(
        Shop,
        on_delete=models.PROTECT
    )

    def __str__(self):
        return f"Order #{self.id} for {self.student.email}"



class OrderItem(models.Model):
    quantity = models.PositiveIntegerField(default=1)
    name_at_purchase = models.CharField(max_length=255)
    price_at_purchase = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(1)])

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )

    menu_item = models.ForeignKey(
        MenuItem,
        on_delete=models.SET_NULL,
        null=True
    )

    def __str__(self):
        return f"{self.quantity} x {self.name_at_purchase}" 