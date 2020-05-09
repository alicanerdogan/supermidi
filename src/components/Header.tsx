import * as React from "react";
// import styled from "styled-components";
import { twStyled, twCss } from "utils/styles";
import * as tw from "tailwind-in-js";

import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as Title } from "../assets/title.svg";

const LogoStyle = twCss(tw.block, tw.h_10, tw.text_gray_900);
const TitleStyle = twCss(tw.block, tw.h_8, tw.ml_4, tw.text_gray_900);

export interface HeaderProps {}

export const HeaderStyle = twStyled.div(
  tw.flex,
  tw.pt_8,
  tw.items_center,
  tw.justify_center
);

export const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  return (
    <HeaderStyle>
      <Logo css={LogoStyle} />
      <Title css={TitleStyle} />
    </HeaderStyle>
  );
};
