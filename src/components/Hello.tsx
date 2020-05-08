import * as React from "react";
import { twStyled, twCss } from "utils/styles";
import * as tw from "tailwind-in-js";

import WebMidi, { Input } from "webmidi";
import player, { InstrumentName } from "soundfont-player";
import { instruments } from "utils/instruments";

export interface HelloProps {
  compiler: string;
  framework: string;
}

const selectClassNames = [
  tw.bg_white,
  tw.w_full,
  tw.border,
  tw.border_gray_400,
  tw.hover_border_gray_500,
  tw.px_4,
  tw.py_2,
  tw.pr_8,
  tw.rounded,
  tw.shadow,
  tw.leading_tight,
  tw.focus_outline_none,
  tw.focus_shadow_outline,
  tw.appearance_none,
];
const disabledSelectClassNames = [
  ...selectClassNames,
  tw.bg_gray_200,
  tw.cursor_not_allowed,
  tw.pointer_events_none,
];

const selectStyle = twCss(...selectClassNames);
const disabledSelectStyle = twCss(...disabledSelectClassNames);

const SelectContainer = twStyled.div(tw.relative, tw.w_full);
const SelectIcon = twStyled.svg(
  tw.fill_current,
  tw.h_6,
  tw.pointer_events_none,
  tw.absolute,
  tw.block,
  tw.inset_y_0,
  tw.right_0,
  tw.text_gray_700,
  tw.h_full,
  tw.p_2
);

const Card = twStyled.div(
  tw.max_w_md,
  tw.mx_auto,
  tw.bg_white,
  tw.shadow_md,
  tw.rounded_lg,
  tw.sm_items_center,
  tw.px_6,
  tw.py_6
);

const Label = twStyled.label(
  tw.block,
  tw.uppercase,
  tw.tracking_wide,
  tw.text_gray_700,
  tw.text_xs,
  tw.font_bold,
  tw.mb_2
);

const Spacer = twStyled.div(tw.block, tw.h_8);

export const HelloStyle = twStyled.div(tw.p_8);

export const Hello: React.FC<HelloProps> = () => {
  const [selectedInstrument, setInstrument] = React.useState<InstrumentName>(
    "acoustic_grand_piano"
  );

  const [isWebMidiEnabled, setWebMidiEnabled] = React.useState(false);
  React.useEffect(() => {
    WebMidi.enable((err: any) => {
      if (err) {
        console.error(err);
        return;
      }
      setWebMidiEnabled(true);
    });
  }, []);

  const [isInstrumentInitialized, setInstrumentInitialized] = React.useState(
    false
  );
  const [selectedMidiController, setSelectedMidiController] = React.useState<
    string | undefined
  >(undefined);
  const audioContextRef = React.useRef(new AudioContext());
  React.useEffect(() => {
    if (!selectedMidiController) {
      return;
    }

    const keystation = WebMidi.getInputById(selectedMidiController);

    if (!keystation) {
      return;
    }

    setInstrumentInitialized(false);
    keystation.removeListener();

    player
      .instrument(audioContextRef.current, selectedInstrument)
      .then((instrument) => {
        keystation.addListener("noteon", "all", (event) => {
          const note = event.note;
          const noteSignature = `${note.name}${note.octave}`;
          instrument.play(noteSignature, undefined, {});
        });

        setInstrumentInitialized(true);
      })
      .catch(() => {
        setInstrument("acoustic_grand_piano");
      });
  }, [selectedMidiController, selectedInstrument]);

  const controllers: Input[] = isWebMidiEnabled ? WebMidi.inputs : [];

  return (
    <HelloStyle>
      <Card>
        <Label>{"Midi Controllers"}</Label>
        <SelectContainer>
          <select
            css={isWebMidiEnabled ? selectStyle : disabledSelectStyle}
            onChange={(ev) => {
              setSelectedMidiController(ev.target.value);
            }}
            disabled={!isWebMidiEnabled}
            value={selectedMidiController}
          >
            <option hidden>{"Please select a midi controller"}</option>
            {controllers.map((input) => (
              <option key={input.name} value={input.id}>
                {input.name}
              </option>
            ))}
          </select>
          <SelectIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </SelectIcon>
        </SelectContainer>
        <Spacer />
        <Label>{"Instrument"}</Label>
        <SelectContainer>
          <select
            css={isInstrumentInitialized ? selectStyle : disabledSelectStyle}
            onChange={(ev) => {
              setInstrument(ev.target.value as InstrumentName);
            }}
            disabled={!isInstrumentInitialized}
            value={selectedInstrument}
          >
            {instruments.map((instrument) => (
              <option key={instrument} value={instrument}>
                {instrument}
              </option>
            ))}
          </select>
          <SelectIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </SelectIcon>
        </SelectContainer>
      </Card>
    </HelloStyle>
  );
};
