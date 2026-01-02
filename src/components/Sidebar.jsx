import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUnit } from "@/contexts/UnitContext";
import { formatDistance } from "@/lib/utils";
import { PenTool, Pencil, Check, Trash2 } from "lucide-react";
import { useState } from "react";

/**
 * Safely converts a rating value to a number.
 * Ratings should already be numbers, but handle string coercion from storage.
 */
function toRatingNumber(value) {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * Calculates the sum of all rating values for a measurement.
 */
function calculateScore(measurement) {
  return (
    toRatingNumber(measurement.bass) +
    toRatingNumber(measurement.treble) +
    toRatingNumber(measurement.vocals) +
    toRatingNumber(measurement.soundstage)
  );
}

export function Sidebar({
  measurements,
  updateMeasurement,
  deleteMeasurement,
  baseline,
  previousBaselines = [],
  deleteBaseline,
  saveBaseline,
}) {
  const { unit } = useUnit();
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const startEditing = (measurement) => {
    setEditingId(measurement.id);
    setEditingName(measurement.name || "");
  };

  const handleSaveName = async (id) => {
    if (editingName.trim()) {
      await updateMeasurement({
        id,
        updates: { name: editingName.trim() },
      });
    }
    setEditingId(null);
    setEditingName("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveName(id);
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };

  const renderMeasurementCard = (measurement) => {
    const sum = calculateScore(measurement);

    return (
      <Card
        key={measurement.id}
        className="border-2 border-sky_blue_light-700 overflow-hidden"
      >
        <CardHeader className="p-0">
          <div className="flex items-center justify-between">
            {/* Left side: Name section */}
            <div className="flex items-center gap-2 px-3 py-1.5">
              {editingId === measurement.id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, measurement.id)}
                    onBlur={() => handleSaveName(measurement.id)}
                    className="text-sm bg-transparent border-b border-white focus:outline-none"
                    placeholder="Name this modification..."
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveName(measurement.id)}
                    onMouseDown={(e) => e.preventDefault()}
                    className="text-green-500 hover:text-green-400"
                    aria-label="Save name"
                  >
                    <Check size={16} />
                  </button>
                </>
              ) : measurement.name ? (
                <>
                  <span className="text-sm font-medium">
                    {measurement.name}
                  </span>
                  <button
                    onClick={() => startEditing(measurement)}
                    className="text-gray-400 hover:text-white"
                    aria-label="Edit name"
                  >
                    <Pencil size={14} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startEditing(measurement)}
                  className="text-gray-400 hover:text-white"
                  aria-label="Name this modification"
                >
                  <PenTool size={16} />
                </button>
              )}
            </div>

            {/* Right side: Method label (existing) */}
            {measurement.baselineMethodName && (
              <div className="text-xs text-white bg-sky_blue_light-700 px-3 py-1.5 rounded-bl-lg card-method-label">
                {measurement.baselineMethodName}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-4 pb-4">
          <div className="grid grid-cols-[auto_1fr_auto_1fr] gap-4">
            {/* Column 1: Measurements */}
            <div className="flex flex-col gap-1 text-sm">
              <div className="text-gray-600">Front Wall:</div>
              <div className="text-gray-600">Side Wall:</div>
              {measurement.listeningPosition && (
                <div className="text-gray-600">Seat:</div>
              )}
            </div>

            {/* Column 2: Measurement Values */}
            <div className="flex flex-col gap-1 text-sm">
              <div className="font-semibold text-deep_space_blue">
                {formatDistance(measurement.distanceFromFrontWall, unit)}
              </div>
              <div className="font-semibold text-deep_space_blue">
                {formatDistance(measurement.distanceFromSideWall, unit)}
              </div>
              {measurement.listeningPosition && (
                <div className="font-semibold text-deep_space_blue">
                  {formatDistance(measurement.listeningPosition, unit)}
                </div>
              )}
            </div>

            {/* Column 3: Subjective Ratings */}
            <div className="flex flex-col gap-1 text-sm">
              <div className="text-gray-600">Bass:</div>
              <div className="text-gray-600">Treble:</div>
              <div className="text-gray-600">Vocals:</div>
              <div className="text-gray-600">Soundstage:</div>
            </div>
            {/* Column 4: Subjective Rating Values */}
            <div className="flex flex-col gap-1 text-sm">
              <div className="font-semibold text-deep_space_blue">
                {measurement.bass}
              </div>
              <div className="font-semibold text-deep_space_blue">
                {measurement.treble}
              </div>
              <div className="font-semibold text-deep_space_blue">
                {measurement.vocals}
              </div>
              <div className="font-semibold text-deep_space_blue">
                {measurement.soundstage}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-3 py-1 grid grid-cols-4 items-center border-t border-sky_blue_light-700">
          <button
            onClick={() =>
              updateMeasurement({
                id: measurement.id,
                updates: { isFavorite: !measurement.isFavorite },
              })
            }
            className="p-1 rounded hover:bg-princeton_orange/10 active:bg-princeton_orange/20 transition-all justify-self-start"
            aria-label={
              measurement.isFavorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={measurement.isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={
                measurement.isFavorite
                  ? "text-princeton_orange"
                  : "text-muted-foreground"
              }
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
          <div className="text-base font-bold text-deep_space_blue">{sum}</div>
          <time
            dateTime={measurement.createdAt}
            className="text-center text-xs text-muted-foreground"
            aria-label={`Created on ${new Date(measurement.createdAt).toLocaleString()}`}
          >
            {new Date(measurement.createdAt).toLocaleString()}
          </time>
          <button
            onClick={() => deleteMeasurement(measurement.id)}
            className="p-1 rounded hover:bg-destructive/10 active:bg-destructive/20 text-destructive transition-all justify-self-end"
            aria-label="Delete measurement"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" x2="10" y1="11" y2="17" />
              <line x1="14" x2="14" y1="11" y2="17" />
            </svg>
          </button>
        </CardFooter>
      </Card>
    );
  };

  const renderBaselineCard = (baselineItem) => {
    // Handler to use this baseline - creates a copy without the id/createdAt
    const handleUseBaseline = () => {
      const { id, createdAt, ...baselineData } = baselineItem;
      saveBaseline(baselineData);
    };

    return (
      <Card
        key={baselineItem.id}
        className="border-2 border-sky_blue_light-700 overflow-hidden"
      >
        <CardHeader className="p-0">
          <div className="flex items-center justify-between">
            {/* Left side: Created date */}
            <div className="px-3 py-1.5">
              <time
                dateTime={baselineItem.createdAt}
                className="text-xs text-muted-foreground"
                aria-label={`Created on ${new Date(baselineItem.createdAt).toLocaleString()}`}
              >
                {new Date(baselineItem.createdAt).toLocaleDateString()}
              </time>
            </div>

            {/* Right side: Method label */}
            {baselineItem.methodName && (
              <div className="text-xs text-white bg-sky_blue_light-700 px-3 py-1.5 rounded-bl-lg">
                {baselineItem.methodName}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-2 px-4 pb-3">
          <div className="space-y-1">
            {baselineItem.values?.map((item, index) => {
              // Convert rawValueInFeet to the selected unit
              let displayValue = item.value;
              if (item.rawValueInFeet !== undefined) {
                displayValue = formatDistance(item.rawValueInFeet, unit);
              }

              return (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.label}:</span>
                  <span className="font-semibold text-deep_space_blue">
                    {displayValue}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="px-3 py-2 flex items-center justify-between border-t border-sky_blue_light-700">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUseBaseline}
            className="btn-outline text-xs py-1 px-2 h-auto"
          >
            Use this Baseline
          </Button>
          <button
            onClick={() => deleteBaseline(baselineItem.id)}
            className="p-1 rounded hover:bg-destructive/10 active:bg-destructive/20 text-destructive transition-all"
            aria-label="Delete baseline"
          >
            <Trash2 size={16} />
          </button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Measurements Sections */}
      {measurements.length > 0 ? (
        <>
          {/* Favourites Section */}
          {measurements.filter((m) => m.isFavorite).length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold mb-4 text-deep_space_blue">
                Favourites ({measurements.filter((m) => m.isFavorite).length})
              </h2>
              {measurements
                .filter((m) => m.isFavorite)
                .slice()
                .reverse()
                .map((measurement) => renderMeasurementCard(measurement))}
            </div>
          )}

          {/* All Stored Values Section */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold mb-4 text-deep_space_blue">
              All Stored Values ({measurements.length})
            </h2>
            {measurements
              .slice()
              .reverse()
              .map((measurement) => renderMeasurementCard(measurement))}
          </div>
        </>
      ) : (
        <div
          className="text-sm"
          style={{ color: "var(--color-muted-foreground)" }}
        >
          No modifications stored yet. Set a baseline and make some subjective
          modifications.
        </div>
      )}

      {/* Previous Baselines Section */}
      {previousBaselines.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold mb-4 text-deep_space_blue">
            Previous Baselines ({previousBaselines.length})
          </h2>
          {previousBaselines.map((baselineItem) =>
            renderBaselineCard(baselineItem)
          )}
        </div>
      )}
    </div>
  );
}
