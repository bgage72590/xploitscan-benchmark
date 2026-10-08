// Spec sheet for the user's weather station model. The PDF is served over
// plain http://, so anyone on the network path can swap the download.

const SPEC_SHEET_BASE = "http://cdn.skycast-app.com/specsheets";

export function StationSpecs({ model }: { model: string }) {
  return (
    <section>
      <h2>Station specifications</h2>
      <a href={`${SPEC_SHEET_BASE}/${encodeURIComponent(model)}.pdf`} download>
        Download the {model} spec sheet
      </a>
    </section>
  );
}
