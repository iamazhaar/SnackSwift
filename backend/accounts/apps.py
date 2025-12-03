from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    # ------------------------------------------------------------------------
    # Connecting Signals by Importing It (Ensures signals are registered)
    # ------------------------------------------------------------------------
    def ready(self):
        import accounts.signals
