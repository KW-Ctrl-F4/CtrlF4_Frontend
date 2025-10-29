import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import SignIn from "../pages/signin/page";
import SignUp from "../pages/signup/page";
import History from "../pages/history/page";
import Settings from "../pages/settings/page";
import Result from "../pages/result/page";
import EmailVerification from "../pages/email-verification/page";

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
    element: <EmailVerification />,
  },
  {
    path: "/email-verification-fail",
    element: <EmailVerification />,
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
