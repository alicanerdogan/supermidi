import * as THREE from "three";
import * as React from "react";
import * as drei from "drei";
import * as R3F from "react-three-fiber";
import * as ReactSpring from "react-spring/three";
import styled from "styled-components";

// function getRadian(degree: number) {
//   return Math.PI * (degree / 180);
// }

export type Vector = [number, number, number];
export type Dimension = Vector;
export type Coordinate = Vector;
export type Rotation = Vector;

function CameraControls() {
  return <drei.OrbitControls enabled={true} enableKeys={true} />;
}

function Plane({ position }: { position: Coordinate }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
      <meshStandardMaterial attach="material" color="#CBD5E0" />
    </mesh>
  );
}

function Box({
  position,
  color,
  rotationOnX,
  dimension,
  onPointerOut,
  onPointerOver,
  onPointerUp,
  onPointerDown,
  onClick,
}: {
  position: Coordinate;
  color: string;
  rotationOnX?: number;
  dimension: Dimension;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  onPointerUp?: () => void;
  onPointerDown?: () => void;
  onClick?: () => void;
}) {
  const boxRef = React.useRef<THREE.Mesh>();
  const geometryRef = React.useRef<THREE.BoxGeometry>();

  const relativePosition = [
    dimension[0] / 2,
    dimension[1] / -2,
    dimension[2] / 2,
  ] as [number, number, number];

  const { rotation } = ReactSpring.useSpring({
    rotation: [rotationOnX || 0, 0, 0],
    config: { mass: 0.5, tension: 100, friction: 10, precision: 0.0001 },
  });

  const [, setRendered] = React.useState(false);
  React.useLayoutEffect(() => {
    setRendered(true);
  }, []);

  return (
    <ReactSpring.animated.group
      ref={boxRef}
      position={position}
      rotation={rotation as any}
    >
      <mesh
        castShadow
        receiveShadow
        position={relativePosition}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onPointerUp={onPointerUp}
        onPointerDown={(ev) => {
          ev.stopPropagation();
          if (onPointerDown) {
            onPointerDown();
          }
        }}
        onClick={onClick}
      >
        <boxGeometry attach="geometry" args={dimension} ref={geometryRef} />
        <meshPhysicalMaterial
          attach="material"
          color={color}
          metalness={0}
          roughness={0.5}
          clearcoat={1}
          clearcoatRoughness={0}
          reflectivity={1}
        />
        {geometryRef.current && (
          <lineSegments>
            <edgesGeometry attach="geometry" args={[geometryRef.current]} />
            <lineBasicMaterial
              attach="material"
              args={[{ color: 0x3c3c3c, linewidth: 1 }]}
            />
          </lineSegments>
        )}
      </mesh>
    </ReactSpring.animated.group>
  );
}

function Key({
  position,
  color,
  dimension,
  onPointerOut,
  onPointerOver,
  onClick,
}: {
  position: Coordinate;
  color: string;
  isPressed?: boolean;
  dimension: Dimension;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
  onClick?: () => void;
}) {
  const [isPressed, setPressed] = React.useState(false);
  const onPointerDown = React.useCallback(() => {
    setPressed(true);
    onClick && onClick();
  }, [onClick]);
  const onPointerUp = React.useCallback(() => {
    setPressed(false);
  }, []);
  const rotationOnX = isPressed ? Math.PI * (7 / 180) : undefined;

  return (
    <Box
      position={position}
      color={color}
      dimension={dimension}
      rotationOnX={rotationOnX}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onPointerUp={onPointerUp}
      onPointerDown={onPointerDown}
    />
  );
}

export interface WhiteKeyProps {
  position: Coordinate;
  isPressed?: boolean;
  onClick?: () => void;
}
const WhiteKey: React.FC<WhiteKeyProps> = ({
  isPressed,
  position,
  onClick,
}) => {
  return (
    <Key
      position={position}
      color={"#f0f0f0"}
      isPressed={isPressed}
      dimension={[2, 2, 5]}
      onClick={onClick}
    />
  );
};

