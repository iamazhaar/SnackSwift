from django.db.transaction import atomic
from rest_framework import serializers
from .models import OrderItem, Order
from shops.models import MenuItem



class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item_id', 'quantity', 'name_at_purchase', 'price_at_purchase']
        read_only_fields = ['name_at_purchase', 'price_at_purchase']



class OrderReadSerializer(serializers.ModelSerializer):
    # --------------------------------------------------------------------------------
    # Nested serializer to show the full list of ordered items within the order JSON
    # --------------------------------------------------------------------------------
    items = OrderItemSerializer(many=True, read_only=True)

    # ------------------------------------------------
    # Helper fields to show names instead of just IDs
    # ------------------------------------------------
    shop_name = serializers.CharField(source='shop.name', read_only=True)
    student_email = serializers.EmailField(source='student.email', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'shop', 'shop_name', 'student', 'student_email',
            'pickup_time', 'status', 'status_display', 'total_price',
            'created_at', 'items'
        ]



class OrderCreateSerializer(serializers.ModelSerializer):
    # ----------------------------------------------------------------------
    # This expects a list of items: [{menu_item_id: 1, quantity: 2}, ...]
    # ----------------------------------------------------------------------
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['shop', 'pickup_time', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        student    = self.context['request'].user

        # -------------------------------------------------
        # Calculating Total Price Securely on the Backend
        # -------------------------------------------------
        total_price = 0
        order_items_payload = []
        for item in items_data:
            menu_item_id = item['menu_item_id']
            quantity = item['quantity']
            try:
                menu_item = MenuItem.objects.get(pk=menu_item_id)
            except MenuItem.DoesNotExist:
                raise serializers.ValidationError(f"Menu item {menu_item_id} does not exists.")
            
            # ------------------------------------------------------------------
            # Validation: Ensure the item actually belongs to the shop selected
            # ------------------------------------------------------------------
            if menu_item.shop != validated_data['shop']:
                raise serializers.ValidationError(f"Item '{menu_item.name}' does not belong to the selected shop.")
            
            # ----------------------------------------------
            # Calculate cost using DB price (Backend Trust)
            # ----------------------------------------------
            item_total = menu_item.price * quantity
            total_price += item_total

            # -------------------------------------
            # Preparing Payload for Bulk Creation
            # -------------------------------------
            order_items_payload.append({
                'menu_item': menu_item,
                'quantity' : quantity,
                'name_at_purchase': menu_item.name,
                'price_at_purchase': menu_item.price
            })
        
        # ---------------------------------------------------
        # Atomic Transaction: Create Order and Items Together
        # ---------------------------------------------------
        with atomic():
            order = Order.objects.create(
                student = student,
                total_price = total_price,
                **validated_data
            )

            for payload in order_items_payload:
                OrderItem.objects.create(
                    order = order,
                    **payload
                )

        return order