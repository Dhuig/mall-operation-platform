import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

function turnOnSafeMonitor(Vue, env) {
	if(env !== "development") {
		Sentry.init({
			Vue,
			dsn: "https://ca80814ec5c74038a10eb36fdb42c18c@o503808.ingest.sentry.io/5609100",
			integrations: [
				new Integrations.BrowserTracing(),
			],
			tracesSampleRate: 1.0,
		});
	}
}

export default turnOnSafeMonitor;
