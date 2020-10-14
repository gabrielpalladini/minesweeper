import React from "react";
import { MAX_COLS, MAX_ROWS, NO_OF_BOMBS } from "../constants";
import { CellValue, CellState, Cell } from "../types";

const grabAllAdjacentCells = (
  cells: Cell[][],
  rowParam: number,
  colParam: number
): {
  topLeftBomb: Cell | null;
  topBomb: Cell | null;
  topRightBomb: Cell | null;
  leftBomb: Cell | any;
  rightBomb: Cell | any;
  bottomLeftBomb: Cell | null;
  bottomBomb: Cell | any;
  bottomRightBomb: Cell | any;
} => {
  const topLeftBomb =
    rowParam > 0 && colParam > 0 ? cells[rowParam - 1][colParam - 1] : null;
  const topBomb = rowParam > 0 ? cells[rowParam - 1][colParam] : null;
  const topRightBomb =
    rowParam > 0 && colParam < MAX_COLS - 1
      ? cells[rowParam - 1][colParam + 1]
      : null;
  const leftBomb = colParam > 0 ? cells[rowParam][colParam - 1] : 0;
  const rightBomb =
    colParam < MAX_COLS - 1 ? cells[rowParam][colParam + 1] : null;
  const bottomLeftBomb =
    rowParam < MAX_ROWS - 1 && colParam > 0
      ? cells[rowParam + 1][colParam - 1]
      : null;
  const bottomBomb =
    rowParam < MAX_ROWS - 1 ? cells[rowParam + 1][colParam] : null;
  const bottomRightBomb =
    rowParam < MAX_ROWS - 1 && colParam < MAX_COLS - 1
      ? cells[rowParam + 1][colParam]
      : null;

  return {
    topLeftBomb,
    topBomb,
    topRightBomb,
    leftBomb,
    rightBomb,
    bottomLeftBomb,
    bottomBomb,
    bottomRightBomb,
  };
};

export const generateCells = (): Cell[][] => {
  // expected value is an array of 9 different arrays containing a cell element inside
  let cells: Cell[][] = [];

  // generating all cells
  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLS; col++) {
      cells[row].push({
        value: CellValue.none,
        state: CellState.open,
      });
    }
  }

  // randomly add 10 bombs (level: easy)
  let bombsPlaced = 0;
  while (bombsPlaced < NO_OF_BOMBS) {
    const randomRow = Math.floor(Math.random() * MAX_ROWS);
    const randomCol = Math.floor(Math.random() * MAX_COLS);

    const currentCell = cells[randomRow][randomCol];
    if (currentCell.value !== CellValue.bomb) {
      cells = cells.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (randomRow === rowIndex && randomCol === colIndex) {
            return {
              ...cell,
              value: CellValue.bomb,
            };
          }

          return cell;
        })
      );
      bombsPlaced++;
    }
  }

  // calculate the numbers for each cell
  for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
    for (let colIndex = 0; colIndex < MAX_COLS; colIndex++) {
      const currentCell = cells[rowIndex][colIndex];
      if (currentCell.value === CellValue.bomb) {
        continue;
      }
      let numberOfBombs = 0;
      const {
        topLeftBomb,
        topBomb,
        topRightBomb,
        leftBomb,
        rightBomb,
        bottomLeftBomb,
        bottomBomb,
        bottomRightBomb,
      } = grabAllAdjacentCells(cells, rowIndex, colIndex);

      if (topLeftBomb && topLeftBomb.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (topBomb && topBomb.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (topRightBomb && topRightBomb.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (rightBomb && rightBomb.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (bottomLeftBomb && bottomLeftBomb.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (bottomBomb && bottomBomb.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (bottomRightBomb?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (numberOfBombs > 0) {
        cells[rowIndex][colIndex] = {
          ...currentCell,
          value: numberOfBombs,
        };
      }
    }
  }

  return cells;
};

export const openMultipleCells = (
  cells: Cell[][],
  rowParam: number,
  colParam: number
): Cell[][] => {
  
const currentCell = cells[rowParam][colParam];

if (
    currentCell.state === CellState.visible || 
    currentCell.state === CellState.flagged
) {
    return cells;
}
  
  let newCells = cells.slice();
  
  newCells[rowParam][colParam].state = CellState.visible;

  const {
    topLeftBomb,
    topBomb,
    topRightBomb,
    leftBomb,
    rightBomb,
    bottomLeftBomb,
    bottomBomb,
    bottomRightBomb,
  } = grabAllAdjacentCells(cells, rowParam, colParam);

  if (
    topLeftBomb?.state === CellState.open &&
    topLeftBomb.value !== CellValue.bomb
  ) {
    if (topLeftBomb.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam - 1, colParam - 1);
    } else {
      newCells[rowParam - 1][colParam - 1].state = CellState.visible;
    }
  }

  if (topBomb?.state === CellState.open && topBomb.value !== CellValue.bomb) {
    if (topBomb.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam - 1, colParam);
    } else {
      newCells[rowParam - 1][colParam].state = CellState.visible;
    }
  }

  if (
    topRightBomb?.state === CellState.open &&
    topRightBomb.value !== CellValue.bomb
  ) {
    if (topRightBomb.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam - 1, colParam + 1);
    } else {
      newCells[rowParam - 1][colParam + 1].state = CellState.visible;
    }
  }

  if (leftBomb?.state === CellState.open && leftBomb.value !== CellValue.bomb) {
    if (leftBomb.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam, colParam - 1);
    } else {
      newCells[rowParam][colParam - 1].state = CellState.visible;
    }
  }

  if (
    rightBomb?.state === CellState.open &&
    rightBomb.value !== CellValue.bomb
  ) {
    if (rightBomb.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam, colParam + 1);
    } else {
      newCells[rowParam][colParam + 1].state = CellState.visible;
    }
  }

  if (
    bottomLeftBomb?.state === CellState.open &&
    bottomLeftBomb.value !== CellValue.bomb
  ) {
    if (bottomLeftBomb.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam + 1, colParam - 1);
    } else {
      newCells[rowParam + 1][colParam - 1].state = CellState.visible;
    }
  }

  if (
    bottomBomb?.state === CellState.open &&
    bottomBomb.value !== CellValue.bomb
  ) {
    if (bottomBomb.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam + 1, colParam);
    } else {
      newCells[rowParam + 1][colParam].state = CellState.visible;
    }
  }

  if (
    bottomRightBomb?.state === CellState.open &&
    bottomRightBomb.value !== CellValue.bomb
  ) {
    if (bottomRightBomb.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam + 1, colParam + 1);
    } else {
      newCells[rowParam + 1][colParam + 1].state = CellState.visible;
    }
  }

  return newCells;
};
