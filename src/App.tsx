import type { ViewRoute } from "@/lib/types";
import { useState } from "react";
import FederalRoot from "./components/federal/FederalRoot";

const defaultRoute = { type: "federal:table" } as ViewRoute;
function App() {
  const [route, setRoute] = useState<ViewRoute>(defaultRoute);

  // switch render on route
  switch (route.type) {
    case "federal:table":
      return <FederalRoot route={route} setRoute={setRoute} />;
    case "federal:scorecard":
      return <></>;
    case "state:table":
      return <></>;
    case "state:scorecard":
      return <></>;
  }
}

export default App;
