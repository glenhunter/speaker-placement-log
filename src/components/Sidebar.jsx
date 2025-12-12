import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Sidebar({ measurements, updateMeasurement, deleteMeasurement }) {
  const exportToMarkdown = () => {
    let markdown = "# Speaker Placement Log\n\n";
    markdown += `Generated on: ${new Date().toLocaleString()}\n\n`;
    markdown += `Total Measurements: ${measurements.length}\n\n`;
    markdown += "---\n\n";

    measurements.slice().reverse().forEach((measurement, index) => {
      const sum =
        (parseInt(measurement.bass) || 0) +
        (parseInt(measurement.treble) || 0) +
        (parseInt(measurement.vocals) || 0) +
        (parseInt(measurement.soundstage) || 0);

      markdown += `## Measurement ${measurements.length - index}\n\n`;
      markdown += `**Score:** ${sum}\n\n`;
      markdown += `**Distance:**\n`;
      markdown += `- Front Wall: ${measurement.distanceFromFrontWall}\n`;
      markdown += `- Side Wall: ${measurement.distanceFromSideWall}\n\n`;
      markdown += `**Ratings:**\n`;
      markdown += `- Bass: ${measurement.bass}\n`;
      markdown += `- Treble: ${measurement.treble}\n`;
      markdown += `- Vocals: ${measurement.vocals}\n`;
      markdown += `- Soundstage: ${measurement.soundstage}\n\n`;
      markdown += `**Date:** ${new Date(measurement.createdAt).toLocaleString()}\n`;
      if (measurement.isFavorite) {
        markdown += `⭐ **Favorite**\n`;
      }
      markdown += "\n---\n\n";
    });

    // Create blob and download
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `speaker-placement-log-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderMeasurementCard = (measurement) => {
    const sum =
      (parseInt(measurement.bass) || 0) +
      (parseInt(measurement.treble) || 0) +
      (parseInt(measurement.vocals) || 0) +
      (parseInt(measurement.soundstage) || 0);

    return (
      <Card key={measurement.id} className="relative">
        <CardContent className="p-3 pr-10">
          <div className="flex items-center gap-3">
            <div className="text-4xl font-bold" style={{ fontSize: "36px" }}>
              {sum}
            </div>
            <div className="flex-1 space-y-1 text-sm">
              <div>
                FW: {measurement.distanceFromFrontWall}, SW:{" "}
                {measurement.distanceFromSideWall}
              </div>
              <div>
                B: {measurement.bass}, T: {measurement.treble}, V:{" "}
                {measurement.vocals}, S: {measurement.soundstage}
              </div>
            </div>
          </div>
          <button
            onClick={() => deleteMeasurement(measurement.id)}
            className="absolute top-2 right-2 p-1 rounded hover:bg-opacity-80 transition-colors"
            style={{ color: "var(--color-destructive)" }}
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
            className="p-1 rounded hover:bg-opacity-80 transition-colors"
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
              style={{
                color: measurement.isFavorite
                  ? "gold"
                  : "var(--color-muted-foreground)",
              }}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
          <div
            className="text-right"
            style={{
              fontSize: "10px",
              color: "var(--color-muted-foreground)",
            }}
          >
            {new Date(measurement.createdAt).toLocaleString()}
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <aside
      className="w-96 p-6 border-l overflow-y-auto"
      style={{
        backgroundColor: "var(--color-muted)",
        borderColor: "var(--color-border)",
      }}
    >
      {measurements.length > 0 ? (
        <div className="space-y-6">
          {/* Export Button */}
          <div className="flex justify-end">
            <Button onClick={exportToMarkdown} variant="outline" size="sm">
              Export to Markdown
            </Button>
          </div>

          {/* Favourites Section */}
          {measurements.filter((m) => m.isFavorite).length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold mb-4">
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
            <h2 className="text-xl font-bold mb-4">
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
          No measurements stored yet. Submit the form to save values.
        </div>
      )}
    </aside>
  );
}
