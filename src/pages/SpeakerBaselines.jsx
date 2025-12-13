import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useBaseline } from "@/hooks/useBaseline";
import { feetToFraction } from "@/lib/utils";

export function SpeakerBaselines() {
  const navigate = useNavigate();
  const { saveBaseline } = useBaseline();
  const [roomLength, setRoomLength] = useState("");
  const [roomWidth, setRoomWidth] = useState("");
  const [roomHeight, setRoomHeight] = useState("");
  const [speakerType, setSpeakerType] = useState("conventional");

  const handleUseAsBaseline = () => {
    const baselineData = {
      calculationType: "cardas-golden-ratio",
      speakerType,
      values: [],
    };

    if (speakerType === "conventional" && roomWidth) {
      const sideWallDistance = feetToFraction(parseFloat(roomWidth) * 0.276);
      const frontWallDistance = feetToFraction(parseFloat(roomWidth) * 0.447);

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
    } else if (speakerType === "planar" && roomHeight) {
      const frontWallDistance = feetToFraction(parseFloat(roomHeight) * 0.618);

      baselineData.values = [
        {
          label: "Front Wall",
          value: frontWallDistance,
          formula: `Ceiling Height × 0.618 (${roomHeight} × 0.618)`,
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
          <h2 className="text-3xl font-bold mb-6">Speaker Baselines</h2>

          {/* Room Dimensions Form */}
          <div className="space-y-6 mb-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Room Dimensions</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="roomLength">Length</Label>
                  <Input
                    id="roomLength"
                    type="number"
                    value={roomLength}
                    onChange={(e) => setRoomLength(e.target.value)}
                    placeholder="ft"
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
                  />
                </div>
              </div>
            </div>

            {/* Speaker Type */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">Speaker Type</h3>
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
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="tab1" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="tab1">Cardas Golden Ratio</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              <TabsTrigger value="tab4">Tab 4</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-6">
              <div className="p-4 border rounded-md space-y-4">
                <h4 className="font-semibold text-lg">Cardas Golden Ratio</h4>
                {roomWidth && speakerType === "conventional" && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Distance from the center of the woofer face to the side
                        walls:
                      </p>
                      <p className="text-2xl font-bold">
                        {feetToFraction(parseFloat(roomWidth) * 0.276)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Room Width × 0.276 ({roomWidth} × 0.276)
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Distance from the center of the woofer face to the wall
                        behind the speaker:
                      </p>
                      <p className="text-2xl font-bold">
                        {feetToFraction(parseFloat(roomWidth) * 0.447)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Room Width × 0.447 ({roomWidth} × 0.447)
                      </p>
                    </div>
                  </div>
                )}
                {roomHeight && speakerType === "planar" && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Distance from the rear wall:
                      </p>
                      <p className="text-2xl font-bold">
                        {feetToFraction(parseFloat(roomHeight) * 0.618)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Ceiling Height × 0.618 ({roomHeight} × 0.618)
                      </p>
                    </div>
                  </div>
                )}
                {!roomWidth && speakerType === "conventional" && (
                  <p className="text-gray-500 text-sm">
                    Enter room width to see calculations for conventional
                    speakers.
                  </p>
                )}
                {!roomHeight && speakerType === "planar" && (
                  <p className="text-gray-500 text-sm">
                    Enter room height to see calculations for planar speakers.
                  </p>
                )}
                {((speakerType === "conventional" && roomWidth) ||
                  (speakerType === "planar" && roomHeight)) && (
                  <div className="pt-4 border-t">
                    <Button onClick={handleUseAsBaseline}>
                      Use as Baseline
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="tab2" className="mt-6">
              <div className="p-4 border rounded-md">
                <p>Tab 2 content will go here</p>
              </div>
            </TabsContent>
            <TabsContent value="tab3" className="mt-6">
              <div className="p-4 border rounded-md">
                <p>Tab 3 content will go here</p>
              </div>
            </TabsContent>
            <TabsContent value="tab4" className="mt-6">
              <div className="p-4 border rounded-md">
                <p>Tab 4 content will go here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
