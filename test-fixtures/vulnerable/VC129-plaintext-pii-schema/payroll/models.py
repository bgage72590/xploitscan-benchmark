from django.conf import settings
from django.db import models


class Employee(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    legal_name = models.CharField(max_length=200)
    ssn = models.CharField(max_length=11)
    bank_routing_number = models.CharField(max_length=9)
    bank_account_number = models.CharField(max_length=17)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.legal_name
