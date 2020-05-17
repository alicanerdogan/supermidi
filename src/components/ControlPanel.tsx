import * as React from "react";
import { twStyled, twCss } from "utils/styles";
import * as tw from "tailwind-in-js";

import { Slider } from "./Slider";
import { ToggleButton } from "./ToggleButton";
import { SoundControls } from "./SoundControl";

export interface ControlPanelProps {
  soundControls: SoundControls;
}

const ControlInputs = twStyled.div();
const ControlInput = twStyled.div();
const ControlInputHeader = twStyled.div(
  tw.flex,
  tw.justify_between,
  tw.items_center
);
const ControlInputTitle = twStyled.div(
  tw.block,
  tw.uppercase,
  tw.tracking_wide,
  tw.text_gray_700,
  tw.text_sm,
  tw.font_bold
);
export const ControlPanelStyle = twStyled.div();

export const ControlPanel: React.FC<ControlPanelProps> = ({
  soundControls,
}: ControlPanelProps) => {
  const soundControlsAsList = Object.values(soundControls);
  return (
    <ControlPanelStyle>
      <ControlInputs>
        {soundControlsAsList.map((soundControl, i) => (
          <>
            <ControlInput key={soundControl.name}>
              <ControlInputHeader>
                <ControlInputTitle>{soundControl.name}</ControlInputTitle>
                <ToggleButton
                  isActive={soundControl.isEnabled}
                  toggle={soundControl.toggleEnabled}
                />
              </ControlInputHeader>
              <div css={twCss(tw.h_10)} />
              <Slider
                min={soundControl.min}
                max={soundControl.max}
                precision={soundControl.precision}
                value={soundControl.value}
                onChange={soundControl.setValue}
                disabled={!soundControl.isEnabled}
              />
            </ControlInput>
            {soundControlsAsList.length - 1 !== i && (
              <div css={twCss(tw.h_8)} />
            )}
          </>
        ))}
      </ControlInputs>
    </ControlPanelStyle>
  );
};
