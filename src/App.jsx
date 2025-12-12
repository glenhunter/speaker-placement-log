import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMeasurements } from "@/hooks/useMeasurements";
import { Sidebar } from "@/components/Sidebar";

function App() {
  const [distanceFromFrontWall, setDistanceFromFrontWall] = useState("");
  const [distanceFromSideWall, setDistanceFromSideWall] = useState("");
  const [bass, setBass] = useState("");
  const [treble, setTreble] = useState("");
  const [vocals, setVocals] = useState("");
  const [soundstage, setSoundstage] = useState("");

  const { measurements, saveMeasurement, updateMeasurement, deleteMeasurement, isSaving } =
    useMeasurements();

  const handleSubmit = (e) => {
    e.preventDefault();

    const measurementData = {
      distanceFromFrontWall,
      distanceFromSideWall,
      bass,
      treble,
      vocals,
      soundstage,
    };

    saveMeasurement(measurementData);

    // Clear the form after submission
    setDistanceFromFrontWall("");
    setDistanceFromSideWall("");
    setBass("");
    setTreble("");
    setVocals("");
    setSoundstage("");

    console.log("Measurement saved:", measurementData);
    console.log("All measurements:", measurements);
  };

  const RatingButtons = ({ value, onChange, name }) => (
    <div className="flex gap-2 justify-between">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
        <label key={num} className="flex flex-col items-center cursor-pointer">
          <input
            type="radio"
            name={name}
            value={num}
            checked={value === String(num)}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only peer"
          />
          <div
            className="w-10 h-10 flex items-center justify-center rounded-md border-2 transition-colors"
            style={{
              borderColor:
                value === String(num)
                  ? "var(--color-primary)"
                  : "var(--color-input)",
              backgroundColor:
                value === String(num) ? "var(--color-primary)" : "transparent",
              color:
                value === String(num)
                  ? "var(--color-primary-foreground)"
                  : "var(--color-foreground)",
            }}
          >
            {num}
          </div>
        </label>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header
        className="flex items-center px-8"
        style={{
          backgroundColor: '#000',
          height: '80px',
          minHeight: '80px',
          maxHeight: '80px',
        }}
      >
        <h1 className="text-2xl font-bold" style={{ color: '#fff' }}>
          Speaker Placement Log
        </h1>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="frontWall">Distance from front wall:</Label>
              <Input
                id="frontWall"
                type="number"
                value={distanceFromFrontWall}
                onChange={(e) => setDistanceFromFrontWall(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sideWall">Distance from side wall:</Label>
              <Input
                id="sideWall"
                type="number"
                value={distanceFromSideWall}
                onChange={(e) => setDistanceFromSideWall(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">Bass</h2>
              <RatingButtons value={bass} onChange={setBass} name="bass" />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">Treble</h2>
              <RatingButtons
                value={treble}
                onChange={setTreble}
                name="treble"
              />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">Vocals</h2>
              <RatingButtons
                value={vocals}
                onChange={setVocals}
                name="vocals"
              />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">Soundstage</h2>
              <RatingButtons
                value={soundstage}
                onChange={setSoundstage}
                name="soundstage"
              />
            </div>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Submit"}
            </Button>
          </form>
        </div>
      </main>

      <Sidebar
        measurements={measurements}
        updateMeasurement={updateMeasurement}
        deleteMeasurement={deleteMeasurement}
      />
      </div>
    </div>
  );
}

export default App;
