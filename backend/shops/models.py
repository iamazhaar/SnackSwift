from django.db import models
from django.core.validators import MinValueValidator



class Shop(models.Model):
    name        = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    is_active   = models.BooleanField(default=True)

    house  = models.CharField(max_length=50)
    street = models.CharField(max_length=100)
    block  = models.CharField(max_length=50, blank=True, null=True)
    area   = models.CharField(max_length=100)
    city   = models.CharField(max_length=100)

    def __str__(self):
        return self.name



class OperatingHour(models.Model):

    class DayOfWeek(models.IntegerChoices):
        MONDAY    = 0, "Monday"
        TUESDAY   = 1, "Tuesday"
        WEDNESDAY = 2, "Wednesday"
        THURSDAY  = 3, "Thursday"
        FRIDAY    = 4, "Friday"
        SATURDAY  = 5, "Saturday"
        SUNDAY    = 6, "Sunday"

    shop       = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='operating_hours')
    day        = models.IntegerField(choices=DayOfWeek.choices)
    open_time  = models.TimeField(blank=True, null=True)
    close_time = models.TimeField(blank=True, null=True)
    is_closed  = models.BooleanField(default=False)

    class Meta:
        unique_together = ('shop', 'day')



class Category(models.Model):
    name        = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name



class MenuItem(models.Model):
    name         = models.CharField(max_length=255)
    description  = models.TextField(blank=True, null=True)
    price        = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(1)])
    is_available = models.BooleanField(default=True)

    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="menu_items")
    shop     = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name="menu_items")

    def __str__(self):
        return f"{self.name} ({self.shop.name})"