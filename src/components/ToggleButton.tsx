import * as React from "react";
import { twCss } from "utils/styles";
import * as tw from "tailwind-in-js";
import { motion } from "framer-motion";
import styled from "styled-components";

export interface ToggleButtonProps {
  isActive: boolean;
  toggle?: () => void;
}

const ToggleButtonStyle = styled(motion.button)``;
const ToggleButtonIndicator = styled(motion.span)``;

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  isActive,
  toggle,
}: ToggleButtonProps) => {
  return (
    <ToggleButtonStyle
      animate={true}
      onClick={toggle}
      css={twCss(
        tw.flex,
        tw.w_8,
        tw.h_5,
        tw.px_1,
        tw.rounded_full,
        tw.shadow_inner,
        tw.focus_outline_none,
        tw.items_center,
        isActive ? tw.bg_blue_400 : tw.bg_gray_400,
        isActive ? tw.justify_end : tw.justify_start
      )}
    >
      <ToggleButtonIndicator
        animate={true}
        css={twCss(
          tw.block,
          tw.w_3,
          tw.h_3,
          tw.bg_white,
          tw.rounded_full,
          tw.shadow,
          tw.focus_shadow_outline
        )}
      />
    </ToggleButtonStyle>
  );
};

ToggleButton.displayName = "ToggleButton";
