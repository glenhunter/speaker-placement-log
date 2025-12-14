import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useMeasurements } from "@/hooks/useMeasurements";
import { useBaseline } from "@/hooks/useBaseline";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

function App() {
  const navigate = useNavigate();
  const [distanceFromFrontWall, setDistanceFromFrontWall] = useState("");
  const [distanceFromSideWall, setDistanceFromSideWall] = useState("");
  const [listeningPosition, setListeningPosition] = useState("");
  const [bass, setBass] = useState(0);
  const [treble, setTreble] = useState(0);
  const [vocals, setVocals] = useState(0);
  const [soundstage, setSoundstage] = useState(0);

  const {
    measurements,
    saveMeasurement,
    updateMeasurement,
    deleteMeasurement,
    isSaving,
  } = useMeasurements();

  const { baseline } = useBaseline();

  const handleSubmit = (e) => {
    e.preventDefault();

    const measurementData = {
      distanceFromFrontWall,
      distanceFromSideWall,
      listeningPosition,
      bass,
      treble,
      vocals,
      soundstage,
    };

    saveMeasurement(measurementData);

    // Clear the form after submission
    setDistanceFromFrontWall("");
    setDistanceFromSideWall("");
    setListeningPosition("");
    setBass(0);
    setTreble(0);
    setVocals(0);
    setSoundstage(0);

    console.log("Measurement saved:", measurementData);
    console.log("All measurements:", measurements);
  };

  const adjustRating = (currentValue, setter, delta) => {
    const newValue = currentValue + delta;
    if (newValue >= -10 && newValue <= 10) {
      setter(newValue);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 relative">
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            {/* Baseline Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Baseline</h2>
              {baseline ? (
                <Card className="relative">
                  {baseline.methodName && (
                    <div
                      className="absolute top-2 right-2"
                      style={{ fontSize: "10px", color: "#666" }}
                    >
                      {baseline.methodName}
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div
                      className={`grid ${
                        baseline.values?.length === 3
                          ? "grid-cols-3"
                          : "grid-cols-2"
                      } gap-4`}
                    >
                      {baseline.values?.map((item, index) => (
                        <div key={index} className="space-y-1">
                          <p className="text-xs text-gray-600">{item.label}</p>
                          <p className="text-lg font-bold">{item.value}</p>
                          <p className="text-xs text-gray-500">
                            {item.formula}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/speaker-baselines")}
                    >
                      Change Baseline
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Button onClick={() => navigate("/speaker-baselines")}>
                  Create Baseline
                </Button>
              )}
            </div>
            <h2 className="text-3xl font-bold mb-4">Modifications</h2>
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="frontWall" className="distance-label">
                        Front Wall
                      </Label>
                      <Input
                        id="frontWall"
                        type="number"
                        value={distanceFromFrontWall}
                        onChange={(e) =>
                          setDistanceFromFrontWall(e.target.value)
                        }
                        className="distance-input"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="sideWall" className="distance-label">
                        Side Wall
                      </Label>
                      <Input
                        id="sideWall"
                        type="number"
                        value={distanceFromSideWall}
                        onChange={(e) =>
                          setDistanceFromSideWall(e.target.value)
                        }
                        className="distance-input"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="listeningPosition"
                        className="distance-label"
                      >
                        Listening Position
                      </Label>
                      <Input
                        id="listeningPosition"
                        type="number"
                        value={listeningPosition}
                        onChange={(e) => setListeningPosition(e.target.value)}
                        className="distance-input"
                      />
                    </div>
                  </div>
                  <Separator className="bg-gray-700" />
                  <div className="grid grid-cols-3 items-center gap-4">
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => adjustRating(bass, setBass, -1)}
                        disabled={bass <= -10}
                      >
                        Worse
                      </Button>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <h3 className="text-2xl font-semibold">Bass</h3>
                      <span
                        className="text-2xl font-semibold"
                        style={{
                          color: bass > 0 ? "#0f0" : bass < 0 ? "#f00" : "#666",
                        }}
                      >
                        {bass}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => adjustRating(bass, setBass, 1)}
                        disabled={bass >= 10}
                      >
                        Better
                      </Button>
                    </div>
                  </div>
                  <Separator className="bg-gray-300" />
                  <div className="grid grid-cols-3 items-center gap-4">
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => adjustRating(treble, setTreble, -1)}
                        disabled={treble <= -10}
                      >
                        Worse
                      </Button>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <h3 className="text-2xl font-semibold">Treble</h3>
                      <span
                        className="text-2xl font-semibold"
                        style={{
                          color:
                            treble > 0 ? "#0f0" : treble < 0 ? "#f00" : "#666",
                        }}
                      >
                        {treble}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => adjustRating(treble, setTreble, 1)}
                        disabled={treble >= 10}
                      >
                        Better
                      </Button>
                    </div>
                  </div>
                  <Separator className="bg-gray-300" />
                  <div className="grid grid-cols-3 items-center gap-4">
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => adjustRating(vocals, setVocals, -1)}
                        disabled={vocals <= -10}
                      >
                        Worse
                      </Button>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <h3 className="text-2xl font-semibold">Vocals</h3>
                      <span
                        className="text-2xl font-semibold"
                        style={{
                          color:
                            vocals > 0 ? "#0f0" : vocals < 0 ? "#f00" : "#666",
                        }}
                      >
                        {vocals}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => adjustRating(vocals, setVocals, 1)}
                        disabled={vocals >= 10}
                      >
                        Better
                      </Button>
                    </div>
                  </div>
                  <Separator className="bg-gray-300" />
                  <div className="grid grid-cols-3 items-center gap-4">
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          adjustRating(soundstage, setSoundstage, -1)
                        }
                        disabled={soundstage <= -10}
                      >
                        Worse
                      </Button>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <h3 className="text-2xl font-semibold">Soundstage</h3>
                      <span
                        className="text-2xl font-semibold"
                        style={{
                          color:
                            soundstage > 0
                              ? "#0f0"
                              : soundstage < 0
                              ? "#f00"
                              : "#666",
                        }}
                      >
                        {soundstage}
                      </span>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          adjustRating(soundstage, setSoundstage, 1)
                        }
                        disabled={soundstage >= 10}
                      >
                        Better
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Submit"}
                  </Button>
                </form>
              </CardContent>
            </Card>
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
              baseline={baseline}
            />
          </SheetContent>
        </Sheet>
      </div>

      <Footer />
    </div>
  );
}

export default App;
