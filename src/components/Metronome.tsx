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
  private soundHz: number;
  private tick: OscillatorNode | undefined;
  private tickVolume: GainNode | undefined;

  constructor(audioCtx: AudioContext) {
    this.playing = false;
    this.soundHz = 1000;
    this.audioCtx = audioCtx;
  }

  private scheduleTickAt(timeInMs: number) {
    const time = timeInMs / 1000;
    // Silence the click.
    const tickVolume = this.tickVolume as GainNode;
    tickVolume.gain.cancelScheduledValues(time);
    tickVolume.gain.setValueAtTime(0, time);

    // Audible click sound.
    tickVolume.gain.linearRampToValueAtTime(1, time + 0.001);
    tickVolume.gain.linearRampToValueAtTime(0, time + 0.001 + 0.01);
  }

  private timeoutId: NodeJS.Timeout | undefined;
  private scheduleTicksForInterval() {
    if (!this.tempo) {
      throw new Error("Tempo has not been set");
    }
    const schedulingInterval = 1024;
    const tempoInterval = (60 * 1000) / this.tempo;
    const now = this.audioCtx.currentTime * 1000;
    const start = now;
    const end = start + schedulingInterval;
    const offset = Math.floor(schedulingInterval / tempoInterval);
    const tickCount = 1 + offset;

    const t = start % tempoInterval;

    if (end - start + t >= tempoInterval) {
      for (let i = 0; i < tickCount; i++) {
        const time = start - t + (i + 1) * tempoInterval;
        this.scheduleTickAt(time);
      }
    }

    this.timeoutId = setTimeout(() => {
      this.scheduleTicksForInterval();
    }, schedulingInterval);
  }

  start(tempo: number) {
    if (this.playing) {
      return;
    }

    this.tempo = tempo;
    this.playing = true;

    // Initialize
    this.tick = this.audioCtx.createOscillator();
    this.tickVolume = this.audioCtx.createGain();
    this.tick.type = "sine";
    this.tick.frequency.value = this.soundHz;
    this.tickVolume.gain.value = 0;
    this.tick.connect(this.tickVolume);
    this.tickVolume.connect(this.audioCtx.destination);

    this.tick.start(0); // No offset, start immediately.
    this.scheduleTickAt(0);
    this.scheduleTicksForInterval();
  }

  updateTempo(tempo: number) {
    this.tempo = tempo;
  }

  stop() {
    if (!this.playing) {
      return;
    }

    if (this.timeoutId !== undefined) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = undefined;

    this.playing = false;
    this.tickVolume && this.tickVolume.disconnect();
    this.tick && this.tick.disconnect();
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
      if (metronomeRef.current.isPlaying()) {
        metronomeRef.current.updateTempo(value);
      } else {
        metronomeRef.current.start(value);
      }
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

// type OnTickCallback = (time: number) => void;
