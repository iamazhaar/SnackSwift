from django.urls import path
from .views import ShopListView, ShopDetailView, ShopMenuListView, ManageMenuCreateView, ManageMenuDetailView


urlpatterns = [
    # Public / Student URLs
    path('', ShopListView.as_view(), name='shop-list'),
    path('<int:id>/', ShopDetailView.as_view(), name='shop-detail'),
    path('<int:id>/menu/', ShopMenuListView.as_view(), name='shop-menu'),

    # Shop Owner Management URLs
    path('manage/menu/add/', ManageMenuCreateView.as_view(), name='manage-menu-add'),
    path('manage/menu/<int:pk>/', ManageMenuDetailView.as_view(), name='manage-menu-edit'),
]