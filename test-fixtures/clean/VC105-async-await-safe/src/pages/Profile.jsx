import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

export default function Profile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getJson(`/api/users/${userId}`);
        if (cancelled) return;
        setUser(data);
        const { orders } = await getJson(`/api/orders?userId=${data.id}`);
        if (!cancelled) setOrders(orders);
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!user) return <p>Loading…</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{user.name}</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            #{order.number} — ${(order.totalCents / 100).toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}
