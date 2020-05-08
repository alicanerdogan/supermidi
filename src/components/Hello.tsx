import * as React from "react";
import { twStyled } from "utils/styles";
import * as tw from "tailwind-in-js";

import WebMidi from "webmidi";
import player, { InstrumentName } from "soundfont-player";
import { instruments } from "utils/instruments";

export interface HelloProps {
  compiler: string;
  framework: string;
}

const Card = twStyled.div(
  tw.max_w_sm,
  tw.mx_auto,
  tw.bg_white,
  tw.shadow_md,
  tw.rounded_lg,
  tw.sm_flex,
  tw.sm_items_center,
  tw.px_6,
  tw.py_4
);

export const Hello: React.FC<HelloProps> = () => {
  const [selectedInstrument, setInstrument] = React.useState<InstrumentName>(
    "acoustic_grand_piano"
  );

  const [isWebMidiEnabled, setWebMidiEnabled] = React.useState(false);
  React.useEffect(() => {
    WebMidi.enable((err: any) => {
      if (!err) {
        setWebMidiEnabled(true);
      }
    });
  }, []);

  const [isInstrumentInitialized, setInstrumentInitialized] = React.useState(
    false
  );
  const audioContextRef = React.useRef(new AudioContext());
  React.useEffect(() => {
    if (!isWebMidiEnabled) {
      return;
    }

    const keystation = WebMidi.inputs[1];

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
          instrument.play(noteSignature);
        });

        setInstrumentInitialized(true);
      });
  }, [isWebMidiEnabled, selectedInstrument]);

  return (
    <Card>
      <select
        onChange={(ev) => {
          setInstrument(ev.target.value as InstrumentName);
        }}
        disabled={!isInstrumentInitialized}
      >
        {instruments.map((instrument) => (
          <option
            key={instrument}
            value={instrument}
            selected={selectedInstrument === instrument}
          >
            {instrument}
          </option>
        ))}
      </select>
    </Card>
  );
};
