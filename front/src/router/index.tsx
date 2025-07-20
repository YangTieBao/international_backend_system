import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import EnterLoading from "../views/EnterLoading";
import routes from "./routes";

const Router = () => {
    const element = useRoutes(routes);

    return (
        <Suspense fallback={<EnterLoading />}>
            {element}
        </Suspense>
    );
};

export default Router;