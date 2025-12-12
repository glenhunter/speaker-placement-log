import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { useMeasurements } from "@/hooks/useMeasurements";
import { Sidebar } from "@/components/Sidebar";

function App() {
  const [distanceFromFrontWall, setDistanceFromFrontWall] = useState("");
  const [distanceFromSideWall, setDistanceFromSideWall] = useState("");
  const [bass, setBass] = useState([0]);
  const [treble, setTreble] = useState([0]);
  const [vocals, setVocals] = useState([0]);
  const [soundstage, setSoundstage] = useState([0]);

  const {
    measurements,
    saveMeasurement,
    updateMeasurement,
    deleteMeasurement,
    isSaving,
  } = useMeasurements();

  const handleSubmit = (e) => {
    e.preventDefault();

    const measurementData = {
      distanceFromFrontWall,
      distanceFromSideWall,
      bass: bass[0],
      treble: treble[0],
      vocals: vocals[0],
      soundstage: soundstage[0],
    };

    saveMeasurement(measurementData);

    // Clear the form after submission
    setDistanceFromFrontWall("");
    setDistanceFromSideWall("");
    setBass([0]);
    setTreble([0]);
    setVocals([0]);
    setSoundstage([0]);

    console.log("Measurement saved:", measurementData);
    console.log("All measurements:", measurements);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header
        className="flex items-center px-8"
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
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 relative">
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="frontWall" className="distance-label">
                  Distance from front wall:
                </Label>
                <Input
                  id="frontWall"
                  type="number"
                  value={distanceFromFrontWall}
                  onChange={(e) => setDistanceFromFrontWall(e.target.value)}
                  className="distance-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sideWall" className="distance-label">
                  Distance from side wall:
                </Label>
                <Input
                  id="sideWall"
                  type="number"
                  value={distanceFromSideWall}
                  onChange={(e) => setDistanceFromSideWall(e.target.value)}
                  className="distance-input"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between w-1/2">
                  <h3 className="text-2xl font-semibold">Bass</h3>
                  <span className="text-lg font-medium">{bass[0]}</span>
                </div>
                <Slider
                  value={bass}
                  onValueChange={setBass}
                  min={0}
                  max={10}
                  step={1}
                  className="w-1/2"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between w-1/2">
                  <h3 className="text-2xl font-semibold">Treble</h3>
                  <span className="text-lg font-medium">{treble[0]}</span>
                </div>
                <Slider
                  value={treble}
                  onValueChange={setTreble}
                  min={0}
                  max={10}
                  step={1}
                  className="w-1/2"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between w-1/2">
                  <h3 className="text-2xl font-semibold">Vocals</h3>
                  <span className="text-lg font-medium">{vocals[0]}</span>
                </div>
                <Slider
                  value={vocals}
                  onValueChange={setVocals}
                  min={0}
                  max={10}
                  step={1}
                  className="w-1/2"
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between w-1/2">
                  <h3 className="text-2xl font-semibold">Soundstage</h3>
                  <span className="text-lg font-medium">{soundstage[0]}</span>
                </div>
                <Slider
                  value={soundstage}
                  onValueChange={setSoundstage}
                  min={0}
                  max={10}
                  step={1}
                  className="w-1/2"
                />
              </div>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Submit"}
              </Button>
            </form>
          </div>
        </main>

        {/* Sheet Trigger Tab */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="fixed right-0 z-40 rounded-l-lg shadow-lg transition-all hover:pr-1 sheet-trigger-tab">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "var(--color-primary-foreground)" }}
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          </SheetTrigger>
          <SheetContent className="w-96 overflow-y-auto" side="right">
            <Sidebar
              measurements={measurements}
              updateMeasurement={updateMeasurement}
              deleteMeasurement={deleteMeasurement}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export default App;
