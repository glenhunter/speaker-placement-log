import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUnit } from "@/contexts/UnitContext";
import { formatDistance } from "@/lib/utils";

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
}) {
  const { unit } = useUnit();

  const renderMeasurementCard = (measurement) => {
    const sum = calculateScore(measurement);

    return (
      <Card
        key={measurement.id}
        className="border-2 border-sky_blue_light-700 overflow-hidden"
      >
        <CardHeader className="p-0">
          <div className="flex items-center justify-end">
            {measurement.baselineMethodName && (
              <div className="text-xs text-white bg-sky_blue_light-700 px-3 py-1.5 rounded-bl-lg">
                {measurement.baselineMethodName}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-4 pb-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Column 1: Measurements */}
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex gap-2">
                <span className="text-gray-600">Front Wall:</span>
                <span className="font-semibold text-deep_space_blue">
                  {formatDistance(measurement.distanceFromFrontWall, unit)}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-600">Side Wall:</span>
                <span className="font-semibold text-deep_space_blue">
                  {formatDistance(measurement.distanceFromSideWall, unit)}
                </span>
              </div>
              {measurement.listeningPosition && (
                <div className="flex gap-2">
                  <span className="text-gray-600">Seat:</span>
                  <span className="font-semibold text-deep_space_blue">
                    {formatDistance(measurement.listeningPosition, unit)}
                  </span>
                </div>
              )}
            </div>

            {/* Column 2: Subjective Ratings */}
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex gap-2">
                <span className="text-gray-600">Bass:</span>
                <span className="font-semibold text-deep_space_blue">
                  {measurement.bass}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-600">Treble:</span>
                <span className="font-semibold text-deep_space_blue">
                  {measurement.treble}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-600">Vocals:</span>
                <span className="font-semibold text-deep_space_blue">
                  {measurement.vocals}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-600">Soundstage:</span>
                <span className="font-semibold text-deep_space_blue">
                  {measurement.soundstage}
                </span>
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
          <div className="text-base font-bold text-deep_space_blue">
            {sum}
          </div>
          <div className="text-center text-xs text-muted-foreground">
            {new Date(measurement.createdAt).toLocaleString()}
          </div>
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

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-deep_space_blue">
        Modifications
      </h2>
      {measurements.length > 0 ? (
        <div className="space-y-6">
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
        </div>
      ) : (
        <div
          className="text-sm"
          style={{ color: "var(--color-muted-foreground)" }}
        >
          No modifications stored yet. Set a baseline and make some subjective
          modifications.
        </div>
      )}
    </>
  );
}
