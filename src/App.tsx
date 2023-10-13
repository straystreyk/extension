import "./styles/App.scss";
import { MainPage } from "./pages/mainPage";
import {
  createMemoryRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import { CreateContact } from "./components/contactsSection";

const routes: RouteObject[] = [
  {
    path: "/",
    children: [
      {
        element: <MainPage />,
        index: true,
      },
      {
        path: "contacts",
        element: <CreateContact />,
      },
    ],
  },
];

const router = createMemoryRouter(routes, {
  initialEntries: ["/"],
});

export const App = () => {
  return (
    <div id="___SHIFRONIM_APP___">
      <RouterProvider router={router} />
    </div>
  );
};
