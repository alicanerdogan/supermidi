import * as React from "react";
import { twCss, twStyled } from "utils/styles";
import { Overlay, Anchor } from "./Layout/Overlay";
import * as tw from "tailwind-in-js";
import { motion, PanInfo, useMotionValue } from "framer-motion";
import styled from "styled-components";

export interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange?: (value: number) => void;
  precision?: number;
  disabled?: boolean;
}

export const SliderStyle = twStyled.div(tw.py_1, tw.relative, tw.w_full);
const SliderBar = twStyled.div(
  tw.relative,
  tw.w_full,
  tw.h_2,
  tw.rounded_full,
  tw.bg_gray_200
);
const SliderProgressBar = styled(motion.div)`
  ${twCss(tw.absolute, tw.h_2, tw.rounded_full, tw.bg_teal_600, tw.w_full)}
`;

const SliderHandle = styled(motion.div)`
  ${twCss(
    tw.h_4,
    tw.w_4,
    tw.flex,
    tw.items_center,
    tw.justify_center,
    tw.rounded_full,
    tw.bg_white,
    tw.shadow,
    tw.border,
    tw.border_gray_300
  )}
`;
const SliderHandleTooltip = twStyled.div();
const SliderHandleTooltipText = twStyled.div(
  tw.bg_black,
  tw.shadow_md,
  tw.text_white,
  tw.truncate,
  tw.text_xs,
  tw.rounded,
  tw.py_1,
  tw.px_4,
  tw.text_center
);

export const Slider: React.FC<SliderProps> = React.memo(
  ({ min, max, value, onChange, precision, disabled }: SliderProps) => {
    const sliderBarRef = React.useRef<HTMLDivElement>(null);

    const relativeValue = (value - min) / (max - min);
    const x = useMotionValue(0);

    const precise = React.useCallback(
      (n: number) => {
        return precision ? n.toFixed(precision) : n.toFixed(0);
      },
      [precision]
    );

    const [placeholderValue, setPlaceholderValue] = React.useState(
      precise(value)
    );

    const [dragConstraints, setDragConstraints] = React.useState({
      left: 0,
      right: Infinity,
    });
    React.useLayoutEffect(() => {
      const sliderBar = sliderBarRef.current;
      if (!sliderBar) {
        throw new Error("SliderBar does not exist");
      }
      const width = sliderBar.offsetWidth;
      setDragConstraints({ left: 0, right: width });
    }, []);

    React.useLayoutEffect(() => {
      const sliderBar = sliderBarRef.current;
      if (!sliderBar) {
        throw new Error("SliderBar does not exist");
      }
      const width = sliderBar.offsetWidth;
      const xValue = width * relativeValue;
      x.set(xValue);
    }, [relativeValue]);

    React.useEffect(
      () =>
        x.onChange((latestX) => {
          const sliderBar = sliderBarRef.current;
          if (!sliderBar) {
            throw new Error("SliderBar does not exist");
          }
          const width = sliderBar.offsetWidth;
          const newValue = Math.max(
            Math.min(min + (latestX / width) * (max - min), max),
            min
          );
          setPlaceholderValue(precise(newValue));
        }),
      [min, max, precise]
    );
    const onSliderHandleDragEnd = React.useCallback(
      (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (!onChange) {
          return;
        }
        const sliderBar = sliderBarRef.current;
        if (!sliderBar) {
          throw new Error("SliderBar does not exist");
        }
        const width = sliderBar.offsetWidth;
        const newValue = Math.max(
          Math.min(min + (x.get() / width) * (max - min), max),
          min
        );
        onChange(newValue);
      },
      [onChange, min, max]
    );

    const onSliderClick = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const sliderBar = sliderBarRef.current;
        if (!sliderBar) {
          throw new Error("SliderBar does not exist");
        }
        const offsetX = event.clientX - sliderBar.getBoundingClientRect().x;
        x.set(offsetX);
        if (!onChange) {
          return;
        }
        const width = sliderBar.offsetWidth;
        const newValue = Math.max(
          Math.min(min + (offsetX / width) * (max - min), max),
          min
        );
        onChange(newValue);
      },
      []
    );

    return (
      <SliderStyle
        css={twCss(
          disabled ? tw.pointer_events_none : tw.pointer_events_auto,
          disabled ? tw.cursor_not_allowed : tw.cursor_pointer,
          disabled ? tw.opacity_25 : tw.opacity_100
        )}
      >
        <SliderBar ref={sliderBarRef} onClick={onSliderClick}>
          <Overlay>
            <Anchor
              hostAnchorPosition="top-left"
              contentAnchorPosition="top-left"
              UNSTABLE_matchWidth={true}
            >
              <SliderProgressBar style={{ width: x }} />
            </Anchor>
            <Anchor
              hostAnchorPosition="left-center"
              contentAnchorPosition="center"
            >
              <SliderHandle
                style={{ x }}
                drag="x"
                dragConstraints={dragConstraints}
                dragElastic={0.05}
                dragMomentum={false}
                whileTap={{ scale: 1.2 }}
                onDragEnd={onSliderHandleDragEnd}
              >
                <Overlay>
                  <Anchor
                    hostAnchorPosition="top-center"
                    contentAnchorPosition="bottom-center"
                  >
                    <SliderHandleTooltip>
                      <SliderHandleTooltipText>
                        {placeholderValue}
                      </SliderHandleTooltipText>
                      <svg
                        css={twCss(tw.text_black, tw.w_full, tw.h_2)}
                        x="0px"
                        y="0px"
                        viewBox="0 0 255 255"
                      >
                        <polygon
                          css={twCss(tw.fill_current)}
                          points="0,0 127.5,127.5 255,0"
                        ></polygon>
                      </svg>
                    </SliderHandleTooltip>
                  </Anchor>
                </Overlay>
              </SliderHandle>
            </Anchor>
          </Overlay>
        </SliderBar>
      </SliderStyle>
    );
  }
);

Slider.displayName = "Slider";
