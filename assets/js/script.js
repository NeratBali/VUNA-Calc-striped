// ===============================
// 🧠 SMART RESULT MEMORY FEATURE
// ===============================

let LAST_RESULT = 0;
var currentExpression = "";
let calculationHistory = [];

document.addEventListener("DOMContentLoaded", function () {
  loadHistoryFromStorage();
  renderHistory();
});

// ------------------------------
// Theme Toggle Logic
// ------------------------------
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    btn.innerHTML = "☀️";
    btn.title = "Switch to light mode";
    localStorage.setItem("theme", "dark");
  } else {
    btn.innerHTML = "🌙";
    btn.title = "Switch to dark mode";
    localStorage.setItem("theme", "light");
  }
}

// Set theme on page load from localStorage
window.addEventListener("DOMContentLoaded", function () {
  const theme = localStorage.getItem("theme");
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  if (btn) {
    if (theme === "dark") {
      body.classList.add("dark-mode");
      btn.innerHTML = "☀️";
      btn.title = "Switch to light mode";
    } else {
      btn.innerHTML = "🌙";
      btn.title = "Switch to dark mode";
    }
  }
});

// ------------------------------
// Calculator State
// ------------------------------
let left = "";
let operator = "";
let right = "";
let steps = [];
const MAX_STEPS = 6;

// ------------------------------
// Basic Calculator Functions
// ------------------------------
function appendToResult(value) {
  currentExpression += value.toString();
  updateResult();
}

function bracketToResult(value) {
  currentExpression += value;
  updateResult();
}

function backspace() {
  currentExpression = currentExpression.slice(0, -1);
  updateResult();
}

function operatorToResult(value) {
  if (value === "^") {
    currentExpression += "**";
  } else {
    currentExpression += value;
  }
  updateResult();
}

function clearResult() {
  currentExpression = "";
  // Added security to handle cases where UI elements might exist
  const wordResult = document.getElementById("word-result");
  const wordArea = document.getElementById("word-area");
  if (wordResult) wordResult.innerHTML = "";
  if (wordArea) wordArea.style.display = "none";
  updateResult();
}

