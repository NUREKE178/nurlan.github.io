import { html } from "./lib/preact.js";
import { useRoute, matchRoute, navigate } from "./router.js";
import { Shell } from "./components/shell.js";
import { Landing } from "./pages/Landing.js";
import { Overview } from "./pages/Overview.js";
import { ExperimentsList } from "./pages/ExperimentsList.js";
import { ExperimentBuilder } from "./pages/ExperimentBuilder.js";
import { Results } from "./pages/Results.js";
import { Insights } from "./pages/Insights.js";
import { Participants } from "./pages/Participants.js";
import { Reports } from "./pages/Reports.js";
import { Team } from "./pages/Team.js";
import { Settings } from "./pages/Settings.js";
import { ParticipantRunner } from "./pages/ParticipantRunner.js";

const DASHBOARD_ROUTES = [
  { pattern: "/app/overview", Page: Overview },
  { pattern: "/app/experiments", Page: ExperimentsList },
  { pattern: "/app/experiments/new", Page: ExperimentBuilder },
  { pattern: "/app/experiments/:id/edit", Page: ExperimentBuilder },
  { pattern: "/app/experiments/:id/results", Page: Results },
  { pattern: "/app/experiments/:id/insights", Page: Insights },
  { pattern: "/app/results", Page: Results },
  { pattern: "/app/insights", Page: Insights },
  { pattern: "/app/participants", Page: Participants },
  { pattern: "/app/reports", Page: Reports },
  { pattern: "/app/team", Page: Team },
  { pattern: "/app/settings", Page: Settings },
];

export function App() {
  const { path, query } = useRoute();

  if (path === "/" || path === "") return html`<${Landing} />`;

  if (path.startsWith("/r/")) {
    const params = matchRoute("/r/:id", path);
    return html`<${ParticipantRunner} experimentId=${params.id} preview=${false} />`;
  }

  if (path.startsWith("/app/experiments/") && path.endsWith("/preview")) {
    const params = matchRoute("/app/experiments/:id/preview", path);
    if (params) {
      return html`<${ParticipantRunner} experimentId=${params.id} preview=${true} />`;
    }
  }

  if (path.startsWith("/app")) {
    for (const route of DASHBOARD_ROUTES) {
      const params = matchRoute(route.pattern, path);
      if (params) {
        const Page = route.Page;
        return html`
          <${Shell} currentPath=${path}>
            <${Page} params=${params} query=${query} />
          <//>
        `;
      }
    }
    navigate("/app/overview");
    return null;
  }

  navigate("/");
  return null;
}
