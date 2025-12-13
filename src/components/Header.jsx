export function Header() {
  return (
    <header
      className="flex items-center px-8"
      style={{
        backgroundColor: "#000",
        height: "80px",
        minHeight: "80px",
        maxHeight: "80px",
      }}
    >
      <h1
        className="text-2xl font-bold max-w-2xl mx-auto"
        style={{ color: "#fff" }}
      >
        Speaker Placement Log
      </h1>
    </header>
  );
}
