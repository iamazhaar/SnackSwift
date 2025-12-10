from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import OrderCreateSerializer, OrderReadSerializer
from .models import Order



# --------------------------------------------------------
# Handling the Endpoint for Students to Place a New Order
# --------------------------------------------------------
class CreateOrderView(CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderCreateSerializer
    permission_classes = [IsAuthenticated]



# --------------------------------------------------------
# Shows A Logged-In Student His Own Order History
# --------------------------------------------------------
class StudentOrderListView(ListAPIView):
    serializer_class = OrderReadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only Returning Orders Belonging to This Specific Student
        return Order.objects.filter(student=self.request.user).order_by('-created_at')
    


# -------------------------------------------------------------
# Shows A Logged-In Shop Owner the Orders Placed at Their Shop
# -------------------------------------------------------------
class ShopOwnerOrderListView(ListAPIView):
    serializer_class = OrderReadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Ensure User is a Shop Owner & Return Only Their Shop's Orders
        if (user.role == 'SHOP_OWNER' and user.shop):
            return Order.objects.filter(shop=user.shop).order_by('-created_at')
        return Order.objects.none()