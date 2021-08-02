import Head from "next/head";
import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { LightningBoltIcon, MoonIcon, PauseIcon, PlayIcon, SparklesIcon, SunIcon, XCircleIcon } from "@heroicons/react/outline";
import produce from "immer";
import useKeyboardShortcut from "util/use-keyboard-shortcut";
import { Dialog, Transition } from "@headlessui/react";

export default function App(): JSX.Element {
  const [numCols, setNumCols] = useState(50);
  const [numRows, setNumRows] = useState(50);
  const [generationCounter, setGenerationCounter] = useState(0);
  const [keyboardHelpOpen, setKeyboardHelpOpen] = useState(false);
  const emptyGrid = () => {
    return new Array(numRows).fill(new Array(numCols).fill(0));
  };

  const [grid, setGrid] = useState(emptyGrid());
  const [running, setRunning] = useState(false);
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    // Load theme
    if (window.localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  }, [theme]);

  const neighborsCoordinates = [
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
  ];

  const runningRef = useRef(running);
  const counterRef = useRef(generationCounter);
  runningRef.current = running;
  counterRef.current = generationCounter;

  const updateGrid = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGenerationCounter(counterRef.current + 1);
    setGrid((grid) => {
      return produce(grid, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0;
            neighborsCoordinates.map(([iOffset, jOffset]) => {
              const newI = i + iOffset;
              const newJ = j + jOffset;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += grid[newI][newJ];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (grid[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(updateGrid, 300);
  }, []);

  const randomGrid = (lifePercentage: number) => {
    setGrid((grid) => {
      return produce(grid, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            gridCopy[i][j] = Math.random() < lifePercentage ? 1 : 0;
          }
        }
      });
    });
  };

  useEffect(() => {
    if (running) {
      updateGrid();
    }
  }, [running]);

  const playPauseHandler = () => {
    setRunning(!running);
  };

  const randomizeGridHandler = () => {
    setRunning(false);
    randomGrid(0.15);
    setGenerationCounter(0);
  };

  const clearGridHandler = () => {
    setRunning(false);
    setGrid(emptyGrid());
    setGenerationCounter(0);
  };

  const toggleThemeHandler = () => {
    if (theme === "dark") {
      setTheme("light");
      window.localStorage.theme = "light";
    } else {
      setTheme("dark");
      window.localStorage.theme = "dark";
    }
  };

  useKeyboardShortcut(["P"], playPauseHandler, { overrideSystem: false });
  useKeyboardShortcut(["Shift", "R"], randomizeGridHandler, { overrideSystem: false });
  useKeyboardShortcut(["Shift", "C"], clearGridHandler, { overrideSystem: false });
  useKeyboardShortcut(["Shift", "N"], toggleThemeHandler, { overrideSystem: false });
  useKeyboardShortcut(["/"], () => setKeyboardHelpOpen((prevState) => !prevState), { overrideSystem: false });

  return (
    <div className="min-h-screen min-w-screen bg-embie-grey bg-opacity-50 dark:bg-black dark:bg-opacity-100 flex flex-col py-16 space-y-5 sm:space-y-10 text-center px-4 transition-all duration-700">
      <Head>
        <title>{"Conway's game of life | Embie"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Transition.Root show={keyboardHelpOpen} as={Fragment}>
        <Dialog as="div" static className="fixed z-10 inset-0 overflow-y-auto" open={keyboardHelpOpen} onClose={setKeyboardHelpOpen}>
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white dark:bg-embie-blue rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-embie-blue dark:bg-embie-yellow">
                    <LightningBoltIcon className="h-6 w-6 text-embie-yellow dark:text-embie-blue" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-lg font-recoleta font-bold text-embie-blue dark:text-white">
                      Keyboard shortcuts
                    </Dialog.Title>
                    <div className="mt-5 text-sm text-embie-blue dark:text-white font-recoleta space-y-5">
                      <div className="flex justify-between ">
                        <div>
                          <KeyboardKey>P</KeyboardKey>
                        </div>
                        <div>Play/Pause</div>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <KeyboardKey>Shift</KeyboardKey> + <KeyboardKey>C</KeyboardKey>
                        </div>
                        <div>Clear grid</div>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <KeyboardKey>Shift</KeyboardKey> + <KeyboardKey>R</KeyboardKey>
                        </div>
                        <div>Randomize</div>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <KeyboardKey>Shift</KeyboardKey> + <KeyboardKey>N</KeyboardKey>
                        </div>
                        <div>Toggle dark mode</div>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <KeyboardKey>/</KeyboardKey>
                        </div>
                        <div>Show this menu</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-embie-blue dark:bg-embie-yellow text-base font-bold font-recoleta text-white dark:text-embie-blue hover:bg-opacity-90 focus:outline-none focus:ring-0 sm:text-sm"
                    onClick={() => setKeyboardHelpOpen(false)}
                  >
                    Back
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <h1 className="text-3xl sm:text-6xl font-recoleta font-bold text-embie-blue dark:text-white">Bienvenue 🕹</h1>
      <div className="h-full mt-32 mb-10">
        <div className="bg-white dark:bg-embie-blue overflow-hidden shadow-xl h-full rounded-lg sm:w-4/5 mx-auto">
          <div className="px-10 py-10 2xl:py-24 sm:p-6 space-y-3">
            <div className="space-x-3 flex flex-row rounded-lg border-embie-red border border-3 p-3 mr-auto">
              <p className="font-recoleta my-2 dark:text-white font-bold text-lg mr-auto">{`Gen. ${generationCounter}`}</p>
              <button
                onClick={playPauseHandler}
                className="px-2 rounded-md hover:bg-opacity-20 hover:bg-embie-blue dark:hover:bg-white dark:hover:bg-opacity-20 text-embie-blue dark:bg-embie-blue dark:text-white focus:outline-none focus:ring-0"
              >
                {running ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
              </button>
              <button
                onClick={randomizeGridHandler}
                className="px-2 rounded-md hover:bg-opacity-20 hover:bg-embie-blue dark:hover:bg-white dark:hover:bg-opacity-20 text-embie-blue dark:bg-embie-blue dark:text-white focus:outline-none focus:ring-0"
              >
                <SparklesIcon className="w-6 h-6" />
              </button>
              <button
                onClick={clearGridHandler}
                className="px-2 rounded-md hover:bg-opacity-20 hover:bg-embie-blue dark:hover:bg-white dark:hover:bg-opacity-20 text-embie-blue dark:text-white focus:outline-none focus:ring-0"
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${numCols}, 1fr)`,
              }}
              className="items-center "
            >
              {grid?.map((col, i) =>
                col.map((cell, j) => (
                  <div
                    key={`${i}${j}`}
                    className={`border dark:border-gray-600 w-full ${cell === 0 ? "bg-transparent" : "bg-embie-blue dark:bg-embie-yellow"}`}
                    style={{ aspectRatio: "1" }}
                    onClick={() => {
                      const newGrid = produce(grid, (gridCopy) => {
                        gridCopy[i][j] = 1 - grid[i][j];
                      });
                      setGrid(newGrid);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <a href="https://embie.be" className="mx-auto">
        <img src={theme === "dark" ? "/logo_neg.png" : "/logo.png"} className="object-scale-down h-20"></img>
      </a>
      <button
        onClick={toggleThemeHandler}
        className="mx-auto p-4 text-xl border border-transparent shadow-sm rounded-md font-bold font-recoleta bg-white text-embie-blue dark:bg-embie-blue dark:text-white bg-opacity-90 hover:bg-opacity-100 focus:outline-none focus:ring-0"
      >
        {theme === "dark" ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
      </button>
    </div>
  );
}

const KeyboardKey: React.FC = (props) => {
  return <span className="py-1 px-3 border border-b-4 rounded-lg mx-1">{props.children}</span>;
};
