from rest_framework import serializers
from .models import Shop, OperatingHour, Category, MenuItem



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']



class OperatingHourSerializer(serializers.ModelSerializer):
    # -----------------------------------------------------------------
    # Converts Integer Day (0) to String ("Monday") for the Frontend
    # -----------------------------------------------------------------
    day_name = serializers.CharField(source='get_day_display', read_only=True)

    class Meta:
        model = OperatingHour
        fields = ['id', 'day', 'day_name', 'open_time', 'close_time', 'is_closed']



class ShopSerializer(serializers.ModelSerializer):
    # -----------------------------------------------------------
    # Serializing Relationship (Nested Object Method)
    # Nesting OperatingHour Directly Inside The Shop Response
    # -----------------------------------------------------------
    operating_hours = OperatingHourSerializer(many=True, read_only=True)

    class Meta:
        model = Shop
        fields = [
            'id', 'name', 'description', 'is_active',
            'house', 'street', 'block', 'area', 'city',
            'operating_hours'
        ]



class MenuItemSerializer(serializers.ModelSerializer):
    # -------------------------------------------------------------------------------
    # Serializing Relationship (Nested Object Method)
    # For Reading: Shows the full category object (id, name, desc)
    # -------------------------------------------------------------------------------
    category = CategorySerializer(read_only=True)

    # For Writing: Accepts a Category ID (e.g., 5)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset = Category.objects.all(),
        source = 'category',
        write_only=True,
        required=False
    )

    # ------------------------------------------------------------
    # Keeping 'shop' as an ID is Usually Sufficient for Linking
    # ------------------------------------------------------------
    class Meta:
        model = MenuItem
        fields = [
            'id', 'name', 'description', 'price',
            'is_available', 'category', 'shop'
        ]