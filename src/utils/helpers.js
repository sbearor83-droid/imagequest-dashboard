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

// Roll up managed-IT metrics for a set of clients. Rates are endpoint-weighted
// averages over the clients that report them (newly onboarded clients may not yet).
export function summarizeClients(clients) {
  const endpoints = clients.reduce((sum, c) => sum + (c.endpoints || 0), 0);
  const weighted = (key) => {
    const reporting = clients.filter(c => typeof c[key] === 'number' && c.endpoints);
    const weight = reporting.reduce((sum, c) => sum + c.endpoints, 0);
    if (!weight) return null;
    return Math.round((reporting.reduce((sum, c) => sum + c[key] * c.endpoints, 0) / weight) * 10) / 10;
  };
  const patchCompliance = weighted('patchCompliance');
  const patchedEndpoints = patchCompliance === null ? null : Math.round(endpoints * patchCompliance / 100);
  return {
    clientCount: clients.length,
    endpoints,
    patchCompliance,
    patchedEndpoints,
    unpatchedEndpoints: patchedEndpoints === null ? null : endpoints - patchedEndpoints,
    avgResponseMinutes: weighted('avgResponseMinutes'),
    slaMet: weighted('slaMet')
  };
}
