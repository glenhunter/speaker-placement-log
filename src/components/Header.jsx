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
      className="flex items-center justify-between px-8 bg-deep_space_blue-500 border-b-4 border-amber_flame-500"
      style={{
        height: "80px",
        minHeight: "80px",
        maxHeight: "80px",
      }}
    >
      <h1 className="text-2xl font-bold text-white">
        Speaker Placement Log
      </h1>
      {!isAuthPage && (
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-sky_blue_light-700">{user.email}</span>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="bg-amber_flame hover:bg-amber_flame-600 text-deep_space_blue border-amber_flame-600 font-semibold"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              size="sm"
              className="bg-amber_flame hover:bg-amber_flame-600 text-deep_space_blue border-amber_flame-600 font-semibold"
            >
              Login
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
