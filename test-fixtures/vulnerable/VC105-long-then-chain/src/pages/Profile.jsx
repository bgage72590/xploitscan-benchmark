import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        return fetch(`/api/orders?userId=${data.id}`);
      })
      .then((res) => res.json())
      .then((data) => setOrders(data.orders))
      .catch((err) => setError(err.message));
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
