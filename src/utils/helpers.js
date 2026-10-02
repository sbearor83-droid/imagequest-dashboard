// Count an engagement's logged findings by severity (derived, so it never drifts from the findings list).
export function countFindingsBySeverity(findings) {
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const f of findings) {
    const key = f.severity.toLowerCase();
    if (key in counts) counts[key] += 1;
  }
  return counts;
}

export function exportDeliverableJson(engagement, findings) {
  const blob = new Blob([JSON.stringify({
    engagement,
    findings,
    generatedAt: new Date().toISOString()
  }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${engagement?.id || 'Audit'}_Security_Deliverable.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

// YYYY-MM-DD for a date `days` from today (form defaults)
export function dateInDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}
