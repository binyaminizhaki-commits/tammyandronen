import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { TammyRonen } from "./pages/TammyRonen";
import { Studio } from "./pages/Studio";
import { Residency } from "./pages/Residency";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "tammy-ronen", Component: TammyRonen },
      { path: "studio", Component: Studio },
      { path: "residency", Component: Residency },
      { path: "contact", Component: Contact },
      { path: "*", Component: NotFound },
    ],
  },
]);