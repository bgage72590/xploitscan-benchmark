import csv
from tempfile import mktemp

from .models import Order


def export_orders_csv(account_id: int) -> str:
    """Write all orders for an account to a CSV and return the file path."""
    orders = Order.query.filter_by(account_id=account_id).order_by(Order.created_at).all()

    path = mktemp(prefix="orders-", suffix=".csv")
    with open(path, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["id", "created_at", "customer_email", "total"])
        for order in orders:
            writer.writerow([order.id, order.created_at.isoformat(), order.customer_email, order.total])

    return path
