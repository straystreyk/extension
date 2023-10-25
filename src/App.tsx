import "./styles/App.scss";
import { MainPage } from "./pages/mainPage";
import {
  createMemoryRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import { CreateContact } from "./components/createContact";
import { ContactsList } from "./components/contactsList";
import { EditContact } from "./components/editContact";

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
        children: [
          {
            element: <ContactsList />,
            index: true,
          },
          {
            path: "create",
            element: <CreateContact />,
          },
          {
            path: "edit/:id",
            element: <EditContact />,
          },
        ],
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
