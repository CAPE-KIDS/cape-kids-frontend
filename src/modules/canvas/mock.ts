import { CanvasStep } from "./types";

export const mockSteps: CanvasStep[] = [
  {
    id: "step_1",
    blocks: [
      {
        id: "title_1",
        type: "text",
        x: 150,
        y: 30,
        color: "#cccccc",
        width: 120,
        height: 60,
        data: {
          text: "Step 1",
        },
      },
      {
        id: "a",
        type: "text",
        x: 50,
        y: 150,
        color: "red",
        width: 100,
        height: 100,
        data: {
          text: "A",
        },
      },
      {
        id: "b",
        type: "image",
        x: 200,
        y: 150,
        color: "blue",
        width: 120,
        height: 80,
      },
    ],
  },
  {
    id: "step_2",
    blocks: [
      {
        id: "title_2",
        type: "text",
        x: 150,
        y: 30,
        color: "#cccccc",
        width: 120,
        height: 60,
        data: {
          text: "Step 2",
        },
      },
      {
        id: "c",
        type: "image",
        x: 50,
        y: 150,
        color: "red",
        width: 120,
        height: 80,
      },
      {
        id: "d",
        type: "image",
        x: 200,
        y: 150,
        color: "yellow",
        width: 120,
        height: 80,
      },
    ],
  },
  {
    id: "step_3",
    blocks: [
      {
        id: "title_3",
        type: "text",
        x: 150,
        y: 30,
        color: "#cccccc",
        width: 120,
        height: 60,
        data: {
          text: "Step 3",
        },
      },
      {
        id: "f",
        type: "image",
        x: 50,
        y: 150,
        color: "green",
        width: 120,
        height: 80,
      },
      {
        id: "g",
        type: "image",
        x: 200,
        y: 150,
        color: "gray",
        width: 120,
        height: 80,
      },
    ],
  },
];
