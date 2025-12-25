import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
        className="relative border-2 border-sky_blue_light-700"
      >
        <CardContent className="p-3 pr-10">
          <div className="flex items-center gap-3">
            <div
              className="text-4xl font-bold text-deep_space_blue"
              style={{ fontSize: "36px" }}
            >
              {sum}
            </div>
            <div className="flex-1 space-y-1 text-sm">
              <div>
                FW: {formatDistance(measurement.distanceFromFrontWall, unit)}, SW:{" "}
                {formatDistance(measurement.distanceFromSideWall, unit)}
                {measurement.listeningPosition &&
                  `, LP: ${formatDistance(measurement.listeningPosition, unit)}`}
              </div>
              <div>
                B: {measurement.bass}, T: {measurement.treble}, V:{" "}
                {measurement.vocals}, S: {measurement.soundstage}
              </div>
            </div>
          </div>
          <button
            onClick={() => deleteMeasurement(measurement.id)}
            className="absolute top-2 right-2 p-1 rounded hover:bg-destructive/10 active:bg-destructive/20 text-destructive transition-all"
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
        </CardContent>
        <CardFooter className="p-3 pt-0 flex justify-between items-center">
          <button
            onClick={() =>
              updateMeasurement({
                id: measurement.id,
                updates: { isFavorite: !measurement.isFavorite },
              })
            }
            className="p-1 rounded hover:bg-princeton_orange/10 active:bg-princeton_orange/20 transition-all"
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
          <div className="text-right text-xs text-muted-foreground">
            {new Date(measurement.createdAt).toLocaleString()}
          </div>
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
