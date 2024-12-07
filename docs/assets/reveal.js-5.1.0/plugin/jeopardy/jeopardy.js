/**
 * Jeopardy Plugin
 *
 * This plugin provides functionality to dynamically generate and manage multiple Jeopardy-style game grids within a Reveal.js presentation.
 * Each grid consists of a fixed layout with 6 columns, including 1 header row and 4 data rows. Grids are created based on JSON data provided
 * within specific container elements in the presentation.
 *
 * Key Features:
 * - Generates and populates multiple Jeopardy grids within Reveal.js slides.
 * - Supports JSON data for grid content, allowing customization of labels, questions, and answers.
 * - Provides tri-state toggling for each cell, allowing users to reveal labels, questions, and answers.
 * - Supports toggling entire columns to display labels, questions, or answers.
 *
 * Usage:
 * 1. Include this plugin in your Reveal.js presentation.
 * 2. Create slides with a specific structure, including a container element with the class "jeopardy-game-container" and JSON data script tags.
 * 3. Initialize the plugin within your presentation configuration.
 * 4. Interact with Jeopardy grids using mouse clicks to reveal content.
 *
 * JSON Data Structure:
 * The JSON data structure should consist of an array of arrays, where each inner array represents a grid. Each grid contains objects with
 * label, question, and answer properties for each cell in the grid.
 *
 * Author: Christian Prior-Mamulyan <cprior@gmail.com>
 * Created: 2024-01-01
 * License: CC-BY - This work is licensed under a Creative Commons Attribution 4.0 International License.
 */

const JeopardyPlugin = {
  id: "jeopardy-plugin",

  // Fallback JSON Data for Jeopardy Grids
  fallbackJsonData: [
    [
      { label: "label1", question: "question1", answer: "answer1" },
      { label: "label2", question: "question2", answer: "answer2" },
      { label: "label3", question: "question3", answer: "answer3" },
      { label: "label4", question: "question4", answer: "answer4" },
      { label: "label5", question: "question5", answer: "answer5" },
      { label: "label6", question: "question6", answer: "answer6" },
    ],
    // Add more grids as needed...
  ],

  // Initialize the plugin
  init: function (reveal) {
    reveal.on("ready", () => {
      this.processJeopardySlides();
    });

    reveal.on("slidechanged", () => {
      this.processJeopardySlides();
    });
  },

  // Process Jeopardy slides
  processJeopardySlides: function () {
    document.querySelectorAll(".reveal section").forEach((slide) => {
      const gridContainer = slide.querySelector(".jeopardy-game-container");
      if (gridContainer) {
        const dataScript = slide.querySelector(
          'script[type="application/json"]'
        );
        let jsonData;
        if (dataScript) {
          jsonData = JSON.parse(dataScript.innerHTML);
        } else {
          jsonData = this.fallbackJsonData;
        }
        this.populateGrid(jsonData, gridContainer);
      }
    });
  },

  // Populate a Jeopardy grid
  populateGrid: function (rows, gridContainer) {
    if (!gridContainer) {
      console.log("Jeopardy container not found");
      return;
    }
    console.log("Populating Jeopardy grid");

    // Clear any existing content
    gridContainer.innerHTML = "";

    // Add headers from the first row
    const headers = rows[0].map((item) => item.label);
    headers.forEach((headerText, columnIndex) => {
      const header = document.createElement("div");
      header.className = `cell header column-${columnIndex}`;
      header.textContent = headerText;
      header.onclick = (event) =>
        this.toggleColumnQuestions(columnIndex, event);
      gridContainer.appendChild(header);
    });

    // Add the rest of the rows
    rows.slice(1).forEach((row, rowIndex) => {
      row.forEach((item, colIndex) => {
        const cellDiv = document.createElement("div");
        cellDiv.className = `cell question column-${colIndex} row-${rowIndex}`;
        cellDiv.textContent = item.label;
        cellDiv.dataset.state = "label";
        cellDiv.dataset.label = item.label;
        cellDiv.dataset.question = item.question;
        cellDiv.dataset.answer = item.answer;
        cellDiv.onclick = () => this.toggleCellState(cellDiv);
        gridContainer.appendChild(cellDiv);
      });
    });
  },

  // Toggle the state of a Jeopardy cell (label, question, answer)
  toggleCellState: function (cell) {
    if (cell.dataset.state === "label") {
      cell.textContent = cell.dataset.question;
      cell.dataset.state = "question";
    } else if (cell.dataset.state === "question") {
      cell.textContent = cell.dataset.answer;
      cell.dataset.state = "answer";
    } else {
      cell.textContent = cell.dataset.label;
      cell.dataset.state = "label";
    }
  },

  // Toggle the state of all cells in a column (label, question, answer)
  toggleColumnQuestions: function (columnIndex, event) {
    if (event) event.preventDefault();

    const cells = document.querySelectorAll(
      `.jeopardy-game-container .question.column-${columnIndex}`
    );
    cells.forEach((cell) => {
      this.toggleCellState(cell);
    });
  },
};
