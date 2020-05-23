import * as React from "react";
import { twStyled, twCss } from "utils/styles";
import * as tw from "tailwind-in-js";
import styled from "styled-components";
import WebMidi, { Input } from "webmidi";
import player, { InstrumentName } from "soundfont-player";

import { instruments } from "utils/instruments";
import { ControlPanel } from "./ControlPanel";
import { SoundControls, useSoundControls } from "./SoundControl";
import { Metronome } from "./Metronome";
import { usePiano3DMidiController } from "./Piano3DMidiController";

const LazyLoadedPiano3D = React.lazy(() => import("./Piano3D"));

export interface HelloProps {
  compiler: string;
  framework: string;
}

const ErrorBanner = twStyled.div(
  tw.flex,
  tw.bg_gray_200,
  tw.border_t_4,
  tw.border_pink_500,
  tw.rounded_b,
  tw.text_gray_900,
  tw.px_4,
  tw.py_3,
  tw.shadow_md,
  tw.items_center
);

const ErrorIconStyle = twCss(
  tw.fill_current,
  tw.h_6,
  tw.w_6,
  tw.mr_4,
  tw.text_pink_800
);

const ErrorContent = twStyled.p(tw.text_sm);

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
  tw.text_sm,
  tw.font_bold,
  tw.mb_2
);

const ControlPanelTitle = twStyled.h2(
  tw.text_base,
  tw.text_gray_700,
  tw.font_bold,
  tw.uppercase,
  tw.tracking_wide
);
const ControlPanelHeader = twStyled.div(tw.mb_2);

const Spacer = twStyled.div(tw.block, tw.h_8);

const TogglePiano3DButton = styled.button`
  position: fixed;
  right: 0;
  bottom: 0;
  width: 160px;
  ${twCss(
    tw.bg_blue_500,
    tw.hover_bg_blue_600,
    tw.text_white,
    tw.rounded,
    tw.py_2,
    tw.px_4,
    tw.mr_2,
    tw.mb_2
  )}
`;

const Piano3DContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 72px;
  width: 100vw;
  height: calc(100vh - 72px);
  background: #edf2f7;
`;

export const HelloStyle = twStyled.div(tw.p_8, tw.relative);

function usePlayOptions(soundControls: SoundControls) {
  const soundControlsAsList = Object.entries(soundControls);
  const key = soundControlsAsList
    .map(([, soundControl]) => `${soundControl.isEnabled}${soundControl.value}`)
    .join("/");
  return React.useMemo(() => {
    return soundControlsAsList.reduce((options, [name, soundControl]) => {
      if (soundControl.isEnabled) {
        options[name] = soundControl.value;
      }
      return options;
    }, {} as Record<keyof SoundControls, number>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

export const Hello: React.FC<HelloProps> = () => {
  const piano3dMidiController = usePiano3DMidiController();
  const [isPianoShown, setPianoShown] = React.useState(true);
  const togglePianoVisibility = React.useCallback(() => {
    document.getElementsByTagName("html")[0].style.overflow = isPianoShown
      ? ""
      : "hidden";
    setPianoShown(!isPianoShown);
  }, [isPianoShown]);

  const soundControls = useSoundControls();
  const playOptions = usePlayOptions(soundControls);

  const [selectedInstrument, setInstrument] = React.useState<InstrumentName>(
    "acoustic_grand_piano"
  );

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isWebMidiEnabled, setWebMidiEnabled] = React.useState(false);
  React.useEffect(() => {
    WebMidi.enable((err: any) => {
      if (err) {
        console.error(err);
        setError(err.message || err.toString());
        return;
      }
      setWebMidiEnabled(true);
    });
  }, []);

  const [selectedMidiController, setSelectedMidiController] = React.useState<
    string | undefined
  >(undefined);
  const [instrumentPlayer, setInstrumentPlayer] = React.useState<
    player.Player | undefined
  >(undefined);
  const audioContextRef = React.useRef(new AudioContext());
  React.useEffect(() => {
    if (!selectedMidiController) {
      return;
    }

    const keystation =
      selectedMidiController === piano3dMidiController.id
        ? piano3dMidiController
        : WebMidi.getInputById(selectedMidiController);

    if (!keystation) {
      return;
    }

    setInstrumentPlayer(undefined);
    keystation.removeListener();

    player
      .instrument(audioContextRef.current, selectedInstrument)
      .then((player) => {
        setInstrumentPlayer(player);
      })
      .catch(() => {
        setInstrument("acoustic_grand_piano");
      });
  }, [selectedMidiController, selectedInstrument, piano3dMidiController]);

  React.useEffect(() => {
    if (!instrumentPlayer) {
      return;
    }
    if (!selectedMidiController) {
      return;
    }
    const keystation =
      selectedMidiController === piano3dMidiController.id
        ? piano3dMidiController
        : WebMidi.getInputById(selectedMidiController);
    if (!keystation) {
      return;
    }
    keystation.removeListener();
    keystation.addListener("noteon", "all", (event) => {
      const note = event.note;
      const noteSignature = `${note.name}${note.octave}`;
      instrumentPlayer.play(noteSignature, undefined, playOptions);
    });
  }, [
    selectedMidiController,
    instrumentPlayer,
    playOptions,
    piano3dMidiController,
  ]);

  const controllers: Input[] = isWebMidiEnabled
    ? [...WebMidi.inputs, piano3dMidiController]
    : [piano3dMidiController];
  const isInstrumentInitialized = !!instrumentPlayer;

  return (
    <HelloStyle>
      <Card>
        {error && (
          <>
            <ErrorBanner role="alert">
              <svg css={ErrorIconStyle} viewBox="0 0 20 20">
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
              <ErrorContent>{error}</ErrorContent>
            </ErrorBanner>
            <Spacer />
          </>
        )}
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
      <Spacer />
      <Card>
        <ControlPanelHeader>
          <ControlPanelTitle>{"Metronome"}</ControlPanelTitle>
        </ControlPanelHeader>
        <Spacer />
        <Metronome />
      </Card>
      <Spacer />
      <Card>
        <ControlPanelHeader>
          <ControlPanelTitle>{"Control Panel"}</ControlPanelTitle>
        </ControlPanelHeader>
        <Spacer />
        <ControlPanel soundControls={soundControls} />
      </Card>
      {selectedMidiController === piano3dMidiController.id && (
        <>
          {isPianoShown && (
            <Piano3DContainer>
              <React.Suspense fallback={null}>
                <LazyLoadedPiano3D
                  onClickNote={piano3dMidiController.onNoteOn}
                />
              </React.Suspense>
            </Piano3DContainer>
          )}
          <TogglePiano3DButton onClick={togglePianoVisibility}>
            {isPianoShown ? "Hide Piano3D" : "Show Piano3D"}
          </TogglePiano3DButton>
        </>
      )}
    </HelloStyle>
  );
};
