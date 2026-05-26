import Link from "next/link";

const LINKS = [
  { label: "Home", path: "" },
  { label: "Body Map", path: "/body-map" },
  { label: "Case", path: "/case" },
  { label: "Reports", path: "/reports" },
  { label: "Doctor Questions", path: "/doctor-questions" },
  { label: "Share Packet", path: "/packet" },
  { label: "Files", path: "/files" },
];

export function CbcNav({
  active = "Home",
  compact = false,
  basePath = "/mike-mc/cancer-research",
}: {
  active?: string;
  compact?: boolean;
  basePath?: string;
}) {
  return (
    <nav className={`${compact ? "" : "cbc-glass mb-6 rounded-2xl border p-3 shadow-lg shadow-cyan-100/40 backdrop-blur"}`}>
      <div className="flex flex-wrap gap-2">
        {LINKS.map((link) => {
          const selected = active === link.label;
          const href = `${basePath}${link.path}`;
          return (
            <Link
              key={href}
              href={href}
              style={
                selected
                  ? { backgroundColor: "#0f2f5f", borderColor: "#0f2f5f", color: "#ffffff" }
                  : { backgroundColor: "#ffffff", borderColor: "#bfdbfe", color: "#0f2f5f" }
              }
              className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${
                selected
                  ? "border shadow-md shadow-blue-200"
                  : "border hover:bg-blue-50"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
