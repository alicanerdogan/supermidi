import * as React from "react";
import { twStyled } from "utils/styles";
import * as tw from "tailwind-in-js";

import { Hello } from "./components/Hello";
import { Header } from "./components/Header";

const AppStyle = twStyled.div(tw.container, tw.mx_auto);

const App: React.SFC<{}> = () => {
  return (
    <AppStyle>
      <Header />
      <Hello compiler="TypeScript" framework="React" />
    </AppStyle>
  );
};

export default App;
