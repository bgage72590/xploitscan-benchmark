import csv
import os
from tempfile import mkstemp

from .models import Order


def export_orders_csv(account_id: int) -> str:
    """Write all orders for an account to a CSV and return the file path."""
    orders = Order.query.filter_by(account_id=account_id).order_by(Order.created_at).all()

    # mkstemp() creates and opens the file atomically (O_EXCL, mode 0600).
    fd, path = mkstemp(prefix="orders-", suffix=".csv")
    with os.fdopen(fd, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["id", "created_at", "customer_email", "total"])
        for order in orders:
            writer.writerow([order.id, order.created_at.isoformat(), order.customer_email, order.total])

    return path
