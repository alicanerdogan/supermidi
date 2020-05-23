import * as React from "react";
import { Input, InputEvents } from "webmidi";

const PIANO_3D_KEY = "__PIANO_3D__";

type InputEventKey = keyof InputEvents;

class Piano3DMidiController implements Input {
  connection: "pending" | "open" | "closed" = "open";
  id: string = PIANO_3D_KEY;
  manufacturer = "supermidi";
  name = "Piano3D";
  state: "connected" | "disconnected" = "connected";
  type: "input" = "input";
  private listeners: ((event: InputEvents["noteon"]) => void)[] = [];

  addListener<T extends InputEventKey>(
    type: T,
    channel: number | number[] | "all" | undefined,
    listener: (event: InputEvents[T]) => void
  ): Input {
    if (type !== "noteon" || channel !== "all") {
      throw new Error("Method not implemented.");
    }
    this.listeners.push(listener as any);
    return this;
  }
  removeListener<T extends InputEventKey>(): Input {
    // throw new Error("Method not implemented.");
    this.listeners = [];
    return this;
  }
  onNoteOn = ({ name, octave }) => {
    this.listeners.forEach((listener) => {
      listener({
        note: {
          name: name,
          octave: octave,
          number: 0,
        },
        velocity: 0,
        rawVelocity: 0,
        channel: 0,
        data: new Uint8Array(),
        target: this,
        timestamp: 0,
        type: "noteon",
      });
    });
  };

  on<T extends InputEventKey>(): Input {
    throw new Error("Method not implemented.");
  }
  getCcNameByNumber(): string | undefined {
    throw new Error("Method not implemented.");
  }
  getChannelModeByNumber(): string | undefined {
    throw new Error("Method not implemented.");
  }
  hasListener<T extends InputEventKey>(): boolean {
    throw new Error("Method not implemented.");
  }
}

export function usePiano3DMidiController() {
  const ref = React.useRef(new Piano3DMidiController());
  return ref.current;
}
