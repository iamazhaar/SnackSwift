from rest_framework.generics import ListAPIView, RetrieveAPIView
from .models import Shop, MenuItem
from .serializers import ShopSerializer, MenuItemSerializer


    
class ShopListView(ListAPIView):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer



class ShopDetailView(RetrieveAPIView):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    lookup_field = 'id'



class ShopMenuListView(ListAPIView):
    serializer_class = MenuItemSerializer

    def get_queryset(self):
        return MenuItem.objects.filter(shop_id=self.kwargs['id'])