import { Routes, Route } from "react-router-dom";
import { useAuth } from "./Context";
import Home from "./pages/Home";
import SuperAdmin from "./pages/SuperAdmin";

export default function App() {
  const { auth } = useAuth();
  return (
    <Routes>
      <Route path="/*" element={<Home />} />
      {auth?.user_metadata?.role === "superadmin" ? (
        <Route path="/super" element={<SuperAdmin />} />
      ) : null}
      {/* A string-unaware comment masker read the catch-all path above as
          the start of a block comment ending here, and the check vanished. */}
    </Routes>
  );
}
