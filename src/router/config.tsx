import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import SignIn from "../pages/signin/page";
import SignUp from "../pages/signup/page";
import History from "../pages/history/page";
import Settings from "../pages/settings/page";
import Result from "../pages/result/page";
import EmailSuccess from "../pages/email-verification/email-success";
import EmailFailure from "../pages/email-verification/email-failure";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/email-verification-success",
    element: <EmailSuccess />,
  },
  {
    path: "/email-verification-fail",
    element: <EmailFailure />,
  },
  {
    path: "/history",
    element: <History />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/result",
    element: <Result />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
