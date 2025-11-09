
// 🔙 Navigation zurück
function goBack() {
  if (document.referrer && document.referrer !== window.location.href) {
    history.back();
  } else {
    window.location.href = "index.html";
  }
}

// 🏠 Zur Hauptseite
function goHome() {
  window.location.href = "index.html";
}

// 🧾 PDF-Setup für jsPDF
function setupPDF(doc) {
  if (window.robotoBase64) {
    doc.addFileToVFS("Roboto-Regular.ttf", window.robotoBase64);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto", "normal");
  }
  doc.setFontSize(12);
}

// 📅 Datum im Schweizer Format
function currentDateCH() {
  return new Date().toLocaleDateString("de-CH");
}

// 💬 Einheitliche Logausgabe (für Debugzwecke)
function logInfo(msg) {
  console.log(`[OMNIA] ${msg}`);
}

// 🕒 Optional: kleine Hilfsfunktion für Timer-Buttons (zentrale Basis)
let globalTimer = null;
let globalStart = 0;
function startStopTimer(displayId) {
  const display = document.getElementById(displayId);
  if (!display) return;

  if (globalTimer) {
    // Stoppen
    clearInterval(globalTimer);
    globalTimer = null;
    display.style.color = "#000";
  } else {
    // Starten
    globalStart = performance.now();
    display.style.color = "#008000";
    globalTimer = setInterval(() => {
      const sec = ((performance.now() - globalStart) / 1000).toFixed(1);
      display.textContent = sec + " s";
    }, 100);
  }
}

function resetTimer(displayId) {
  const display = document.getElementById(displayId);
  if (!display) return;
  clearInterval(globalTimer);
  globalTimer = null;
  display.textContent = "0.0 s";
  display.style.color = "#000";
}
