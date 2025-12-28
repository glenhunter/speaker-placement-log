import { useAuth } from "@/contexts/AuthContext";
import { useUnit } from "@/contexts/UnitContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatDistance } from "@/lib/utils";

export function Header({ measurements, baseline }) {
  const { user, signOut } = useAuth();
  const { unit, setUnit } = useUnit();
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

  const exportToMarkdown = () => {
    let markdown = "# Speaker Placement Log\n\n";
    markdown += `Generated on: ${new Date().toLocaleString()}\n\n`;
    markdown += `Units: ${unit === "imperial" ? "Imperial (ft/in)" : "Metric (m/cm)"}\n\n`;
    markdown += `Total Measurements: ${measurements?.length || 0}\n\n`;

    // Add baseline if it exists
    if (baseline?.values) {
      markdown += "## Baseline\n\n";
      if (baseline.methodName) {
        markdown += `**Method:** ${baseline.methodName}\n\n`;
      }

      baseline.values.forEach((item) => {
        // Use formatDistance for values that have rawValueInFeet
        const displayValue = item.rawValueInFeet !== undefined
          ? formatDistance(item.rawValueInFeet, unit)
          : item.value;
        markdown += `- **${item.label}:** ${displayValue}\n`;
      });
      markdown += "\n";
    }

    // Add measurements
    if (measurements && measurements.length > 0) {
      markdown += "## Measurements\n\n";
      measurements.forEach((measurement, index) => {
        // Use name if available, otherwise default to numbered format
        const title = measurement.name
          ? `${measurement.name}${measurement.isFavorite ? " ⭐" : ""}`
          : `Measurement ${index + 1}${measurement.isFavorite ? " ⭐" : ""}`;

        markdown += `### ${title}\n\n`;

        if (measurement.baselineMethodName) {
          markdown += `**Baseline Method:** ${measurement.baselineMethodName}\n\n`;
        }

        if (measurement.distanceFromFrontWall) {
          markdown += `- **Front Wall:** ${formatDistance(measurement.distanceFromFrontWall, unit)}\n`;
        }
        if (measurement.distanceFromSideWall) {
          markdown += `- **Side Wall:** ${formatDistance(measurement.distanceFromSideWall, unit)}\n`;
        }
        if (measurement.listeningPosition) {
          markdown += `- **Listening Position:** ${formatDistance(measurement.listeningPosition, unit)}\n`;
        }
        markdown += `- **Bass:** ${measurement.bass}\n`;
        markdown += `- **Treble:** ${measurement.treble}\n`;
        markdown += `- **Vocals:** ${measurement.vocals}\n`;
        markdown += `- **Soundstage:** ${measurement.soundstage}\n`;
        const total =
          measurement.bass +
          measurement.treble +
          measurement.vocals +
          measurement.soundstage;
        markdown += `- **Total Score:** ${total}\n\n`;
      });
    }

    // Download
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `speaker-placement-log-${
      new Date().toISOString().split("T")[0]
    }.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/reset-password";

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-8 bg-deep_space_blue-500 border-b-4 border-princeton_orange"
      style={{
        height: "60px",
        minHeight: "60px",
        maxHeight: "60px",
      }}
    >
      <h1 className="text-2xl font-bold text-white">Speaker Tweaker</h1>
      {!isAuthPage && (
        <div className="flex items-center gap-8">
          {!user && (
            <Button
              onClick={() => navigate("/login")}
              className="btn-primary py-1 px-3 h-8 text-sm"
            >
              Sign In
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="text-white hover:text-sky_blue_light-700 transition-colors"
                aria-label="Settings menu"
              >
                <Settings className="w-6 h-6" aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Units</DropdownMenuLabel>
              <div className="px-2 py-2">
                <RadioGroup value={unit} onValueChange={setUnit}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="imperial" id="imperial" />
                    <Label htmlFor="imperial" className="cursor-pointer">
                      Imperial
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="metric" id="metric" />
                    <Label htmlFor="metric" className="cursor-pointer">
                      Metric
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {measurements && measurements.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={exportToMarkdown}>
                    Export to Markdown
                  </DropdownMenuItem>
                </>
              )}

              {user && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                    Sign Out
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  );
}
