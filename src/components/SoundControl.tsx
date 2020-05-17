import * as React from "react";

export interface SoundControl {
  name: string;
  value: number;
  min: number;
  max: number;
  precision: number;
  isEnabled: boolean;
  toggleEnabled: () => void;
  setValue: (value: number) => void;
}
function useSoundControl({
  initialValue,
  min,
  max,
  name,
  precision,
}: {
  initialValue: number;
  min: number;
  max: number;
  name: string;
  precision: number;
}): SoundControl {
  const [value, setValue] = React.useState(initialValue);
  const [isEnabled, setEnabled] = React.useState(false);
  const toggleEnabled = React.useCallback(() => {
    setEnabled(!isEnabled);
  }, [isEnabled]);

  return {
    isEnabled,
    toggleEnabled,
    name,
    min,
    max,
    precision,
    value,
    setValue,
  };
}

export function useSoundControls() {
  const duration = useSoundControl({
    name: "Duration",
    min: 0.1,
    max: 5,
    initialValue: 0.5,
    precision: 2,
  });
  const attack = useSoundControl({
    name: "Attack",
    min: 0.01,
    max: 1,
    initialValue: 0.5,
    precision: 2,
  });
  const decay = useSoundControl({
    name: "Decay",
    min: 0.01,
    max: 1,
    initialValue: 0.5,
    precision: 2,
  });
  const sustain = useSoundControl({
    name: "Sustain",
    min: 0.01,
    max: 1,
    initialValue: 0.5,
    precision: 2,
  });
  const release = useSoundControl({
    name: "Release",
    min: 0.01,
    max: 1,
    initialValue: 0.5,
    precision: 2,
  });

  return { duration, attack, decay, sustain, release };
}

export type SoundControls = ReturnType<typeof useSoundControls>;
