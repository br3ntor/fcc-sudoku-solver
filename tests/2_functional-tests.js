/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require("chai");
const assert = chai.assert;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let Solver;

suite("Functional Tests", () => {
  suiteSetup(() => {
    // DOM already mocked -- load sudoku solver then run tests
    Solver = require("../public/sudoku-solver.js");
  });

  suite("Text area and sudoku grid update automatically", () => {
    // Entering a valid number in the text area populates
    // the correct cell in the sudoku grid with that number
    test("Valid number in text area populates correct cell in grid", (done) => {
      const textArea = document.getElementById("text-input");
      const cellInputs = document.querySelectorAll("td input");

      textArea.value =
        "999999999999999999999999999999999999999999999999999999999999999999999999999999999";
      Solver.textToTable();
      assert.equal(cellInputs[0].value, textArea.value[0]);
      done();
    });

    // Entering a valid number in the grid automatically updates
    // the puzzle string in the text area
    test("Valid number in grid updates the puzzle string in the text area", (done) => {
      const textArea = document.getElementById("text-input");
      const cellInputs = document.querySelectorAll("td input");
      cellInputs[0].value = "5";
      Solver.textToTable();
      assert.equal(cellInputs[0].value, textArea.value[0]);
      done();
    });
  });

  suite("Clear and solve buttons", () => {
    // Pressing the "Clear" button clears the sudoku
    // grid and the text area
    test("Function clearInput()", (done) => {
      const textArea = document.getElementById("text-input");
      const cellInputs = document.querySelectorAll("td input");
      Solver.clearHandler();
      const textCleared = textArea.value === "";
      const tableCleared = Array.from(cellInputs).every(
        (el) => el.value === ""
      );
      assert.isTrue(textCleared);
      assert.isTrue(tableCleared);
      done();
    });

    // Pressing the "Solve" button solves the puzzle and
    // fills in the grid with the solution
    test("Function showSolution(solve(input))", (done) => {
      const textArea = document.getElementById("text-input");
      const cellInputs = document.querySelectorAll("td input");
      const solvedPuzzleString =
        "769235418851496372432178956174569283395842761628713549283657194516924837947381625";
      textArea.value =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      Solver.solveHandler();
      const stringFromTable = Array.from(cellInputs)
        .map((el) => el.value)
        .join("");
      assert.equal(textArea.value, solvedPuzzleString);
      assert.equal(stringFromTable, solvedPuzzleString);
      done();
    });
  });
});
