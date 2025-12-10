from django.urls import path
from .views import CreateOrderView, StudentOrderListView, ShopOwnerOrderListView



urlpatterns = [
    # Student Endpoints
    path('place/', CreateOrderView.as_view(), name='place-order'),
    path('history/', StudentOrderListView.as_view(), name='student-order-history'),

    # Shop Owner Endpoints
    path('manage/', ShopOwnerOrderListView.as_view(), name='shop-order-manage'),
]