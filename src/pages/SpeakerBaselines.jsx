import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useBaseline } from "@/hooks/useBaseline";
import { feetToFraction, parseNumericInput } from "@/lib/utils";

export function SpeakerBaselines() {
  const navigate = useNavigate();
  const { saveBaseline } = useBaseline();
  const [roomLength, setRoomLength] = useState("");
  const [roomWidth, setRoomWidth] = useState("");
  const [roomHeight, setRoomHeight] = useState("");
  const [sidewallDistance, setSidewallDistance] = useState("");
  const [speakerType, setSpeakerType] = useState("conventional");

  const handleUseAsBaseline = (calculationType = "cardas-golden-ratio") => {
    const methodNames = {
      "cardas-golden-ratio": "Cardas Golden Ratio",
      "planar-edge": "Planar Edge Method",
      "rule-of-thirds": "Rule of 1/3's",
      "equilateral-triangle": "Nearfield Listening",
    };

    const baselineData = {
      calculationType,
      methodName: methodNames[calculationType],
      speakerType,
      values: [],
    };

    const parsedWidth = parseNumericInput(roomWidth);
    const parsedHeight = parseNumericInput(roomHeight);
    const parsedLength = parseNumericInput(roomLength);
    const parsedSidewall = parseNumericInput(sidewallDistance);

    if (calculationType === "cardas-golden-ratio") {
      if (speakerType === "conventional" && parsedWidth !== null) {
        const sideWallDistance = feetToFraction(parsedWidth * 0.276);
        const frontWallDistance = feetToFraction(parsedWidth * 0.447);

        baselineData.values = [
          {
            label: "Front Wall",
            value: frontWallDistance,
            formula: `Room Width × 0.447 (${roomWidth} × 0.447)`,
          },
          {
            label: "Side Wall",
            value: sideWallDistance,
            formula: `Room Width × 0.276 (${roomWidth} × 0.276)`,
          },
        ];
      } else if (speakerType === "planar" && parsedHeight !== null) {
        const frontWallDistance = feetToFraction(parsedHeight * 0.618);

        baselineData.values = [
          {
            label: "Front Wall",
            value: frontWallDistance,
            formula: `Ceiling Height × 0.618 (${roomHeight} × 0.618)`,
          },
        ];
      }
    } else if (calculationType === "planar-edge" && parsedLength !== null) {
      const frontWallDistance = feetToFraction(parsedLength * 0.4);
      const listeningPosition = feetToFraction(parsedLength * 0.8);

      baselineData.values = [
        {
          label: "Front Wall",
          value: frontWallDistance,
          formula: `Room Length × 0.4 (${roomLength} × 0.4)`,
        },
        {
          label: "Side Wall",
          value: '6"',
          formula: "Fixed value",
        },
        {
          label: "Listening Position",
          value: listeningPosition,
          formula: `Room Length × 0.8 (${roomLength} × 0.8)`,
        },
      ];
    } else if (calculationType === "rule-of-thirds" && parsedLength !== null) {
      const frontWallDistance = feetToFraction(parsedLength * 0.3333);
      const listeningPosition = feetToFraction(parsedLength * 0.66);

      baselineData.values = [
        {
          label: "Front Wall",
          value: frontWallDistance,
          formula: `Room Length × 33.33% (${roomLength} × 0.3333)`,
        },
        {
          label: "Listening Position",
          value: listeningPosition,
          formula: `Room Length × 66% (${roomLength} × 0.66)`,
        },
      ];
    } else if (
      calculationType === "equilateral-triangle" &&
      parsedWidth !== null &&
      parsedSidewall !== null
    ) {
      const speakerSeparation = parsedWidth - parsedSidewall * 2;
      const listeningPosition = feetToFraction(
        (speakerSeparation * Math.sqrt(3)) / 2
      );

      baselineData.values = [
        {
          label: "Side Wall",
          value: feetToFraction(parsedSidewall),
          formula: `Input value (${sidewallDistance})`,
        },
        {
          label: "Listening Position",
          value: listeningPosition,
          formula: `(Speaker Separation × √3) / 2`,
        },
      ];
    }

    saveBaseline(baselineData);
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-deep_space_blue">Speaker Baselines</h2>
          <p className="mb-6 text-blue_green-300">
            Distances should be measured from the front center of the speaker.
          </p>
          {/* Room Dimensions Form */}
          <Card className="mb-8 border-2 border-sky_blue_light-700 shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-deep_space_blue">Room Dimensions</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="roomLength">Length</Label>
                    <Input
                      id="roomLength"
                      type="number"
                      value={roomLength}
                      onChange={(e) => setRoomLength(e.target.value)}
                      placeholder="ft"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="roomWidth">Width</Label>
                    <Input
                      id="roomWidth"
                      type="number"
                      value={roomWidth}
                      onChange={(e) => setRoomWidth(e.target.value)}
                      placeholder="ft"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="roomHeight">Height</Label>
                    <Input
                      id="roomHeight"
                      type="number"
                      value={roomHeight}
                      onChange={(e) => setRoomHeight(e.target.value)}
                      placeholder="ft"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              {/* Speaker Type */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-deep_space_blue">Speaker Type</h3>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="speakerType"
                      value="conventional"
                      checked={speakerType === "conventional"}
                      onChange={(e) => setSpeakerType(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span>Conventional</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="speakerType"
                      value="planar"
                      checked={speakerType === "planar"}
                      onChange={(e) => setSpeakerType(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span>Planar/Open Baffle</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Tabs defaultValue="tab1" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="tab1">Cardas Golden Ratio</TabsTrigger>
              <TabsTrigger value="tab2">Planar Edge Method</TabsTrigger>
              <TabsTrigger value="tab3">Rule of 1/3's</TabsTrigger>
              <TabsTrigger value="tab4">Nearfield Listening</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-6">
              <div className="p-4 border-2 border-sky_blue_light-700 rounded-md space-y-4 bg-white">
                <h4 className="font-semibold text-lg">Cardas Golden Ratio</h4>
                {roomWidth && speakerType === "conventional" && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-blue_green-300 mb-1">
                        Distance from the center of the woofer face to the side
                        walls:
                      </p>
                      <p className="text-2xl font-bold">
                        {feetToFraction(parseFloat(roomWidth) * 0.276)}
                      </p>
                      <p className="text-xs text-sky_blue_light-300 mt-1">
                        Room Width × 0.276 ({roomWidth} × 0.276)
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue_green-300 mb-1">
                        Distance from the center of the woofer face to the wall
                        behind the speaker:
                      </p>
                      <p className="text-2xl font-bold">
                        {feetToFraction(parseFloat(roomWidth) * 0.447)}
                      </p>
                      <p className="text-xs text-sky_blue_light-300 mt-1">
                        Room Width × 0.447 ({roomWidth} × 0.447)
                      </p>
                    </div>
                  </div>
                )}
                {roomHeight && speakerType === "planar" && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-blue_green-300 mb-1">
                        Distance from the rear wall:
                      </p>
                      <p className="text-2xl font-bold">
                        {feetToFraction(parseFloat(roomHeight) * 0.618)}
                      </p>
                      <p className="text-xs text-sky_blue_light-300 mt-1">
                        Ceiling Height × 0.618 ({roomHeight} × 0.618)
                      </p>
                    </div>
                  </div>
                )}
                {!roomWidth && speakerType === "conventional" && (
                  <p className="text-sky_blue_light-300 text-sm">
                    Enter room width to see calculations for conventional
                    speakers.
                  </p>
                )}
                {!roomHeight && speakerType === "planar" && (
                  <p className="text-sky_blue_light-300 text-sm">
                    Enter room height to see calculations for planar speakers.
                  </p>
                )}
                {((speakerType === "conventional" && roomWidth) ||
                  (speakerType === "planar" && roomHeight)) && (
                  <div className="pt-4 border-t border-sky_blue_light-700">
                    <Button
                      onClick={() => handleUseAsBaseline("cardas-golden-ratio")}
                      className="bg-amber_flame hover:bg-amber_flame-600 text-white"
                    >
                      Use as Baseline
                    </Button>
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold mt-6 mb-4 text-deep_space_blue">Acknowledgements</h2>
              <Card className="border-2 border-sky_blue_light-700">
                <CardContent className="p-4">
                  <p className="text-sm text-blue_green-300">
                    I've been using the Cardas website for about as long as it
                    has existed I think. I picked his Golden Ratio method
                    because I think it's interesting and a little different from
                    the others. There are several more methods on the{" "}
                    <a
                      href="https://www.cardas.com/system-setup"
                      target="_blank"
                      external
                    >
                      Cardas website
                    </a>{" "}
                    including some for square rooms and positioning on the long
                    wall.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tab2" className="mt-6">
              <div className="p-4 border-2 border-sky_blue_light-700 rounded-md space-y-4 bg-white">
                <h4 className="font-semibold text-lg">Planar Edge Method</h4>
                {roomLength ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-blue_green-300 mb-1">
                        Front Wall (Speaker Position):
                      </p>
                      <p className="text-2xl font-bold">
                        {feetToFraction(parseFloat(roomLength) * 0.4)}
                      </p>
                      <p className="text-xs text-sky_blue_light-300 mt-1">
                        Room Length × 0.4 ({roomLength} × 0.4)
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue_green-300 mb-1">
                        Side Wall (Speaker Position):
                      </p>
                      <p className="text-2xl font-bold">6"</p>
                      <p className="text-xs text-sky_blue_light-300 mt-1">Fixed value</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue_green-300 mb-1">
                        Listening Position:
                      </p>
                      <p className="text-2xl font-bold">
                        {feetToFraction(parseFloat(roomLength) * 0.8)}
                      </p>
                      <p className="text-xs text-sky_blue_light-300 mt-1">
                        Room Length × 0.8 ({roomLength} × 0.8)
                      </p>
                    </div>
                    <div className="pt-4 border-t border-sky_blue_light-700">
                      <Button
                        onClick={() => handleUseAsBaseline("planar-edge")}
                        className="bg-amber_flame hover:bg-amber_flame-600 text-white"
                      >
                        Use as Baseline
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sky_blue_light-300 text-sm">
                    Enter room length to see Planar Edge Method calculations.
                  </p>
                )}
              </div>
              <h2 className="text-2xl font-bold mt-6 mb-4 text-deep_space_blue">Acknowledgements</h2>
              <Card className="border-2 border-sky_blue_light-700">
                <CardContent className="p-4">
                  <p className="text-sm text-blue_green-300">
                    This method is based on{" "}
                    <a
                      href="https://forum.audiogon.com/discussions/planar-speaker-placement"
                      external
                      target="_blank"
                    >
                      this Audiogon forum thread
                    </a>
                    . I simplified it a little bit, this is how I have my
                    speakers set up now.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tab3" className="mt-6">
              <div className="p-4 border-2 border-sky_blue_light-700 rounded-md space-y-4 bg-white">
                <h4 className="font-semibold text-lg">Rule of 1/3's</h4>
                {roomLength ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-blue_green-300 mb-1">
                        Front Wall (Speaker Position):
                      </p>
                      <p className="text-2xl font-bold">
                        {feetToFraction(parseFloat(roomLength) * 0.3333)}
                      </p>
                      <p className="text-xs text-sky_blue_light-300 mt-1">
                        Room Length × 33.33% ({roomLength} × 0.3333)
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue_green-300 mb-1">
                        Listening Position:
                      </p>
                      <p className="text-2xl font-bold">
                        {feetToFraction(parseFloat(roomLength) * 0.66)}
                      </p>
                      <p className="text-xs text-sky_blue_light-300 mt-1">
                        Room Length × 66% ({roomLength} × 0.66)
                      </p>
                    </div>
                    <div className="pt-4 border-t border-sky_blue_light-700">
                      <Button
                        onClick={() => handleUseAsBaseline("rule-of-thirds")}
                        className="bg-amber_flame hover:bg-amber_flame-600 text-white"
                      >
                        Use as Baseline
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sky_blue_light-300 text-sm">
                    Enter room length to see Rule of 1/3's calculations.
                  </p>
                )}
              </div>
              <h2 className="text-2xl font-bold mt-6 mb-4 text-deep_space_blue">Acknowledgements</h2>
              <Card className="border-2 border-sky_blue_light-700">
                <CardContent className="p-4">
                  <p className="text-sm text-blue_green-300">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tab4" className="mt-6">
              <div className="p-4 border-2 border-sky_blue_light-700 rounded-md space-y-4 bg-white">
                <h4 className="font-semibold text-lg">Nearfield Listening</h4>
                <p className="text-sm text-blue_green-300">
                  Nearfield Listening places the speakers and listening position
                  at the corners of an equilateral triangle. This means the
                  distance between the two speakers is equal to the distance
                  from each speaker to the listening position.
                </p>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="sidewallDistance">Sidewall Distance</Label>
                  <Input
                    id="sidewallDistance"
                    type="number"
                    value={sidewallDistance}
                    onChange={(e) => setSidewallDistance(e.target.value)}
                    placeholder="ft"
                    className="w-1/4"
                    min="0"
                    step="0.01"
                  />
                </div>
                {roomWidth && sidewallDistance ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-blue_green-300 mb-1">
                        Speaker Separation (Distance Between Speakers):
                      </p>
                      <p className="text-2xl font-bold">
                        {feetToFraction(
                          parseFloat(roomWidth) -
                            parseFloat(sidewallDistance) * 2
                        )}
                      </p>
                      <p className="text-xs text-sky_blue_light-300 mt-1">
                        Room Width - (Sidewall Distance × 2) ({roomWidth} -{" "}
                        {sidewallDistance} × 2)
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-blue_green-300 mb-1">
                        Listening Position (Distance from speaker front to
                        listener):
                      </p>
                      <p className="text-2xl font-bold">
                        {feetToFraction(
                          ((parseFloat(roomWidth) -
                            parseFloat(sidewallDistance) * 2) *
                            Math.sqrt(3)) /
                            2
                        )}
                      </p>
                      <p className="text-xs text-sky_blue_light-300 mt-1">
                        (Speaker Separation × √3) / 2
                      </p>
                    </div>
                    <div className="pt-4 border-t border-sky_blue_light-700">
                      <Button
                        onClick={() =>
                          handleUseAsBaseline("equilateral-triangle")
                        }
                        className="bg-amber_flame hover:bg-amber_flame-600 text-white"
                      >
                        Use as Baseline
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sky_blue_light-300 text-sm">
                    Enter room width and sidewall distance to see Equilateral
                    Triangle calculations.
                  </p>
                )}
              </div>
              <h2 className="text-2xl font-bold mt-6 mb-4 text-deep_space_blue">Acknowledgements</h2>
              <Card className="border-2 border-sky_blue_light-700">
                <CardContent className="p-4">
                  <p className="text-sm text-blue_green-300">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