function normalizeExpression(expr) {
  return expr
    .replace(/asin\(/g, "asinDeg(")
    .replace(/acos\(/g, "acosDeg(")
    .replace(/atan\(/g, "atanDeg(")
    .replace(/sin\(/g, "sinDeg(")
    .replace(/cos\(/g, "cosDeg(")
    .replace(/tan\(/g, "tanDeg(")
    .replace(/asinh\(/g, "asinh(")
    .replace(/sinh\(/g, "sinh(")
    .replace(/\be\b/g, "Math.E")
    .replace(/\bpi\b/g, "Math.PI");
}

function percentToResult() {
  if (!currentExpression) return;

  const match = currentExpression.match(/(.+?)(\*\*|[+\-*/^])([0-9.]*)$/);

  if (!match) {
    const num = parseFloat(currentExpression);
    if (isNaN(num)) return;

    currentExpression = (num / 100).toString();
  } else {
    const leftPart = match;
    const rightPart = match;

    if (!rightPart) return;

    let leftVal;

    try {
      leftVal = eval(leftPart);
    } catch (e) {
      leftVal = parseFloat(leftPart);
    }

    const rightVal = parseFloat(rightPart);
    if (isNaN(leftVal) || isNaN(rightVal)) return;

    const percentVal = (leftVal * rightVal) / 100;

    currentExpression = percentVal.toString();
  }

  // 🔥 ADD THIS LINE
  currentExpression += "*";

  updateResult();
}

// ------------------------------
// Calculate Result
// ------------------------------
function calculateResult() {
  if (!currentExpression) return;

  try {
    const display = document.getElementById("result");
    let normalizedExpression = normalizeExpression(currentExpression);

    // 🧠 Replace "ans" with last result automatically
    normalizedExpression = normalizedExpression.replace(
      /\bans\b/gi,
      LAST_RESULT,
    );

    // Calculate result
    let result = eval(normalizedExpression);
    console.log("Calculated result for expression:", currentExpression, "->", result);
    
    if (isNaN(result) || !isFinite(result)) {
      throw new Error();
    }

    // 🕒 SAVE TO HISTORY LOGIC (Ported from completeScript.js)
    calculationHistory.push({
      expression: currentExpression,
      words: typeof numberToWords === "function" ? numberToWords(result) : `Result: ${result}`,
      answer: result,
      time: new Date().toLocaleTimeString(),
    });

    if (calculationHistory.length > 20) calculationHistory.shift();

    saveHistoryToStorage();
    renderHistory();

    // Save result for future expressions
    LAST_RESULT = result;
    currentExpression = result.toString();
    updateResult();
  } catch (e) {
    currentExpression = "Error";
    updateResult();
  }
}

function updateResult() {
  document.getElementById("result").value = currentExpression || "0";
}

// =========================================================================
// 🕒 CALCULATION HISTORY ENGINE (Ported from completeScript.js)
// =========================================================================

function toggleHistory() {
  const historyCol = document.getElementById("history-column");
  const btn = document.getElementById("toggle-history-btn");

  if (!historyCol) return;

  historyCol.classList.toggle("d-none");

  if (historyCol.classList.contains("d-none")) {
    if (btn) {
      btn.textContent = "Show History";
      btn.classList.replace("btn-outline-primary", "btn-primary");
    }
  } else {
    if (btn) {
      btn.textContent = "Hide History";
      btn.classList.replace("btn-primary", "btn-outline-primary");
    }
  }
}

function saveHistoryToStorage() {
  localStorage.setItem("calcHistory", JSON.stringify(calculationHistory));
}

function loadHistoryFromStorage() {
  const stored = localStorage.getItem("calcHistory");
  if (stored) calculationHistory = JSON.parse(stored);
}

function clearHistory() {
  if (!confirm("Are you sure you want to clear all calculation history?")) return;
  calculationHistory = [];
  localStorage.removeItem("calcHistory");
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById("history-list");
  if (!list) return;

  list.innerHTML = "";

  // Empty state handling
  if (calculationHistory.length === 0) {
    const emptyTemplate = document.getElementById("history-empty-template");
    if (emptyTemplate) {
      list.appendChild(emptyTemplate.content.cloneNode(true));
    }
    return;
  }

  // Render items latest first
  calculationHistory
    .slice()
    .reverse()
    .forEach((item, index) => {
      const tpl = document
        .getElementById("history-item-template")
        .content.cloneNode(true);

      const itemEl = tpl.querySelector(".history-item");
      tpl.querySelector(".history-item-expression").textContent = item.expression;
      tpl.querySelector(".history-item-words").textContent = item.words;
      tpl.querySelector(".history-item-time").textContent = item.time;
      
      const remarkText = tpl.querySelector(".remark-text");
      const remarkBox = tpl.querySelector(".remark-box");
      const remarkInput = remarkBox ? remarkBox.querySelector("input") : null;
      
      if (item.remark && remarkText) {
        remarkText.textContent = item.remark;
      }
      
      const actualIndex = calculationHistory.length - 1 - index;
      
      // DELETE INDIVIDUAL ITEM
      const deleteBtn = tpl.querySelector(".btn-delete");
      if (deleteBtn) {
        deleteBtn.onclick = (e) => {
          e.stopPropagation();
          calculationHistory.splice(actualIndex, 1);
          saveHistoryToStorage();
          renderHistory();
        };
      }
      
      // SHOW REMARK INPUT BOX
      const remarkBtn = tpl.querySelector(".btn-remark");
      if (remarkBtn && remarkBox) {
        remarkBtn.onclick = (e) => {
          e.stopPropagation();
          remarkBox.classList.remove("d-none");
          if (remarkInput) remarkInput.focus();
        };
      }

      // SAVE REMARK/COMMENT
      if (remarkBox) {
        const saveRemarkBtn = remarkBox.querySelector(".btn-primary");
        if (saveRemarkBtn && remarkInput) {
          saveRemarkBtn.onclick = (e) => {
            e.stopPropagation();
            item.remark = remarkInput.value.trim();
            saveHistoryToStorage();
            renderHistory();
          };
        }

        // CANCEL REMARK
        const cancelRemarkBtn = remarkBox.querySelector(".btn-outline-secondary");
        if (cancelRemarkBtn) {
          cancelRemarkBtn.onclick = (e) => {
            e.stopPropagation();
            remarkBox.classList.add("d-none");
          };
        }
      }

      // Click on item to restore it to calculator display
      if (itemEl) {
        itemEl.addEventListener("click", () => {
          currentExpression = item.expression;
          updateResult();
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      }

      list.appendChild(tpl);

      // Staggered fade-in animation trigger
      if (itemEl) {
        setTimeout(() => {
          itemEl.classList.add("show");
        }, index * 50);
      }
    });
}