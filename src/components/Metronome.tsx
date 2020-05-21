import * as React from "react";
import styled from "styled-components";
import { twStyled, twCss } from "utils/styles";
import * as tw from "tailwind-in-js";

import { Slider } from "./Slider";
import { ToggleButton } from "./ToggleButton";

export interface MetronomeProps {}

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
export const MetronomeStyle = styled.div``;

let audioContext: AudioContext | undefined = undefined;
function getAudioContext() {
  if (audioContext) {
    return audioContext;
  }
  audioContext = new (window.AudioContext ||
    ((window as any).webkitAudioContext as AudioContext))();
  return audioContext;
}

class BaseMetronome {
  private tempo: number | undefined;
  private playing: boolean;
  private audioCtx: AudioContext;
  private scheduledTicks: number;
  private soundHz: number;
  private tick: OscillatorNode;
  private tickVolume: GainNode;

  constructor(audioCtx: AudioContext, ticks?: number) {
    this.playing = false;

    this.soundHz = 1000;
    this.scheduledTicks = ticks || 1000;

    this.audioCtx = audioCtx;
    this.tick = this.audioCtx.createOscillator();
    this.tickVolume = this.audioCtx.createGain();

    this.tick.type = "sine";
    this.tick.frequency.value = this.soundHz;
    this.tickVolume.gain.value = 0;

    this.tick.connect(this.tickVolume);
    this.tickVolume.connect(this.audioCtx.destination);
  }

  clickAtTime(time: number) {
    // Silence the click.
    this.tickVolume.gain.cancelScheduledValues(time);
    this.tickVolume.gain.setValueAtTime(0, time);

    // Audible click sound.
    this.tickVolume.gain.linearRampToValueAtTime(1, time + 0.001);
    this.tickVolume.gain.linearRampToValueAtTime(0, time + 0.001 + 0.01);
  }

  start(tempo: number, callbackFn?: OnTickCallback) {
    this.tempo = tempo;
    this.playing = true;

    const timeoutDuration = 60 / this.tempo;

    this.tick.start(0); // No offset, start immediately.
    let now = this.audioCtx.currentTime;

    // Schedule all the clicks ahead.
    for (let i = 0; i < this.scheduledTicks; i++) {
      this.clickAtTime(now);
      const x = now;
      callbackFn && setTimeout(() => callbackFn(x), now * 1000);
      now += timeoutDuration;
    }
  }

  stop() {
    this.playing = false;
    this.tickVolume.gain.value = 0;

    this.tickVolume.disconnect();
    this.tick.disconnect();

    this.tick = this.audioCtx.createOscillator();
    this.tickVolume = this.audioCtx.createGain();

    this.tick.type = "sine";
    this.tick.frequency.value = this.soundHz;
    this.tickVolume.gain.value = 0;

    this.tick.connect(this.tickVolume);
    this.tickVolume.connect(this.audioCtx.destination);
  }

  isPlaying() {
    return this.playing;
  }
}

function useMetronome({ initialFreq }: { initialFreq?: number } = {}) {
  const [isEnabled, setEnabled] = React.useState(false);
  const toggleEnabled = React.useCallback(() => {
    setEnabled(!isEnabled);
  }, [isEnabled]);
  const [value, setValue] = React.useState(initialFreq || 60);
  const metronomeRef = React.useRef(new BaseMetronome(getAudioContext()));

  React.useEffect(() => {
    if (isEnabled) {
      metronomeRef.current.stop();
      metronomeRef.current.start(value);
    } else {
      metronomeRef.current.stop();
    }
  }, [isEnabled, value]);

  return {
    minFreq: 30,
    maxFreq: 240,
    precision: 0,
    value,
    setValue,
    isEnabled,
    toggleEnabled,
  };
}

export const Metronome: React.FC<MetronomeProps> = () => {
  const {
    value,
    setValue,
    minFreq,
    maxFreq,
    isEnabled,
    toggleEnabled,
    precision,
  } = useMetronome();

  return (
    <MetronomeStyle>
      <ControlInput>
        <ControlInputHeader>
          <ControlInputTitle>{"Tempo"}</ControlInputTitle>
          <ToggleButton isActive={isEnabled} toggle={toggleEnabled} />
        </ControlInputHeader>
        <div css={twCss(tw.h_10)} />
        <Slider
          min={minFreq}
          max={maxFreq}
          precision={precision}
          value={value}
          onChange={setValue}
          disabled={!isEnabled}
        />
      </ControlInput>
    </MetronomeStyle>
  );
};

type OnTickCallback = (time: number) => void;
