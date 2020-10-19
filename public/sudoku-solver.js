const textArea = document.getElementById("text-input");
const errorDiv = document.getElementById("error-msg");
const solveButton = document.getElementById("solve-button");
const clearButton = document.getElementById("clear-button");
const cellInputs = document.querySelectorAll("td input");
const table = document.querySelector("table");

// import { puzzlesAndSolutions } from './puzzle-strings.js';

document.addEventListener("DOMContentLoaded", () => {
  // Load a simple puzzle into the text area
  textArea.value =
    "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
  textToTable();
});

solveButton.addEventListener("click", solveHandler);
clearButton.addEventListener("click", clearHandler);
textArea.addEventListener("input", textAreaHandler);
table.addEventListener("input", handleCellInputs);

function solveHandler(event) {
  solvePuzzle(textArea.value);
}

function clearHandler(event) {
  textArea.value = "";
  cellInputs.forEach((el) => (el.value = ""));
}

// Text-area ==> Table
function textAreaHandler(event) {
  const validLength = validPuzzleLength(textArea.value);
  const allInputsValid = textArea.value
    .split("")
    .every((el) => isValidInput(el) || el === ".");
  if (validLength && allInputsValid) {
    textToTable();
  }
}

// Table ==> Text-area
function handleCellInputs(event) {
  const validInput = isValidInput(event.data);
  if (validInput) {
    event.target.value = event.data;
  } else {
    event.target.value = "";
  }

  errorDiv.textContent = "";
  tableToText();
}

function textToTable() {
  for (let i = 0; i < cellInputs.length; i++) {
    cellInputs[i].value = "";
    if (textArea.value[i] === ".") continue;
    cellInputs[i].value = textArea.value[i];
  }
}

function tableToText() {
  const updatedString = Array.from(cellInputs)
    .map((cell) => cell.value || ".")
    .join("");
  textArea.value = updatedString;
}

// Input for grid can only be numbers 1-9
function isValidInput(input) {
  const validInputs = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  return validInputs.includes(input);
}

// Returns an array of sub arrays, rows of 9 elements each
function makeTable(sudokuString) {
  const table = [];
  for (let i = 0; i < sudokuString.length; i += 9) {
    table.push([...sudokuString.slice(i, i + 9)]);
  }
  return table;
}

function validPuzzleLength(sudokuString) {
  errorDiv.textContent = "";
  if (sudokuString.length !== 81) {
    errorDiv.textContent = "Error: Expected puzzle to be 81 characters long.";
  }
  return sudokuString.length === 81;
}

function getRow(rowNum, table) {
  return table[rowNum];
}

function getColumn(colNum, table) {
  const col = [];
  for (let r = 0; r < table.length; r++) {
    col.push(table[r][colNum]);
  }
  return col;
}

/**
 * Returns an array of numbers in the same square of the given cell
 * @param {string} cell
 * @param {string[]} table
 * @returns {string[]}
 */
function getSquare(cell, table) {
  // Might be able to rethink this method?
  // Array of coordinates for the cells in small square groups
  // Could probably build this with a function...
  // Each array represents coords for 3x3 cells square
  const groups = [
    ["00", "01", "02", "10", "11", "12", "20", "21", "22"],
    ["03", "04", "05", "13", "14", "15", "23", "24", "25"],
    ["06", "07", "08", "16", "17", "18", "26", "27", "28"],
    ["30", "31", "32", "40", "41", "42", "50", "51", "52"],
    ["33", "34", "35", "43", "44", "45", "53", "54", "55"],
    ["36", "37", "38", "46", "47", "48", "56", "57", "58"],
    ["60", "61", "62", "70", "71", "72", "80", "81", "82"],
    ["63", "64", "65", "73", "74", "75", "83", "84", "85"],
    ["66", "67", "68", "76", "77", "78", "86", "87", "88"],
  ];
  const fGroup = groups.filter((sqr) => sqr.includes(cell)).flat();
  const square = fGroup.map((cell) => table[cell[0]][cell[1]]);
  return square;
}

/**
 * Returns true if violation is found
 * @param {string} num
 * @param {string} cell
 * @param {string[]} table
 * @returns {boolean}
 */
function violationCheck(num, cell, table) {
  const row = getRow(cell[0], table).filter((val) => val === num);
  const col = getColumn(cell[1], table).filter((val) => val === num);
  const sqr = getSquare(cell, table).filter((val) => val === num);
  return row.length > 1 || col.length > 1 || sqr.length > 1;
}

function testPuzzle(sudokuString) {
  const table = makeTable(sudokuString);
  for (let row = 0; row < table.length; row++) {
    for (let col = 0; col < table[row].length; col++) {
      const cellValue = table[row][col];
      const test = violationCheck(
        cellValue,
        row.toString() + col.toString(),
        table
      );
      if (test) {
        return false;
      }
    }
  }
  return true;
}

function solvePuzzle(sudokuString) {
  // Test at beginning and end?
  const allNums = sudokuString.match(/\d+/);
  if (allNums[0].length === 81) {
    const result = testPuzzle(sudokuString);
    console.log(result);
    return result;
  }

  const table = makeTable(sudokuString);
  const solvedTable = makeTable(sudokuString);

  let numToTry = 1;

  let row = 0;
  while (row < solvedTable.length) {
    let col = 0;
    while (col < solvedTable[row].length) {
      if (table[row][col] !== ".") {
        col++;
        continue;
      }

      while (numToTry < 10) {
        // Place number (this could be placed in else block below I think? idk)
        solvedTable[row][col] = numToTry.toString();

        // Test if number causes violation
        const isViolation = violationCheck(
          numToTry.toString(),
          row.toString() + col.toString(),
          solvedTable
        );

        // If violation is found, try the next number
        // Else, if no violation we can reset numToTry and break loop
        if (isViolation) {
          numToTry++;
          continue;
        } else {
          // I wonder if I can move numToTry closer in scope?
          numToTry = 1;
          break;
        }
      }

      // If we've tried 1 - 9 set cell value back to .
      // and go back one cell, this has some rules...
      // Handles go-back logic for puzzle in 2d-array form
      if (numToTry === 10) {
        solvedTable[row][col] = ".";

        // Go back one column
        col = col - 1;

        // And I'll have to account for col - 1 being less than 0
        if (col < 0) {
          row = row - 1;
          col = 8;
          if (row < 0) {
            console.log("Failed to solve, went back too far.");
            return false;
          }
        }

        // If the previous cell in the original table is a number, go back one more
        while (table[row][col] !== ".") {
          col = col - 1;

          // And I'll have to account for col - 1 being less than 0
          if (col < 0) {
            row = row - 1;
            col = 8;
            if (row < 0) {
              console.log("Failed to solve, went back too far.");
              return false;
            }
          }
        }

        // row and col should now be set to previously tried number
        // now we can get that number and try the rest up to 9

        // Set numToTry the previous cell value plus 1
        numToTry = Number(solvedTable[row][col]) + 1;
      } else {
        // If we don't go back, go forward
        col++;
      }
    }
    row++;
  }

  textArea.value = solvedTable.flat().join("");
  textToTable();
  // I need to test the resulting string to be sure
  console.log("Puzzle solved! I hope!");
  return true;
}

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {
    isValidInput,
    makeTable,
    validPuzzleLength,
    testPuzzle,
    solvePuzzle,
  };
} catch (e) {}
