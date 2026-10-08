from django.conf import settings
from django.db import models
from encrypted_model_fields.fields import EncryptedCharField


class Employee(models.Model):
    """Direct deposit goes through Stripe Connect; no bank numbers are stored."""

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    legal_name = models.CharField(max_length=200)
    ssn = EncryptedCharField(max_length=11)
    ssn_last4 = models.CharField(max_length=4)
    stripe_account_id = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.legal_name
