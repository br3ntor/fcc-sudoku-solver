/*
 *
 *
 *       FILL IN EACH UNIT TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require("chai");
const assert = chai.assert;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
let Solver;

suite("UnitTests", () => {
  suiteSetup(() => {
    // Mock the DOM for testing and load Solver
    return JSDOM.fromFile("./views/index.html").then((dom) => {
      global.window = dom.window;
      global.document = dom.window.document;

      Solver = require("../public/sudoku-solver.js");
    });
  });

  // Only the digits 1-9 are accepted
  // as valid input for the puzzle grid
  suite("Function isValidInput(input)", () => {
    test('Valid "1-9" characters', (done) => {
      const input = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
      const result = input.every(Solver.isValidInput);
      assert.isTrue(result);
      done();
    });

    // Invalid characters or numbers are not accepted
    // as valid input for the puzzle grid
    test('Invalid characters (anything other than "1-9") are not accepted', (done) => {
      const input = ["!", "a", "/", "+", "-", "0", "10", 0, "."];
      const result = input.some(Solver.isValidInput);
      assert.isNotTrue(result);
      done();
    });
  });

  suite("Function makeTable(sudokuString)", () => {
    test("Parses a valid puzzle string into an object", (done) => {
      const input =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      const result = Solver.makeTable(input);
      assert.isArray(result);
      done();
    });

    // Puzzles that are not 81 numbers/periods long show the message
    // "Error: Expected puzzle to be 81 characters long." in the
    // `div` with the id "error-msg"
    test("Shows an error for puzzles that are not 81 numbers long", (done) => {
      const shortStr = "83.9.....6.62.71...9......1945....4.37.4.3..6..";
      const longStr =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...";
      const errorMsg = "Error: Expected puzzle to be 81 characters long.";
      const errorDiv = document.getElementById("error-msg");

      const shortResult = Solver.validPuzzleLength(shortStr);
      const longResult = Solver.validPuzzleLength(longStr);
      assert.isNotTrue(shortResult);
      assert.isNotTrue(longResult);
      assert.equal(errorDiv.textContent, errorMsg);
      done();
    });
  });

  suite("Function testPuzzle(sudokuString)", () => {
    // Valid complete puzzles pass
    test("Valid puzzles pass", (done) => {
      const input =
        "769235418851496372432178956174569283395842761628713549283657194516924837947381625";
      const result = Solver.testPuzzle(input);
      assert.isTrue(result);
      done();
    });

    // Invalid complete puzzles fail
    test("Invalid puzzles fail", (done) => {
      const input =
        "779235418851496372432178956174569283395842761628713549283657194516924837947381625";
      const result = Solver.testPuzzle(input);
      assert.isNotTrue(result);
      done();
    });
  });

  suite("Function solvePuzzle(sudokuString)", () => {
    // Returns the expected solution for a valid, incomplete puzzle
    test("Returns the expected solution for an incomplete puzzle", (done) => {
      const input =
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
      const result = Solver.solvePuzzle(input);
      assert.isTrue(result);
      done();
    });
  });
});
