# ------------------------------------------------------------------------------
# Purpose of Creating This permissions.py is -
# To ensure only the actual owner of a shop can edit its menu
# ------------------------------------------------------------------------------
from rest_framework.permissions import BasePermission



class IsShopOwner(BasePermission):
    '''
    Custom permission to only allow owners of a shop to edit it
    '''
    def has_permission(self, request, view):
        # 1. User must be logged in
        if not request.user.is_authenticated:
            return False
        
        # 2. User must have the 'SHOP_OWNER' role
        if request.user.role != 'SHOP_OWNER':
            return False
        
        # 3. User must actually have a shop assigned
        return bool(request.user.shop)