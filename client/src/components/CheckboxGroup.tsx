import { type ReactNode } from "react";

export function CheckboxGroup({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="field">
      <legend>{legend}</legend>
      <div className="checkbox-group">{children}</div>
    </fieldset>
  );
}
