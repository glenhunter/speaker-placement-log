import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useBaseline } from "@/hooks/useBaseline";
import { useUnit } from "@/contexts/UnitContext";
import { feetToFraction, convertToFeet } from "@/lib/utils";

export function SpeakerBaselines() {
  const navigate = useNavigate();
  const { saveBaseline } = useBaseline();
  const { unit } = useUnit();

  // Separate state for major/minor units (feet/metres and inches/cm)
  const [roomLengthMajor, setRoomLengthMajor] = useState("");
  const [roomLengthMinor, setRoomLengthMinor] = useState("");
  const [roomWidthMajor, setRoomWidthMajor] = useState("");
  const [roomWidthMinor, setRoomWidthMinor] = useState("");
  const [roomHeightMajor, setRoomHeightMajor] = useState("");
  const [roomHeightMinor, setRoomHeightMinor] = useState("");
  const [sidewallDistanceMajor, setSidewallDistanceMajor] = useState("");
  const [sidewallDistanceMinor, setSidewallDistanceMinor] = useState("");
  const [listeningPositionMajor, setListeningPositionMajor] = useState("");
  const [listeningPositionMinor, setListeningPositionMinor] = useState("");
  const [manualFrontWallMajor, setManualFrontWallMajor] = useState("");
  const [manualFrontWallMinor, setManualFrontWallMinor] = useState("");
  const [manualSideWallMajor, setManualSideWallMajor] = useState("");
  const [manualSideWallMinor, setManualSideWallMinor] = useState("");
  const [speakerType, setSpeakerType] = useState("conventional");

  // Format the display of input values for formulas
  const formatInputDisplay = (major, minor) => {
    const majorNum = parseFloat(major);
    const minorNum = parseFloat(minor);
    const majorValue = isNaN(majorNum) || major === "" ? "0" : major;
    const minorValue = isNaN(minorNum) || minor === "" ? "0" : minor;

    if (unit === "imperial") {
      return `${majorValue}' ${minorValue}"`;
    } else {
      return `${majorValue}m ${minorValue}cm`;
    }
  };

  const handleUseAsBaseline = (calculationType = "cardas-golden-ratio") => {
    const methodNames = {
      "cardas-golden-ratio": "Cardas Golden Ratio",
      "planar-edge": "Planar Edge Method",
      "rule-of-thirds": "Rule of 1/3's",
      "equilateral-triangle": "Nearfield Listening",
      manual: "Manual",
    };

    const baselineData = {
      calculationType,
      methodName: methodNames[calculationType],
      speakerType,
      values: [],
    };

    // Parse and convert to feet for calculations
    const parsedWidth = convertToFeet(roomWidthMajor, roomWidthMinor, unit);
    const parsedHeight = convertToFeet(roomHeightMajor, roomHeightMinor, unit);
    const parsedLength = convertToFeet(roomLengthMajor, roomLengthMinor, unit);
    const parsedSidewall = convertToFeet(
      sidewallDistanceMajor,
      sidewallDistanceMinor,
      unit
    );

    if (calculationType === "cardas-golden-ratio") {
      if (speakerType === "conventional" && parsedWidth !== null) {
        const sideWallDistanceFeet = parsedWidth * 0.276;
        const frontWallDistanceFeet = parsedWidth * 0.447;

        baselineData.values = [
          {
            label: "Front Wall",
            value: feetToFraction(frontWallDistanceFeet),
            rawValueInFeet: frontWallDistanceFeet,
            formula: `Room Width × 0.447 (${formatInputDisplay(
              roomWidthMajor,
              roomWidthMinor
            )} × 0.447)`,
          },
          {
            label: "Side Wall",
            value: feetToFraction(sideWallDistanceFeet),
            rawValueInFeet: sideWallDistanceFeet,
            formula: `Room Width × 0.276 (${formatInputDisplay(
              roomWidthMajor,
              roomWidthMinor
            )} × 0.276)`,
          },
        ];
      } else if (speakerType === "planar" && parsedHeight !== null) {
        const frontWallDistanceFeet = parsedHeight * 0.618;

        baselineData.values = [
          {
            label: "Front Wall",
            value: feetToFraction(frontWallDistanceFeet),
            rawValueInFeet: frontWallDistanceFeet,
            formula: `Ceiling Height × 0.618 (${formatInputDisplay(
              roomHeightMajor,
              roomHeightMinor
            )} × 0.618)`,
          },
        ];
      }
    } else if (calculationType === "planar-edge" && parsedLength !== null) {
      const frontWallDistanceFeet = parsedLength * 0.4;
      const listeningPositionFeet = parsedLength * 0.8;

      baselineData.values = [
        {
          label: "Front Wall",
          value: feetToFraction(frontWallDistanceFeet),
          rawValueInFeet: frontWallDistanceFeet,
          formula: `Room Length × 0.4 (${formatInputDisplay(
            roomLengthMajor,
            roomLengthMinor
          )} × 0.4)`,
        },
        {
          label: "Side Wall",
          value: '6"',
          rawValueInFeet: 0.5, // 6 inches = 0.5 feet
          formula: "Fixed value",
        },
        {
          label: "Listening Position",
          value: feetToFraction(listeningPositionFeet),
          rawValueInFeet: listeningPositionFeet,
          formula: `Room Length × 0.8 (${formatInputDisplay(
            roomLengthMajor,
            roomLengthMinor
          )} × 0.8)`,
        },
      ];
    } else if (calculationType === "rule-of-thirds" && parsedLength !== null) {
      const frontWallDistanceFeet = parsedLength * 0.3333;
      const listeningPositionFeet = parsedLength * 0.66;

      baselineData.values = [
        {
          label: "Front Wall",
          value: feetToFraction(frontWallDistanceFeet),
          rawValueInFeet: frontWallDistanceFeet,
          formula: `Room Length × 33.33% (${formatInputDisplay(
            roomLengthMajor,
            roomLengthMinor
          )} × 0.3333)`,
        },
        {
          label: "Listening Position",
          value: feetToFraction(listeningPositionFeet),
          rawValueInFeet: listeningPositionFeet,
          formula: `Room Length × 66% (${formatInputDisplay(
            roomLengthMajor,
            roomLengthMinor
          )} × 0.66)`,
        },
      ];
    } else if (
      calculationType === "equilateral-triangle" &&
      parsedWidth !== null &&
      parsedSidewall !== null
    ) {
      const speakerSeparation = parsedWidth - parsedSidewall * 2;
      const listeningPositionFeet = (speakerSeparation * Math.sqrt(3)) / 2;

      baselineData.values = [
        {
          label: "Side Wall",
          value: feetToFraction(parsedSidewall),
          rawValueInFeet: parsedSidewall,
          formula: `Input value (${formatInputDisplay(
            sidewallDistanceMajor,
            sidewallDistanceMinor
          )})`,
        },
        {
          label: "Listening Position",
          value: feetToFraction(listeningPositionFeet),
          rawValueInFeet: listeningPositionFeet,
          formula: `(Speaker Separation × √3) / 2`,
        },
      ];
    } else if (calculationType === "manual") {
      // Manual tab - include speaker positions and optional listening position
      baselineData.values = [];

      // Add front wall and side wall distances if provided
      const parsedManualFrontWall = convertToFeet(
        manualFrontWallMajor,
        manualFrontWallMinor,
        unit
      );
      const parsedManualSideWall = convertToFeet(
        manualSideWallMajor,
        manualSideWallMinor,
        unit
      );

      if (parsedManualFrontWall !== null) {
        baselineData.values.push({
          label: "Front Wall",
          value: formatInputDisplay(manualFrontWallMajor, manualFrontWallMinor),
          rawValueInFeet: parsedManualFrontWall,
          formula: `Input value (${formatInputDisplay(
            manualFrontWallMajor,
            manualFrontWallMinor
          )})`,
        });
      }
      if (parsedManualSideWall !== null) {
        baselineData.values.push({
          label: "Side Wall",
          value: formatInputDisplay(manualSideWallMajor, manualSideWallMinor),
          rawValueInFeet: parsedManualSideWall,
          formula: `Input value (${formatInputDisplay(
            manualSideWallMajor,
            manualSideWallMinor
          )})`,
        });
      }

      // Add listening position if provided
      const parsedListeningPosition = convertToFeet(
        listeningPositionMajor,
        listeningPositionMinor,
        unit
      );
      if (parsedListeningPosition !== null) {
        baselineData.values.push({
          label: "Listening Position",
          value: formatInputDisplay(
            listeningPositionMajor,
            listeningPositionMinor
          ),
          rawValueInFeet: parsedListeningPosition,
          formula: `Input value (${formatInputDisplay(
            listeningPositionMajor,
            listeningPositionMinor
          )})`,
        });
      }
    }

    saveBaseline(baselineData);
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-deep_space_blue">
            Speaker Baselines
          </h2>
          <p className="mb-6 text-sky_blue_light-500">
            Distances should be measured from the front center of the speaker.
          </p>
          {/* Room Dimensions Form */}
          <Card className="mb-8 border-2 border-sky_blue_light-700 shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-deep_space_blue">
                  Room Dimensions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Length */}
                  <div className="flex flex-col gap-2">
                    <Label>Length</Label>
                    <div className="flex gap-1 items-center">
                      <Input
                        id="roomLengthMajor"
                        type="number"
                        value={roomLengthMajor}
                        onChange={(e) => setRoomLengthMajor(e.target.value)}
                        className="w-16"
                        min="0"
                      />
                      <span className="text-sm text-sky_blue_light-500">
                        {unit === "imperial" ? "ft" : "m"}
                      </span>
                      <Input
                        id="roomLengthMinor"
                        type="number"
                        value={roomLengthMinor}
                        onChange={(e) => setRoomLengthMinor(e.target.value)}
                        className="w-16"
                        min="0"
                      />
                      <span className="text-sm text-sky_blue_light-500">
                        {unit === "imperial" ? "in" : "cm"}
                      </span>
                    </div>
                  </div>
                  {/* Width */}
                  <div className="flex flex-col gap-2">
                    <Label>Width</Label>
                    <div className="flex gap-1 items-center">
                      <Input
                        id="roomWidthMajor"
                        type="number"
                        value={roomWidthMajor}
                        onChange={(e) => setRoomWidthMajor(e.target.value)}
                        className="w-16"
                        min="0"
                      />
                      <span className="text-sm text-sky_blue_light-500">
                        {unit === "imperial" ? "ft" : "m"}
                      </span>
                      <Input
                        id="roomWidthMinor"
                        type="number"
                        value={roomWidthMinor}
                        onChange={(e) => setRoomWidthMinor(e.target.value)}
                        className="w-16"
                        min="0"
                      />
                      <span className="text-sm text-sky_blue_light-500">
                        {unit === "imperial" ? "in" : "cm"}
                      </span>
                    </div>
                  </div>
                  {/* Height */}
                  <div className="flex flex-col gap-2">
                    <Label>Height</Label>
                    <div className="flex gap-1 items-center">
                      <Input
                        id="roomHeightMajor"
                        type="number"
                        value={roomHeightMajor}
                        onChange={(e) => setRoomHeightMajor(e.target.value)}
                        className="w-16"
                        min="0"
                      />
                      <span className="text-sm text-sky_blue_light-500">
                        {unit === "imperial" ? "ft" : "m"}
                      </span>
                      <Input
                        id="roomHeightMinor"
                        type="number"
                        value={roomHeightMinor}
                        onChange={(e) => setRoomHeightMinor(e.target.value)}
                        className="w-16"
                        min="0"
                      />
                      <span className="text-sm text-sky_blue_light-500">
                        {unit === "imperial" ? "in" : "cm"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Speaker Type */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-deep_space_blue">
                  Speaker Type
                </h3>
                <div className="flex flex-col gap-2">
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
            <TabsList className="flex w-full overflow-x-auto md:grid md:grid-cols-5">
              <TabsTrigger value="tab1" className="flex-shrink-0">Golden Ratio</TabsTrigger>
              <TabsTrigger value="tab2" className="flex-shrink-0">Planar "Edge"</TabsTrigger>
              <TabsTrigger value="tab3" className="flex-shrink-0">Rule of 1/3's</TabsTrigger>
              <TabsTrigger value="tab4" className="flex-shrink-0">Nearfield</TabsTrigger>
              <TabsTrigger value="tab5" className="flex-shrink-0">Manual</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-6">
              <div className="p-4 border-2 border-sky_blue_light-700 rounded-md space-y-4 bg-white">
                <h4 className="font-semibold text-lg">Cardas Golden Ratio</h4>
                {speakerType === "conventional" &&
                  convertToFeet(roomWidthMajor, roomWidthMinor, unit) !== null && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-sky_blue_light-500 mb-1">
                          Distance from the center of the woofer face to the
                          side walls:
                        </p>
                        <p className="text-2xl font-bold">
                          {feetToFraction(
                            convertToFeet(roomWidthMajor, roomWidthMinor, unit) *
                              0.276
                          )}
                        </p>
                        <p className="text-xs text-sky_blue_light-400 mt-1">
                          Room Width × 0.276 (
                          {formatInputDisplay(roomWidthMajor, roomWidthMinor)} ×
                          0.276)
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-sky_blue_light-500 mb-1">
                          Distance from the center of the woofer face to the
                          wall behind the speaker:
                        </p>
                        <p className="text-2xl font-bold">
                          {feetToFraction(
                            convertToFeet(roomWidthMajor, roomWidthMinor, unit) *
                              0.447
                          )}
                        </p>
                        <p className="text-xs text-sky_blue_light-400 mt-1">
                          Room Width × 0.447 (
                          {formatInputDisplay(roomWidthMajor, roomWidthMinor)} ×
                          0.447)
                        </p>
                      </div>
                    </div>
                  )}
                {speakerType === "planar" &&
                  convertToFeet(roomHeightMajor, roomHeightMinor, unit) !== null && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-sky_blue_light-500 mb-1">
                          Distance from the rear wall:
                        </p>
                        <p className="text-2xl font-bold">
                          {feetToFraction(
                            convertToFeet(roomHeightMajor, roomHeightMinor, unit) *
                              0.618
                          )}
                        </p>
                        <p className="text-xs text-sky_blue_light-400 mt-1">
                          Ceiling Height × 0.618 (
                          {formatInputDisplay(roomHeightMajor, roomHeightMinor)}{" "}
                          × 0.618)
                        </p>
                      </div>
                    </div>
                  )}
                {convertToFeet(roomWidthMajor, roomWidthMinor, unit) === null &&
                  speakerType === "conventional" && (
                    <p className="text-sky_blue_light-400 text-sm">
                      Enter room width to see calculations for conventional
                      speakers.
                    </p>
                  )}
                {convertToFeet(roomHeightMajor, roomHeightMinor, unit) === null &&
                  speakerType === "planar" && (
                    <p className="text-sky_blue_light-400 text-sm">
                      Enter room height to see calculations for planar speakers.
                    </p>
                  )}
                {((speakerType === "conventional" &&
                  convertToFeet(roomWidthMajor, roomWidthMinor, unit) !== null) ||
                  (speakerType === "planar" &&
                    convertToFeet(roomHeightMajor, roomHeightMinor, unit) !==
                      null)) && (
                  <div className="pt-4 border-t border-sky_blue_light-700">
                    <Button
                      onClick={() => handleUseAsBaseline("cardas-golden-ratio")}
                      className="btn-primary w-full md:w-auto"
                    >
                      Use as Baseline
                    </Button>
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold mt-6 mb-4 text-deep_space_blue">
                Acknowledgements
              </h2>
              <Card className="border-2 border-sky_blue_light-700">
                <CardContent className="p-4">
                  <p className="text-sm text-sky_blue_light-500">
                    I've been using the Cardas website for about as long as it
                    has existed I think. I picked his Golden Ratio method
                    because I think it's interesting and a little different from
                    the others. There are several more methods on the{" "}
                    <a
                      href="https://www.cardas.com/system-setup"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-accessible"
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
                <h4 className="font-semibold text-lg">Planar "Edge" Method</h4>
                {convertToFeet(roomLengthMajor, roomLengthMinor, unit) !== null ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-sky_blue_light-500 mb-1">
                        Front Wall (Speaker Position):
                      </p>
                      <p className="text-2xl font-bold">
                        {feetToFraction(
                          convertToFeet(roomLengthMajor, roomLengthMinor, unit) * 0.4
                        )}
                      </p>
                      <p className="text-xs text-sky_blue_light-400 mt-1">
                        Room Length × 0.4 (
                        {formatInputDisplay(roomLengthMajor, roomLengthMinor)} ×
                        0.4)
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-sky_blue_light-500 mb-1">
                        Side Wall (Speaker Position):
                      </p>
                      <p className="text-2xl font-bold">6"</p>
                      <p className="text-xs text-sky_blue_light-400 mt-1">
                        Fixed value
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-sky_blue_light-500 mb-1">
                        Listening Position:
                      </p>
                      <p className="text-2xl font-bold">
                        {feetToFraction(
                          convertToFeet(roomLengthMajor, roomLengthMinor, unit) * 0.8
                        )}
                      </p>
                      <p className="text-xs text-sky_blue_light-400 mt-1">
                        Room Length × 0.8 (
                        {formatInputDisplay(roomLengthMajor, roomLengthMinor)} ×
                        0.8)
                      </p>
                    </div>
                    <div className="pt-4 border-t border-sky_blue_light-700">
                      <Button
                        onClick={() => handleUseAsBaseline("planar-edge")}
                        className="btn-primary w-full md:w-auto"
                      >
                        Use as Baseline
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sky_blue_light-400 text-sm">
                    Enter room length to see Planar Edge Method calculations.
                  </p>
                )}
              </div>
              <h2 className="text-2xl font-bold mt-6 mb-4 text-deep_space_blue">
                Acknowledgements
              </h2>
              <Card className="border-2 border-sky_blue_light-700">
                <CardContent className="p-4">
                  <p className="text-sm text-sky_blue_light-500">
                    This method is based on{" "}
                    <a
                      href="https://forum.audiogon.com/discussions/planar-speaker-placement"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-accessible"
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
                {convertToFeet(roomLengthMajor, roomLengthMinor, unit) !== null ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-sky_blue_light-500 mb-1">
                        Front Wall (Speaker Position):
                      </p>
                      <p className="text-2xl font-bold">
                        {feetToFraction(
                          convertToFeet(roomLengthMajor, roomLengthMinor, unit) *
                            0.3333
                        )}
                      </p>
                      <p className="text-xs text-sky_blue_light-400 mt-1">
                        Room Length × 33.33% (
                        {formatInputDisplay(roomLengthMajor, roomLengthMinor)} ×
                        0.3333)
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-sky_blue_light-500 mb-1">
                        Listening Position:
                      </p>
                      <p className="text-2xl font-bold">
                        {feetToFraction(
                          convertToFeet(roomLengthMajor, roomLengthMinor, unit) * 0.66
                        )}
                      </p>
                      <p className="text-xs text-sky_blue_light-400 mt-1">
                        Room Length × 66% (
                        {formatInputDisplay(roomLengthMajor, roomLengthMinor)} ×
                        0.66)
                      </p>
                    </div>
                    <div className="pt-4 border-t border-sky_blue_light-700">
                      <Button
                        onClick={() => handleUseAsBaseline("rule-of-thirds")}
                        className="btn-primary w-full md:w-auto"
                      >
                        Use as Baseline
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sky_blue_light-400 text-sm">
                    Enter room length to see Rule of 1/3's calculations.
                  </p>
                )}
              </div>
              <h2 className="text-2xl font-bold mt-6 mb-4 text-deep_space_blue">
                Acknowledgements
              </h2>
              <Card className="border-2 border-sky_blue_light-700">
                <CardContent className="p-4">
                  <p className="text-sm text-sky_blue_light-500">
                    The Rule of Thirds is a classic room acoustics principle
                    that helps minimize standing waves and bass nodes. By
                    placing speakers and listeners at third points in the room,
                    you avoid the worst room mode reinforcement.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tab4" className="mt-6">
              <div className="p-4 border-2 border-sky_blue_light-700 rounded-md space-y-4 bg-white">
                <h4 className="font-semibold text-lg">Nearfield Listening</h4>
                <p className="text-sm text-sky_blue_light-500">
                  Nearfield Listening places the speakers and listening position
                  at the corners of an equilateral triangle. This means the
                  distance between the two speakers is equal to the distance
                  from each speaker to the listening position.
                </p>
                <div className="flex flex-col gap-2">
                  <Label>Sidewall Distance</Label>
                  <div className="flex gap-1 items-center w-1/2">
                    <Input
                      id="sidewallDistanceMajor"
                      type="number"
                      value={sidewallDistanceMajor}
                      onChange={(e) => setSidewallDistanceMajor(e.target.value)}
                      className="w-16"
                      min="0"
                    />
                    <span className="text-sm text-sky_blue_light-500">
                      {unit === "imperial" ? "ft" : "m"}
                    </span>
                    <Input
                      id="sidewallDistanceMinor"
                      type="number"
                      value={sidewallDistanceMinor}
                      onChange={(e) => setSidewallDistanceMinor(e.target.value)}
                      className="w-16"
                      min="0"
                    />
                    <span className="text-sm text-sky_blue_light-500">
                      {unit === "imperial" ? "in" : "cm"}
                    </span>
                  </div>
                </div>
                {convertToFeet(roomWidthMajor, roomWidthMinor, unit) !== null &&
                convertToFeet(sidewallDistanceMajor, sidewallDistanceMinor, unit) !==
                  null ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-sky_blue_light-500 mb-1">
                        Speaker Separation (Distance Between Speakers):
                      </p>
                      <p className="text-2xl font-bold">
                        {feetToFraction(
                          convertToFeet(roomWidthMajor, roomWidthMinor, unit) -
                            convertToFeet(
                              sidewallDistanceMajor,
                              sidewallDistanceMinor,
                              unit
                            ) *
                              2
                        )}
                      </p>
                      <p className="text-xs text-sky_blue_light-400 mt-1">
                        Room Width - (Sidewall Distance × 2) (
                        {formatInputDisplay(roomWidthMajor, roomWidthMinor)} -{" "}
                        {formatInputDisplay(
                          sidewallDistanceMajor,
                          sidewallDistanceMinor
                        )}{" "}
                        × 2)
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-sky_blue_light-500 mb-1">
                        Listening Position (Distance from speaker front to
                        listener):
                      </p>
                      <p className="text-2xl font-bold">
                        {feetToFraction(
                          ((convertToFeet(roomWidthMajor, roomWidthMinor, unit) -
                            convertToFeet(
                              sidewallDistanceMajor,
                              sidewallDistanceMinor,
                              unit
                            ) *
                              2) *
                            Math.sqrt(3)) /
                            2
                        )}
                      </p>
                      <p className="text-xs text-sky_blue_light-400 mt-1">
                        (Speaker Separation × √3) / 2
                      </p>
                    </div>
                    <div className="pt-4 border-t border-sky_blue_light-700">
                      <Button
                        onClick={() =>
                          handleUseAsBaseline("equilateral-triangle")
                        }
                        className="btn-primary w-full md:w-auto"
                      >
                        Use as Baseline
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sky_blue_light-400 text-sm">
                    Enter room width and sidewall distance to see Equilateral
                    Triangle calculations.
                  </p>
                )}
              </div>
              <h2 className="text-2xl font-bold mt-6 mb-4 text-deep_space_blue">
                Acknowledgements
              </h2>
              <Card className="border-2 border-sky_blue_light-700">
                <CardContent className="p-4">
                  <p className="text-sm text-sky_blue_light-500">
                    Nearfield listening using an equilateral triangle is a
                    standard studio monitoring technique. It minimizes room
                    reflections by placing you close enough to the speakers that
                    direct sound dominates.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="tab5" className="mt-6">
              <div className="p-4 border-2 border-sky_blue_light-700 rounded-md space-y-4 bg-white">
                <h4 className="font-semibold text-lg">Manual</h4>
                <p className="text-base text-sky_blue_light-500">
                  Use "manual" when you already have your speakers set up in a
                  way that you're generally happy with but you're looking to
                  optimize their placement.
                </p>
                <p className="text-base text-sky_blue_light-500">
                  Enter the current distance from your speakers to the front
                  wall and side walls. The Listening Position input is optional,
                  but recommended.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Front Wall</Label>
                    <div className="flex gap-1 items-center">
                      <Input
                        id="manualFrontWallMajor"
                        type="number"
                        value={manualFrontWallMajor}
                        onChange={(e) =>
                          setManualFrontWallMajor(e.target.value)
                        }
                        className="w-16"
                        min="0"
                      />
                      <span className="text-sm text-sky_blue_light-500">
                        {unit === "imperial" ? "ft" : "m"}
                      </span>
                      <Input
                        id="manualFrontWallMinor"
                        type="number"
                        value={manualFrontWallMinor}
                        onChange={(e) =>
                          setManualFrontWallMinor(e.target.value)
                        }
                        className="w-16"
                        min="0"
                      />
                      <span className="text-sm text-sky_blue_light-500">
                        {unit === "imperial" ? "in" : "cm"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Side Wall</Label>
                    <div className="flex gap-1 items-center">
                      <Input
                        id="manualSideWallMajor"
                        type="number"
                        value={manualSideWallMajor}
                        onChange={(e) => setManualSideWallMajor(e.target.value)}
                        className="w-16"
                        min="0"
                      />
                      <span className="text-sm text-sky_blue_light-500">
                        {unit === "imperial" ? "ft" : "m"}
                      </span>
                      <Input
                        id="manualSideWallMinor"
                        type="number"
                        value={manualSideWallMinor}
                        onChange={(e) => setManualSideWallMinor(e.target.value)}
                        className="w-16"
                        min="0"
                      />
                      <span className="text-sm text-sky_blue_light-500">
                        {unit === "imperial" ? "in" : "cm"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Seat</Label>
                    <div className="flex gap-1 items-center w-1/2">
                      <Input
                        id="listeningPositionMajor"
                        type="number"
                        value={listeningPositionMajor}
                        onChange={(e) =>
                          setListeningPositionMajor(e.target.value)
                        }
                        className="w-16"
                        min="0"
                      />
                      <span className="text-sm text-sky_blue_light-500">
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
                      />
                      <span className="text-sm text-sky_blue_light-500">
                        {unit === "imperial" ? "in" : "cm"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-sky_blue_light-700">
                  <Button
                    onClick={() => handleUseAsBaseline("manual")}
                    className="btn-primary w-full md:w-auto"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
