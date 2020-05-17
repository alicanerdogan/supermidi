import * as React from "react";
import styled from "styled-components";
import { applyAnchorPosition } from "./applyAnchorPosition";

export interface Dimension {
  x: number;
  y: number;
  width: number;
  height: number;
}

type DimensionChangeListener = (dimension: Dimension) => void;
interface HostDimensionStore {
  get: () => Dimension;
  subscribe: (listener: DimensionChangeListener) => () => void;
}

const HostDimensionsContext = React.createContext<HostDimensionStore>({
  get: () => {
    throw new Error("Host Context does not exist");
  },
  subscribe: () => {
    throw new Error("Host Context does not exist");
  },
});

function useHostDimensions() {
  return React.useContext(HostDimensionsContext);
}

export interface OverlayProps {
  children?: React.ReactNode;
  zIndex?: number;
}

const OverlayStyle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
`;

class HostDimensionStoreInstance implements HostDimensionStore {
  current?: Dimension;
  subscribers: (DimensionChangeListener | undefined)[] = [];
  constructor(dimension?: Dimension) {
    this.current = dimension;
  }
  get() {
    if (!this.current) {
      throw new Error("Host Context does not exist");
    }
    return this.current;
  }
  subscribe(listener: DimensionChangeListener) {
    this.subscribers.push(listener);
    const index = this.subscribers.length - 1;
    return () => {
      this.subscribers[index] = undefined;
    };
  }
  set(dimension: Dimension) {
    this.current = dimension;
    this.subscribers.forEach((subscriber) => {
      subscriber && subscriber(dimension);
    });
  }
}

export const Overlay: React.FC<OverlayProps> = ({ children, zIndex }) => {
  const hostDimensionStoreRef = React.useRef<HostDimensionStoreInstance>(
    new HostDimensionStoreInstance()
  );
  const overlayRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) {
      return;
    }
    const hostDimensionStore = hostDimensionStoreRef.current;
    hostDimensionStore.set({
      x: 0,
      y: 0,
      width: overlay.clientWidth,
      height: overlay.clientHeight,
    });
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }
      hostDimensionStore.set({
        x: 0,
        y: 0,
        width: entry.target.clientWidth,
        height: entry.target.clientHeight,
      });
    });
    observer.observe(overlay);
    return () => observer.disconnect();
  }, []);

  return (
    <HostDimensionsContext.Provider value={hostDimensionStoreRef.current}>
      <OverlayStyle ref={overlayRef} style={{ zIndex }}>
        {children}
      </OverlayStyle>
    </HostDimensionsContext.Provider>
  );
};

export type AnchorPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "left-top"
  | "left-center"
  | "left-bottom"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "right-bottom"
  | "right-center"
  | "right-top"
  | "center";

export interface AnchorProps {
  children?: React.ReactNode;
  zIndex?: number;
  hostAnchorPosition: AnchorPosition;
  contentAnchorPosition: AnchorPosition;
  disableTransform?: boolean;
  UNSTABLE_matchWidth?: boolean;
  UNSTABLE_matchHeight?: boolean;
  UNSTABLE_clampWidth?: boolean;
  UNSTABLE_clampHeight?: boolean;
  UNSTABLE_offsetX?: string;
  UNSTABLE_offsetY?: string;
}

const AnchorStyle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  will-change: transform;
  transform: translate3d(0);
`;

export const Anchor: React.FC<AnchorProps> = ({
  children,
  zIndex,
  hostAnchorPosition,
  contentAnchorPosition,
  disableTransform,
  UNSTABLE_matchWidth,
  UNSTABLE_offsetX,
}) => {
  const hostDimensionsStore = useHostDimensions();
  const anchorRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) {
      return;
    }

    try {
      const hostDimension = hostDimensionsStore.get();
      applyAnchorPosition(
        anchor,
        hostDimension,
        hostAnchorPosition,
        contentAnchorPosition,
        { disableTransform }
      );
    } catch (error) {
      // DO NOTHING
    }

    const unsubscribe = hostDimensionsStore.subscribe((hostDimension) => {
      applyAnchorPosition(
        anchor,
        hostDimension,
        hostAnchorPosition,
        contentAnchorPosition,
        { disableTransform }
      );
    });

    return unsubscribe;
  }, [
    hostDimensionsStore,
    hostAnchorPosition,
    contentAnchorPosition,
    disableTransform,
  ]);

  React.useLayoutEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }
      const hostDimension = hostDimensionsStore.get();
      applyAnchorPosition(
        anchor,
        hostDimension,
        hostAnchorPosition,
        contentAnchorPosition,
        { disableTransform }
      );
    });
    observer.observe(anchor);
    return () => observer.disconnect();
  }, [
    contentAnchorPosition,
    hostAnchorPosition,
    hostDimensionsStore,
    disableTransform,
  ]);

  return (
    <AnchorStyle
      ref={anchorRef}
      style={{
        zIndex,
        width: UNSTABLE_matchWidth ? "100%" : "",
        left: UNSTABLE_offsetX || "0",
      }}
    >
      {children}
    </AnchorStyle>
  );
};
