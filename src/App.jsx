import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lightbulb, X } from "lucide-react";
import { HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
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
  const [showHelpCard, setShowHelpCard] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedBefore");
    if (!hasVisited) {
      setShowHelpCard(true);
      localStorage.setItem("hasVisitedBefore", "true");
    }
  }, []);

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
      <Header onHelpClick={() => setShowHelpCard(true)} />

      {/* Main Content Area */}
      <div className="flex flex-1 relative">
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            {/* Help Card */}
            {showHelpCard && (
              <Card className="mb-6" style={{ backgroundColor: "#e5e7eb" }}>
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">What is this?</h3>
                  </div>
                  <button
                    onClick={() => setShowHelpCard(false)}
                    className="hover:bg-gray-300 rounded p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <CardContent className="pt-0 pb-4">
                  <p className="leading-7 [&:not(:first-child)]:mt-6">
                    Welcome. This started as an experiment working with Claude
                    Code to build a simple React app and kinda ballooned from
                    there.
                  </p>

                  <p className="leading-7 [&:not(:first-child)]:mt-6 font-semibold">
                    TL/DR if you want your values to persist create a user.
                    Create a baseline first, then tweak. Record your tweaks and
                    star the best one.
                  </p>

                  <p className="leading-7 [&:not(:first-child)]:mt-6">
                    Start by creating a baseline. This is the default position
                    for your speakers that you will be measuring from. On the
                    Create Baseline page there are several standard placement
                    methods to choose from and you can see the differing
                    measurements in each tab. Note that you can only have one
                    active baseline at a time.
                  </p>

                  <p className="leading-7 [&:not(:first-child)]:mt-6">
                    These layout methods are all fine and well but unless you're
                    one of the fortunate few who have a dedicated listening room
                    it's likely that you'll have to adjust the positioning to
                    account for furniture, room acoustics, spousal approval, and
                    personal sonic preferences.
                  </p>

                  <p className="leading-7 [&:not(:first-child)]:mt-6">
                    That's where the subjective adjustments come into play. Once
                    you have your speakers in the baseline position give a
                    listen to a song or two to create a mental baseline of the
                    sound. A couple of notes here: first it's hard to remember
                    subjective impressions of a full song for long so listening
                    sessions should be continuous, second even a tiny change in
                    volume can result in a different perception of the sound, so
                    keep your hands off the volume control. Sometimes I just
                    listen to specific parts of a song because (I feel) like
                    it's easier to hold that in my memory than a whole song.
                    This also can allow you to focus on certain elements of the
                    sonic presentation. To that end many pages about speaker
                    placement reccomend starting with a song with a strong
                    continuous bass line and strong centered vocals because it
                    is thought that if you can get the bass right the rest will
                    fall into place.
                  </p>

                  <p className="leading-7 [&:not(:first-child)]:mt-6">
                    So once you have a good sense of the sound of default
                    position you can start tweaking the speaker position -
                    hopefully your speakers aren't too heavy. I strongly suggest
                    that you only change one value at a time, i.e. move the
                    speakers forwards/backwards or left/right but not both. You
                    can either enter the difference from baseline in the
                    front/side/listening position fields or use the full (new)
                    measurement from the walls. Currently only Imperial units
                    are supported (mostly because I lost my metric measuring
                    tape) but Metric is coming soon.
                  </p>

                  <p className="leading-7 [&:not(:first-child)]:mt-6">
                    Use the subjective measurement buttons to record your
                    impressions of the sound. The buttons move in increments of
                    "+/- 1" and the values are totaled for a completely
                    meaningless subjective score. In theory a positive total
                    means that the new position is "better" than the baseline
                    and a negative total is "worse". Wouldn't it be nice if it
                    were that easy? But we know that moving the speaker might
                    make the bass better but the vocals worse, etc etc. So the
                    numbers are there to help, but this is a subjective
                    measurement tool so you're best off trusting your ears.
                  </p>

                  <p className="leading-7 [&:not(:first-child)]:mt-6">
                    When you submit the changes they'll appear in the sidebar
                    and when you find a position you like you can "Star" it and
                    it will appear at the top of the list. You can star as many
                    as you like. Tip: just for fun try all the different
                    positioning methods and star the best variation of each. Now
                    you can compare them all and see which you like best.
                  </p>

                  <p className="leading-7 [&:not(:first-child)]:mt-6">
                    What about DSP you ask? I've heard great things about DSP
                    and I'm looking forward to trying it out when I can afford
                    to buy a MiniDSP unit. For now I'm moving my speakers around
                    and having fun listening to my music. I hope if you use this
                    tool you find it helpful.
                  </p>

                  <p className="leading-7 [&:not(:first-child)]:mt-6">
                    Why login? If you want to save your data so that it's
                    available later you have to create a user. If you don't,
                    that's ok, everything will work but when you close the
                    browser tab your data will be gone forever.
                  </p>

                  <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                    Coming soon
                  </h2>

                  <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                    <li>Metric units</li>
                    <li>More deatils for the modifications</li>
                  </ul>
                </CardContent>
              </Card>
            )}

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
                      <CardTitle className="text-3xl text-deep_space_blue">Baseline</CardTitle>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="text-sky_blue_light-500 hover:text-sky_blue_light-700 transition-colors">
                            <HelpCircle className="w-5 h-5" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <p className="text-sm">Hello World</p>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
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
                  <CardFooter className="p-4 border-t border-princeton_orange">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/speaker-baselines")}
                      className="btn-outline font-semibold"
                    >
                      Change Baseline
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Button
                  onClick={() => navigate("/speaker-baselines")}
                  className="btn-primary"
                >
                  Create Baseline
                </Button>
              )}
            </div>
            <Card className="border-2 border-sky_blue_light-700 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-3xl text-deep_space_blue">Modifications</CardTitle>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="text-sky_blue_light-500 hover:text-sky_blue_light-700 transition-colors">
                        <HelpCircle className="w-5 h-5" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <p className="text-sm">Hello World</p>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-6 pb-6">
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
                      className="btn-outline"
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
                      className="btn-outline"
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
                      className="btn-outline"
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
                      className="btn-outline"
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
                      className="btn-outline"
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
                      className="btn-outline"
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
                      className="btn-outline"
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
                      className="btn-outline"
                    >
                      Better
                    </Button>
                  </div>
                  <Separator className="bg-sky_blue_light-500" />
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary"
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
            <button className="btn-primary fixed right-0 z-40 rounded-l-lg shadow-lg transition-all hover:pr-1 hover:shadow-xl p-3 top-24">
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
