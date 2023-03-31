import { type NextPage } from "next";
import Head from "next/head";
import { CSSProperties, useRef, useState } from "react";
import {
  useDroppable,
  useDraggable,
  DndContext,
  DragEndEvent,
} from "@dnd-kit/core";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Chessy</title>
        <meta name="description" content="Chess" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen items-center justify-center">
        <ChessBoard />
      </div>
    </>
  );
};

type IPiece =
  | "wP"
  | "wR"
  | "wN"
  | "wB"
  | "wQ"
  | "wK"
  | "bP"
  | "bR"
  | "bN"
  | "bB"
  | "bQ"
  | "bK";

type IBoardState = { [x: number]: IPiece | undefined };

const initalState: IBoardState = {
  9: "wP",
  10: "wP",
  11: "wP",
  12: "wP",
  13: "wP",
  14: "wP",
  15: "wP",
  16: "wP",
  1: "wR",
  2: "wN",
  3: "wB",
  4: "wQ",
  5: "wK",
  6: "wB",
  7: "wN",
  8: "wR",
  57: "bR",
  58: "bN",
  59: "bB",
  60: "bQ",
  61: "bK",
  62: "bB",
  63: "bN",
  64: "bR",
  55: "bP",
  54: "bP",
  53: "bP",
  52: "bP",
  51: "bP",
  50: "bP",
  49: "bP",
  56: "bP",
};

const ChessBoard = () => {
  const [pieces, setPieces] = useState<IBoardState>(initalState);

  const render = () => {
    const renderRow = (i: number) => {
      const board = [];
      for (let j = 0; j < 8; j++) {
        board.push(
          <Box
            pos={i * 8 + j + 1}
            piece={pieces[i * 8 + j + 1]}
            key={`${i}${j}`}
          />
        );
      }
      return board;
    };

    const board = [];
    for (let i = 0; i < 8; i++) {
      board.push(
        <div key={i} className="flex">
          {renderRow(i)}
        </div>
      );
    }
    return board;
  };

  function handleDragEnd(event: DragEndEvent) {
    if (event.over) {
      const piece = pieces[event.active.id as number];
      if (!piece) return;
      const newLocation = pieces[event.over.id as number];
      if (!newLocation) {
        setPieces({
          ...pieces,
          [event.over.id as number]: piece,
          [event.active.id as number]: undefined,
        });
      }
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="relative flex flex-col shadow-md">
        <img
          src="/boards/8x8_wood.svg"
          className="pointer-events-none absolute h-full w-full select-none"
        />
        <div className="z-10">{render()}</div>
      </div>
    </DndContext>
  );
};

const Box: React.FC<{ piece?: IPiece; pos: number }> = ({ piece, pos }) => {
  const { isOver, setNodeRef, active } = useDroppable({
    id: pos,
  });
  const enabled = isOver && active?.id !== pos && piece === undefined;
  const style: CSSProperties = enabled
    ? {
        background: "black",
        opacity: 0.2,
      }
    : {};

  return (
    <div
      className={`flex h-12 w-12 items-center justify-center border border-transparent md:h-16 md:w-16 lg:h-24 lg:w-24`}
      ref={setNodeRef}
      style={style}
    >
      {piece && <Piece pos={pos} name={piece} />}
    </div>
  );
};

const Piece: React.FC<{ name?: IPiece; pos: number }> = ({ name, pos }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: pos,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : {
        transition: "all 70ms ease-in-out",
      };

  return (
    <>
      <img
        src={`/sets/chess_maestro_bw/${name}.svg`}
        className="cursor-pointer select-none"
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
      />
    </>
  );
};

export default Home;
