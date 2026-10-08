import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Order {
  id: string;
  customer_email: string;
  total_cents: number;
  status: "paid" | "refunded";
}

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      setIsAdmin(profile?.role === "admin");

      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      setOrders(data ?? []);
    };
    checkAdmin();
  }, [navigate]);

  const refundOrder = async (orderId: string) => {
    const { error } = await supabase.from("orders").update({ status: "refunded" }).eq("id", orderId);
    if (error) return toast.error(error.message);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: "refunded" } : o)));
  };

  return (
    <div className="container mx-auto py-10">
      {!isAdmin && <p className="text-muted-foreground">You do not have access to this page.</p>}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <span>
                  {order.customer_email} — ${(order.total_cents / 100).toFixed(2)}
                </span>
                <Button size="sm" disabled={order.status === "refunded"} onClick={() => refundOrder(order.id)}>
                  Refund
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Admin;