export interface BlackKeyProps {
  position: Coordinate;
  isPressed?: boolean;
  onClick?: () => void;
}
const BlackKey: React.FC<BlackKeyProps> = ({
  isPressed,
  position,
  onClick,
}) => {
  return (
    <Key
      position={position}
      color={"#000000"}
      isPressed={isPressed}
      dimension={[0.5, 0.5, 3]}
      onClick={onClick}
    />
  );
};

// function useGridHelper() {
//   const { scene } = useThree();
//   React.useEffect(() => {
//     const gridHelper = new THREE.GridHelper(100, 200, 0x0000ff, 0x808080);
//     scene.add(gridHelper);
//     const axesHelper = new THREE.AxesHelper(5);
//     scene.add(axesHelper);
//     return () => {
//       scene.remove(gridHelper);
//       scene.remove(axesHelper);
//     };
//   }, [scene]);
// }

function Octave({
  positionX,
  index,
  onClick,
}: {
  positionX: number;
  index: number;
  onClick?: ({ name: string, octave: number }) => void;
}) {
  const whiteKeys = [
    { position: [positionX - 6, 2, 0] as Coordinate, noteIndex: `C` },
    { position: [positionX - 4, 2, 0] as Coordinate, noteIndex: `D` },
    { position: [positionX - 2, 2, 0] as Coordinate, noteIndex: `E` },
    { position: [positionX, 2, 0] as Coordinate, noteIndex: `F` },
    { position: [positionX + 2, 2, 0] as Coordinate, noteIndex: `G` },
    { position: [positionX + 4, 2, 0] as Coordinate, noteIndex: `A` },
    { position: [positionX + 6, 2, 0] as Coordinate, noteIndex: `B` },
  ];
  const blackKeys = [
    {
      position: [positionX - 4.25, 2.5, 0] as Coordinate,
      noteIndex: `C#`,
    },
    {
      position: [positionX - 2.25, 2.5, 0] as Coordinate,
      noteIndex: `D#`,
    },
    {
      position: [positionX + 1.75, 2.5, 0] as Coordinate,
      noteIndex: `F#`,
    },
    {
      position: [positionX + 3.75, 2.5, 0] as Coordinate,
      noteIndex: `G#`,
    },
    {
      position: [positionX + 5.75, 2.5, 0] as Coordinate,
      noteIndex: `A#`,
    },
  ];
  return (
    <>
      {whiteKeys.map(({ position, noteIndex }, i) => (
        <WhiteKey
          key={i}
          position={position}
          onClick={() => onClick && onClick({ name: noteIndex, octave: index })}
        />
      ))}
      {blackKeys.map(({ position, noteIndex }, i) => (
        <BlackKey
          key={`black_${i}`}
          position={position}
          onClick={() => onClick && onClick({ name: noteIndex, octave: index })}
        />
      ))}
    </>
  );
}

function RenderedContent({
  onClickNote,
}: {
  onClickNote?: ({ name: string, octave: number }) => void;
}) {
  // useGridHelper();

  return (
    <>
      <CameraControls />
      <ambientLight intensity={0.5} />
      <spotLight
        intensity={0.8}
        position={[0, 150, 20]}
        angle={0.2}
        penumbra={1}
        castShadow
      />
      <Plane position={[0, 0, 0]} />
      <Octave positionX={-14} index={3} onClick={onClickNote} />
      <Octave positionX={0} index={4} onClick={onClickNote} />
      <Octave positionX={14} index={5} onClick={onClickNote} />
    </>
  );
}

export const Piano3DStyle = styled.div`
  height: 100%;
  canvas {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    overflow: hidden;
  }
`;

export function Piano3D({
  onClickNote,
}: {
  onClickNote?: ({ name: string, octave: number }) => void;
}) {
  return (
    <Piano3DStyle>
      <R3F.Canvas
        shadowMap
        camera={{ position: [0, 15, 5], fov: 50 }}
        onCreated={({ gl, scene }) => {
          scene.rotation.set(Math.PI * -0.1, 0, 0);
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          gl.outputEncoding = THREE.sRGBEncoding;
        }}
      >
        <RenderedContent onClickNote={onClickNote} />
      </R3F.Canvas>
    </Piano3DStyle>
  );
}

export default Piano3D;
