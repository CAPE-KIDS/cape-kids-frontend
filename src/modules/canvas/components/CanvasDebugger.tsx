import React, { useState } from "react";
import { useCanvasStore } from "../store/useCanvasStore";

const CanvasDebugger = () => {
  const { activeStep } = useCanvasStore();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="fixed top-0 right-0 bg-black/20 text-white border border-gray-300 rounded shadow-lg w-full max-w-[300px] z-[500]">
      <button
        className="text-lg font-semibold cursor-pointer hover:opacity-80 bg-green-400 w-full"
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? "Hide" : "Show"} Debugger
      </button>

      <div
        className={
          isVisible ? "block p-2 pt-1 max-h-96 overflow-auto" : "hidden"
        }
      >
        <div className="my-1">
          <strong>Active Step:</strong> {activeStep?.metadata.title}
        </div>
        <div>
          {activeStep?.metadata.blocks.map((block, index) => (
            <div key={index} className="my-2 p-2 border rounded text-sm">
              <div>
                <p className="font-bold">
                  Block {index + 1} -{" "}
                  <span className="capitalize">{block.type}</span>
                </p>
              </div>

              <div>
                <ul>
                  {block?.triggers && block?.triggers?.length > 0 ? (
                    <>
                      <p className="font-bold">Triggers:</p>

                      {block?.triggers.map((trigger) => (
                        <li key={JSON.stringify(trigger.metadata)}>
                          <div className="break-words">
                            {JSON.stringify(trigger.metadata)}
                          </div>
                        </li>
                      ))}
                    </>
                  ) : (
                    <li>No triggers</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CanvasDebugger;
