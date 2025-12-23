import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/reset-password";

  return (
    <header
      className="flex items-center justify-between px-8"
      style={{
        backgroundColor: "#000",
        height: "80px",
        minHeight: "80px",
        maxHeight: "80px",
      }}
    >
      <h1 className="text-2xl font-bold" style={{ color: "#fff" }}>
        Speaker Placement Log
      </h1>
      {!isAuthPage && (
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-300">{user.email}</span>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="bg-gray-700 border-gray-600 text-black hover:bg-gray-600"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              size="sm"
              className="bg-gray-700 border-gray-600 text-black hover:bg-gray-600"
            >
              Login
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
