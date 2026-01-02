import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  SidebarProvider,
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { useMeasurements } from "@/hooks/useMeasurements";
import { useBaseline } from "@/hooks/useBaseline";
import { useUnit } from "@/contexts/UnitContext";
import { formatDistance, convertToFeet } from "@/lib/utils";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

function SidebarToggleButton() {
  const { open, isMobile } = useSidebar();

  return (
    <div
      className="fixed top-16 right-0 z-[60] transition-transform duration-200"
      style={{
        transform: !isMobile && open ? "translateX(-400px)" : "translateX(0)",
      }}
    >
      <SidebarTrigger className="btn-primary rounded-l-lg shadow-lg p-3 rounded-r-none" />
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  // Split state for major/minor units (feet/metres and inches/cm)
  const [frontWallMajor, setFrontWallMajor] = useState("");
  const [frontWallMinor, setFrontWallMinor] = useState("");
  const [sideWallMajor, setSideWallMajor] = useState("");
  const [sideWallMinor, setSideWallMinor] = useState("");
  const [listeningPositionMajor, setListeningPositionMajor] = useState("");
  const [listeningPositionMinor, setListeningPositionMinor] = useState("");
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

  const { baseline, previousBaselines, deleteBaseline, saveBaseline, updateBaseline } = useBaseline();
  const { unit } = useUnit();

  // Format rating with +/- prefix for accessibility (colorblind users)
  const formatRating = (value) => {
    if (value > 0) return `+${value}`;
    return String(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const measurementData = {
      distanceFromFrontWall: convertToFeet(frontWallMajor, frontWallMinor, unit),
      distanceFromSideWall: convertToFeet(sideWallMajor, sideWallMinor, unit),
      listeningPosition: convertToFeet(
        listeningPositionMajor,
        listeningPositionMinor,
        unit
      ),
      bass,
      treble,
      vocals,
      soundstage,
      baselineMethodName: baseline?.methodName || null,
    };

    saveMeasurement(measurementData);

    // Clear the form after submission
    setFrontWallMajor("");
    setFrontWallMinor("");
    setSideWallMajor("");
    setSideWallMinor("");
    setListeningPositionMajor("");
    setListeningPositionMinor("");
    setBass(0);
    setTreble(0);
    setVocals(0);
    setSoundstage(0);
  };

  const adjustRating = (currentValue, setter, delta) => {
    const newValue = currentValue + delta;
    if (newValue >= -10 && newValue <= 10) {
      setter(newValue);
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex flex-col min-h-screen w-full">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-deep_space_blue focus:text-white focus:rounded"
        >
          Skip to main content
        </a>

        {/* Header spans full width above everything */}
        <Header measurements={measurements} baseline={baseline} />

        {/* Content and Sidebar container */}
        <div className="flex flex-1">
          {/* Main content area */}
          <SidebarInset className="flex-1 flex flex-col">
            <main
              id="main-content"
              className="flex-1 p-8"
              aria-label="Speaker placement modifications"
            >
              <div className="max-w-2xl mx-auto">
                {/* Baseline Section */}
                <div className="mb-8">
                  {baseline ? (
                    <Card className="relative border-2 border-princeton_orange shadow-sm">
                      {baseline.methodName && (
                        <div className="absolute top-0 right-0 text-xs text-white bg-sky_blue_light-700 px-3 py-1.5 rounded-bl-lg">
                          {baseline.methodName}
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-3xl text-deep_space_blue">
                            Baseline
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div
                          className={`grid grid-cols-1 ${
                            baseline.values?.length === 3
                              ? "md:grid-cols-3"
                              : "md:grid-cols-2"
                          } gap-4`}
                        >
                          {baseline.values?.map((item, index) => {
                            // Convert rawValueInFeet to the selected unit and format
                            let displayValue = item.value; // Fallback to original value
                            if (item.rawValueInFeet !== undefined) {
                              // formatDistance expects feet and converts internally based on unit
                              displayValue = formatDistance(
                                item.rawValueInFeet,
                                unit
                              );
                            }

                            return (
                              <div key={index} className="space-y-1">
                                <p className="text-xs text-sky_blue_light-500">
                                  {item.label}
                                </p>
                                <p className="text-lg font-bold text-deep_space_blue">
                                  {displayValue}
                                </p>
                                <p className="text-xs text-sky_blue_light-400">
                                  {item.formula}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 border-t border-princeton_orange">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate("/speaker-baselines")}
                          className="btn-outline font-semibold w-full md:w-auto"
                        >
                          Change Baseline
                        </Button>
                      </CardFooter>
                    </Card>
                  ) : (
                    <Card className="relative border-2 border-princeton_orange shadow-sm">
                      <CardContent className="flex items-center justify-center min-h-[100px]">
                        <Button
                          onClick={() => navigate("/speaker-baselines")}
                          className="btn-primary w-full md:w-auto"
                        >
                          Create Baseline
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
                <Card className="border-2 border-sky_blue_light-700 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-deep_space_blue">
                        Modifications
                      </CardTitle>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className="text-sky_blue_light-500 hover:text-sky_blue_light-700 transition-colors"
                            aria-label="Modifications help information"
                          >
                            <HelpCircle
                              className="w-5 h-5"
                              aria-hidden="true"
                            />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <p className="text-sm">
                            Use the subjective measurement buttons to record
                            your impressions of the sound. The buttons move in
                            increments of "+/- 1"
                          </p>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 px-6 pb-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Front Wall */}
                        <fieldset className="flex flex-col gap-2">
                          <legend className="distance-label text-sm font-medium">
                            Front Wall:
                          </legend>
                          <div className="flex gap-1 items-center">
                            <Input
                              id="frontWallMajor"
                              type="number"
                              value={frontWallMajor}
                              onChange={(e) =>
                                setFrontWallMajor(e.target.value)
                              }
                              className="w-16"
                              min="0"
                              aria-label={`Front wall ${
                                unit === "imperial" ? "feet" : "metres"
                              }`}
                            />
                            <span
                              className="text-sm text-sky_blue_light-500"
                              aria-hidden="true"
                            >
                              {unit === "imperial" ? "ft" : "m"}
                            </span>
                            <Input
                              id="frontWallMinor"
                              type="number"
                              value={frontWallMinor}
                              onChange={(e) =>
                                setFrontWallMinor(e.target.value)
                              }
                              className="w-16"
                              min="0"
                              aria-label={`Front wall ${
                                unit === "imperial" ? "inches" : "centimetres"
                              }`}
                            />
                            <span
                              className="text-sm text-sky_blue_light-500"
                              aria-hidden="true"
                            >
                              {unit === "imperial" ? "in" : "cm"}
                            </span>
                          </div>
                        </fieldset>
                        {/* Side Wall */}
                        <fieldset className="flex flex-col gap-2">
                          <legend className="distance-label text-sm font-medium">
                            Side Wall:
                          </legend>
                          <div className="flex gap-1 items-center">
                            <Input
                              id="sideWallMajor"
                              type="number"
                              value={sideWallMajor}
                              onChange={(e) => setSideWallMajor(e.target.value)}
                              className="w-16"
                              min="0"
                              aria-label={`Side wall ${
                                unit === "imperial" ? "feet" : "metres"
                              }`}
                            />
                            <span
                              className="text-sm text-sky_blue_light-500"
                              aria-hidden="true"
                            >
                              {unit === "imperial" ? "ft" : "m"}
                            </span>
                            <Input
                              id="sideWallMinor"
                              type="number"
                              value={sideWallMinor}
                              onChange={(e) => setSideWallMinor(e.target.value)}
                              className="w-16"
                              min="0"
                              aria-label={`Side wall ${
                                unit === "imperial" ? "inches" : "centimetres"
                              }`}
                            />
                            <span
                              className="text-sm text-sky_blue_light-500"
                              aria-hidden="true"
                            >
                              {unit === "imperial" ? "in" : "cm"}
                            </span>
                          </div>
                        </fieldset>
                        {/* Listening Position (Seat) */}
                        <fieldset className="flex flex-col gap-2">
                          <legend className="distance-label text-sm font-medium">
                            Seat:
                          </legend>
                          <div className="flex gap-1 items-center">
                            <Input
                              id="listeningPositionMajor"
                              type="number"
                              value={listeningPositionMajor}
                              onChange={(e) =>
                                setListeningPositionMajor(e.target.value)
                              }
                              className="w-16"
                              min="0"
                              aria-label={`Seat distance ${
                                unit === "imperial" ? "feet" : "metres"
                              }`}
                            />
                            <span
                              className="text-sm text-sky_blue_light-500"
                              aria-hidden="true"
                            >
                              {unit === "imperial" ? "ft" : "m"}
                            </span>
                            <Input
                              id="listeningPositionMinor"
                              type="number"
                              value={listeningPositionMinor}
                              onChange={(e) =>
                                setListeningPositionMinor(e.target.value)
                              }
                              className="w-16"
                              min="0"
                              aria-label={`Seat distance ${
                                unit === "imperial" ? "inches" : "centimetres"
                              }`}
                            />
                            <span
                              className="text-sm text-sky_blue_light-500"
                              aria-hidden="true"
                            >
                              {unit === "imperial" ? "in" : "cm"}
                            </span>
                          </div>
                        </fieldset>
                      </div>
                      <Separator className="bg-sky_blue_light-500" />
                      <div
                        className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4"
                        role="group"
                        aria-labelledby="bass-label"
                      >
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => adjustRating(bass, setBass, -1)}
                          disabled={bass <= -10}
                          className="btn-outline order-2 md:order-1"
                          aria-label="Decrease bass rating"
                        >
                          Worse
                        </Button>
                        <div className="w-full md:w-auto md:flex-1 order-1 md:order-2 flex items-center justify-center gap-4">
                          <h3
                            id="bass-label"
                            className="text-2xl font-semibold text-right min-w-[80px] md:min-w-[140px]"
                          >
                            Bass:
                          </h3>
                          <span
                            className="text-2xl font-semibold text-left min-w-[40px] md:min-w-[140px]"
                            style={{
                              color:
                                bass > 0
                                  ? "var(--color-rating-positive)"
                                  : bass < 0
                                  ? "var(--color-rating-negative)"
                                  : "var(--color-rating-neutral)",
                            }}
                            aria-live="polite"
                            aria-atomic="true"
                          >
                            {formatRating(bass)}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => adjustRating(bass, setBass, 1)}
                          disabled={bass >= 10}
                          className="btn-outline order-2 md:order-3"
                          aria-label="Increase bass rating"
                        >
                          Better
                        </Button>
                      </div>
                      <Separator className="bg-sky_blue_light-600" />
                      <div
                        className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4"
                        role="group"
                        aria-labelledby="treble-label"
                      >
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => adjustRating(treble, setTreble, -1)}
                          disabled={treble <= -10}
                          className="btn-outline order-2 md:order-1"
                          aria-label="Decrease treble rating"
                        >
                          Worse
                        </Button>
                        <div className="w-full md:w-auto md:flex-1 order-1 md:order-2 flex items-center justify-center gap-4">
                          <h3
                            id="treble-label"
                            className="text-2xl font-semibold text-right min-w-[80px] md:min-w-[140px]"
                          >
                            Treble:
                          </h3>
                          <span
                            className="text-2xl font-semibold text-left min-w-[40px] md:min-w-[140px]"
                            style={{
                              color:
                                treble > 0
                                  ? "var(--color-rating-positive)"
                                  : treble < 0
                                  ? "var(--color-rating-negative)"
                                  : "var(--color-rating-neutral)",
                            }}
                            aria-live="polite"
                            aria-atomic="true"
                          >
                            {formatRating(treble)}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => adjustRating(treble, setTreble, 1)}
                          disabled={treble >= 10}
                          className="btn-outline order-2 md:order-3"
                          aria-label="Increase treble rating"
                        >
                          Better
                        </Button>
                      </div>
                      <Separator className="bg-sky_blue_light-600" />
                      <div
                        className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4"
                        role="group"
                        aria-labelledby="vocals-label"
                      >
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => adjustRating(vocals, setVocals, -1)}
                          disabled={vocals <= -10}
                          className="btn-outline order-2 md:order-1"
                          aria-label="Decrease vocals rating"
                        >
                          Worse
                        </Button>
                        <div className="w-full md:w-auto md:flex-1 order-1 md:order-2 flex items-center justify-center gap-4">
                          <h3
                            id="vocals-label"
                            className="text-2xl font-semibold text-right min-w-[80px] md:min-w-[140px]"
                          >
                            Vocals:
                          </h3>
                          <span
                            className="text-2xl font-semibold text-left min-w-[40px] md:min-w-[140px]"
                            style={{
                              color:
                                vocals > 0
                                  ? "var(--color-rating-positive)"
                                  : vocals < 0
                                  ? "var(--color-rating-negative)"
                                  : "var(--color-rating-neutral)",
                            }}
                            aria-live="polite"
                            aria-atomic="true"
                          >
                            {formatRating(vocals)}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => adjustRating(vocals, setVocals, 1)}
                          disabled={vocals >= 10}
                          className="btn-outline order-2 md:order-3"
                          aria-label="Increase vocals rating"
                        >
                          Better
                        </Button>
                      </div>
                      <Separator className="bg-sky_blue_light-600" />
                      <div
                        className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4"
                        role="group"
                        aria-labelledby="soundstage-label"
                      >
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            adjustRating(soundstage, setSoundstage, -1)
                          }
                          disabled={soundstage <= -10}
                          className="btn-outline order-2 md:order-1"
                          aria-label="Decrease soundstage rating"
                        >
                          Worse
                        </Button>
                        <div className="w-full md:w-auto md:flex-1 order-1 md:order-2 flex items-center justify-center gap-4">
                          <h3
                            id="soundstage-label"
                            className="text-2xl font-semibold text-right min-w-[80px] md:min-w-[140px]"
                          >
                            Soundstage:
                          </h3>
                          <span
                            className="text-2xl font-semibold text-left min-w-[40px] md:min-w-[140px]"
                            style={{
                              color:
                                soundstage > 0
                                  ? "var(--color-rating-positive)"
                                  : soundstage < 0
                                  ? "var(--color-rating-negative)"
                                  : "var(--color-rating-neutral)",
                            }}
                            aria-live="polite"
                            aria-atomic="true"
                          >
                            {formatRating(soundstage)}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            adjustRating(soundstage, setSoundstage, 1)
                          }
                          disabled={soundstage >= 10}
                          className="btn-outline order-2 md:order-3"
                          aria-label="Increase soundstage rating"
                        >
                          Better
                        </Button>
                      </div>
                      <Separator className="bg-sky_blue_light-500" />
                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="btn-primary w-full md:w-auto"
                      >
                        {isSaving ? "Saving..." : "Submit"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </main>
          </SidebarInset>

          {/* Toggle button - positioned on left edge of sidebar */}
          <SidebarToggleButton />

          {/* Sidebar on right */}
          <SidebarContainer
            side="right"
            collapsible="icon"
            className="border-l"
            style={{ maxWidth: "400px" }}
          >
            <SidebarHeader className="border-b p-4">
              <h2 className="text-xl font-bold text-deep_space_blue">
                Modifications
              </h2>
            </SidebarHeader>
            <SidebarContent className="p-4">
              <Sidebar
                measurements={measurements}
                updateMeasurement={updateMeasurement}
                deleteMeasurement={deleteMeasurement}
                baseline={baseline}
                previousBaselines={previousBaselines}
                deleteBaseline={deleteBaseline}
                saveBaseline={saveBaseline}
                updateBaseline={updateBaseline}
              />
            </SidebarContent>
          </SidebarContainer>
        </div>

        {/* Footer spans full width below everything */}
        <Footer />
      </div>
    </SidebarProvider>
  );
}

export default App;
