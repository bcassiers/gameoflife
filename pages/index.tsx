import Head from "next/head";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { MoonIcon, PauseIcon, PlayIcon, SparklesIcon, SunIcon, XCircleIcon } from "@heroicons/react/outline";
import _ from "lodash";
import produce from "immer";

export default function App(): JSX.Element {
  const [numCols, setNumCols] = useState(50);
  const [numRows, setNumRows] = useState(50);
  const [generationCounter, setGenerationCounter] = useState(0);
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

    setTimeout(updateGrid, 200);
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

  return (
    <div className="min-h-screen min-w-screen bg-embie-grey bg-opacity-50 dark:bg-black dark:bg-opacity-100 flex flex-col py-16 space-y-5 sm:space-y-10 text-center px-4">
      <Head>
        <title>{"Conway's game of life | Embie"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-3xl sm:text-6xl font-recoleta font-bold text-embie-blue dark:text-white">Bienvenue 🕹</h1>
      <div className="h-full mt-32 mb-10">
        <div className="bg-white dark:bg-embie-blue overflow-hidden shadow-xl h-full rounded-lg sm:w-4/5 mx-auto">
          <div className="px-10 py-10 2xl:py-24 sm:p-6 space-y-3">
            <div className="space-x-3 mr-auto">
              <button
                onClick={() => {
                  setRunning(!running);
                }}
                className="mx-auto p-1 text-xl shadow-sm rounded-md font-bold font-recoleta hover:bg-gray-200 text-embie-blue dark:bg-embie-blue dark:text-white bg-opacity-90 hover:bg-opacity-100 focus:outline-none focus:ring-0"
              >
                {running ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
              </button>
              <button
                onClick={() => {
                  setRunning(false);
                  randomGrid(0.15);
                  setGenerationCounter(0);
                }}
                className="mx-auto p-1 text-xl shadow-sm rounded-md font-bold font-recoleta hover:bg-gray-200 text-embie-blue dark:bg-embie-blue dark:text-white bg-opacity-90 hover:bg-opacity-100 focus:outline-none focus:ring-0"
              >
                <SparklesIcon className="w-8 h-8" />
              </button>
              <button
                onClick={() => {
                  setRunning(false);
                  setGrid(emptyGrid());
                  setGenerationCounter(0);
                }}
                className="mx-auto p-1 text-xl shadow-sm rounded-md font-bold font-recoleta hover:bg-gray-200 text-embie-blue dark:bg-embie-blue dark:text-white bg-opacity-90 hover:bg-opacity-100 focus:outline-none focus:ring-0"
              >
                <XCircleIcon className="w-8 h-8" />
              </button>
              <p className="font-recoleta my-2">{`Generation : ${generationCounter}`}</p>
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
        onClick={() => {
          if (theme === "dark") {
            setTheme("light");
            window.localStorage.theme = "light";
          } else {
            setTheme("dark");
            window.localStorage.theme = "dark";
          }
        }}
        className="mx-auto p-4 text-xl border border-transparent shadow-sm rounded-md font-bold font-recoleta bg-white text-embie-blue dark:bg-embie-blue dark:text-white bg-opacity-90 hover:bg-opacity-100 focus:outline-none focus:ring-0"
      >
        {theme === "dark" ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
      </button>
    </div>
  );
}
