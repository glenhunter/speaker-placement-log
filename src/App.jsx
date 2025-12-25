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
              <h2 className="text-3xl font-bold mb-4 text-deep_space_blue">
                Baseline
              </h2>
              {baseline ? (
                <Card className="relative border-2 border-sky_blue_light-700 shadow-sm">
                  {baseline.methodName && (
                    <div className="absolute top-2 right-2 text-xs text-sky_blue_light-400">
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
                          <p className="text-xs text-sky_blue_light-500">
                            {item.label}
                          </p>
                          <p className="text-lg font-bold text-deep_space_blue">
                            {item.value}
                          </p>
                          <p className="text-xs text-sky_blue_light-400">
                            {item.formula}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 border-t border-sky_blue_light-700">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/speaker-baselines")}
                      className="border-2 border-princeton_orange text-princeton_orange hover:bg-princeton_orange hover:text-white active:bg-princeton_orange-700 font-semibold transition-all"
                    >
                      Change Baseline
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Button
                  onClick={() => navigate("/speaker-baselines")}
                  className="bg-princeton_orange hover:bg-princeton_orange-600 active:bg-princeton_orange-700 text-white transition-all"
                >
                  Create Baseline
                </Button>
              )}
            </div>
            <h2 className="text-3xl font-bold mb-4 text-deep_space_blue">
              Modifications
            </h2>
            <Card className="border-2 border-sky_blue_light-700 shadow-sm">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="frontWall" className="distance-label">
                        Front Wall:
                      </Label>
                      <Input
                        id="frontWall"
                        type="number"
                        value={distanceFromFrontWall}
                        onChange={(e) =>
                          setDistanceFromFrontWall(e.target.value)
                        }
                        className="distance-input"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="sideWall" className="distance-label">
                        Side Wall:
                      </Label>
                      <Input
                        id="sideWall"
                        type="number"
                        value={distanceFromSideWall}
                        onChange={(e) =>
                          setDistanceFromSideWall(e.target.value)
                        }
                        className="distance-input"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="listeningPosition"
                        className="distance-label"
                      >
                        Seat:
                      </Label>
                      <Input
                        id="listeningPosition"
                        type="number"
                        value={listeningPosition}
                        onChange={(e) => setListeningPosition(e.target.value)}
                        className="distance-input"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <Separator className="bg-sky_blue_light-500" />
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => adjustRating(bass, setBass, -1)}
                      disabled={bass <= -10}
                      className="hover:bg-deep_space_blue hover:text-white active:bg-deep_space_blue-600 transition-all"
                    >
                      Worse
                    </Button>
                    <div className="flex-1 flex items-center justify-center gap-4">
                      <h3 className="text-2xl font-semibold text-right min-w-[140px]">
                        Bass:
                      </h3>
                      <span
                        className="text-2xl font-semibold text-left min-w-[140px]"
                        style={{
                          color:
                            bass > 0
                              ? "#669bbc"
                              : bass < 0
                              ? "#c1121f"
                              : "#477fa2",
                        }}
                      >
                        {bass}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => adjustRating(bass, setBass, 1)}
                      disabled={bass >= 10}
                      className="hover:bg-deep_space_blue hover:text-white active:bg-deep_space_blue-600 transition-all"
                    >
                      Better
                    </Button>
                  </div>
                  <Separator className="bg-sky_blue_light-600" />
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => adjustRating(treble, setTreble, -1)}
                      disabled={treble <= -10}
                      className="hover:bg-deep_space_blue hover:text-white active:bg-deep_space_blue-600 transition-all"
                    >
                      Worse
                    </Button>
                    <div className="flex-1 flex items-center justify-center gap-4">
                      <h3 className="text-2xl font-semibold text-right min-w-[140px]">
                        Treble:
                      </h3>
                      <span
                        className="text-2xl font-semibold text-left min-w-[140px]"
                        style={{
                          color:
                            treble > 0
                              ? "#669bbc"
                              : treble < 0
                              ? "#c1121f"
                              : "#477fa2",
                        }}
                      >
                        {treble}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => adjustRating(treble, setTreble, 1)}
                      disabled={treble >= 10}
                      className="hover:bg-deep_space_blue hover:text-white active:bg-deep_space_blue-600 transition-all"
                    >
                      Better
                    </Button>
                  </div>
                  <Separator className="bg-sky_blue_light-600" />
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => adjustRating(vocals, setVocals, -1)}
                      disabled={vocals <= -10}
                      className="hover:bg-deep_space_blue hover:text-white active:bg-deep_space_blue-600 transition-all"
                    >
                      Worse
                    </Button>
                    <div className="flex-1 flex items-center justify-center gap-4">
                      <h3 className="text-2xl font-semibold text-right min-w-[140px]">
                        Vocals:
                      </h3>
                      <span
                        className="text-2xl font-semibold text-left min-w-[140px]"
                        style={{
                          color:
                            vocals > 0
                              ? "#669bbc"
                              : vocals < 0
                              ? "#c1121f"
                              : "#477fa2",
                        }}
                      >
                        {vocals}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => adjustRating(vocals, setVocals, 1)}
                      disabled={vocals >= 10}
                      className="hover:bg-deep_space_blue hover:text-white active:bg-deep_space_blue-600 transition-all"
                    >
                      Better
                    </Button>
                  </div>
                  <Separator className="bg-sky_blue_light-600" />
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        adjustRating(soundstage, setSoundstage, -1)
                      }
                      disabled={soundstage <= -10}
                      className="hover:bg-deep_space_blue hover:text-white active:bg-deep_space_blue-600 transition-all"
                    >
                      Worse
                    </Button>
                    <div className="flex-1 flex items-center justify-center gap-4">
                      <h3 className="text-2xl font-semibold text-right min-w-[140px]">
                        Soundstage:
                      </h3>
                      <span
                        className="text-2xl font-semibold text-left min-w-[140px]"
                        style={{
                          color:
                            soundstage > 0
                              ? "#669bbc"
                              : soundstage < 0
                              ? "#c1121f"
                              : "#477fa2",
                        }}
                      >
                        {soundstage}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => adjustRating(soundstage, setSoundstage, 1)}
                      disabled={soundstage >= 10}
                      className="hover:bg-deep_space_blue hover:text-white active:bg-deep_space_blue-600 transition-all"
                    >
                      Better
                    </Button>
                  </div>
                  <Separator className="bg-sky_blue_light-500" />
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-princeton_orange hover:bg-princeton_orange-600 active:bg-princeton_orange-700 text-white transition-all"
                  >
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
            <button className="fixed right-0 z-40 rounded-l-lg shadow-lg transition-all hover:pr-1 hover:shadow-xl bg-princeton_orange hover:bg-princeton_orange-600 active:bg-princeton_orange-700 p-3 top-24">
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
                className="text-white"
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
