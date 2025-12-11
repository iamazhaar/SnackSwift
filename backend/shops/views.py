from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView
from .models import Shop, MenuItem
from .serializers import ShopSerializer, MenuItemSerializer
from .permissions import IsShopOwner



# ------------------------------------------
# Shows the Detail of all Registered Shops
# ------------------------------------------
class ShopListView(ListAPIView):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer



# ----------------------------------------
# Shows the Detail of a Perticular Shop
# ----------------------------------------
class ShopDetailView(RetrieveAPIView):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    lookup_field = 'id'



# ----------------------------------------------------
# Shows the Menu Items Belonging to a Perticular Shop
# ----------------------------------------------------
class ShopMenuListView(ListAPIView):
    serializer_class = MenuItemSerializer

    def get_queryset(self):
        return MenuItem.objects.filter(shop_id=self.kwargs['id'])
    


# ----------------------------------------
# Owner: Add a NEW Item to their Menu
# ----------------------------------------
class ManageMenuCreateView(CreateAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [IsShopOwner]

    def perform_create(self, serializer):
        # Automatically assign the new item to the logged-in owner's shop
        serializer.save(shop=self.request.user.shop)



# ----------------------------------------
# Owner: Edit or Delete an Existing Item
# ----------------------------------------
class ManageMenuDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [IsShopOwner]

    def get_queryset(self):
        # An owner can only edit items belonging to THEIR shop
        return MenuItem.objects.filter(shop=self.request.user.shop)