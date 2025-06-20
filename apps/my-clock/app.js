Modules.addCached("Font8x12",function(){var a=atob("AAAAAAAAAAfkAAwAAAwAAACQf8CQf8CQAAGIJEf+JEE4AAMMMQBgCMMMAAAYMkTEMkAYBkAAwAgAAAHwIIQEAAQEIIHwAABAFQDgBADgFQBABABAHwBABAAAACAMAABABABABABAAAAEAAAEAYAgDAEAYAAAP4QkRESEP4AAEEIEf8AEAAMMQUQUQkPEAAIIQEREREO4AABwCQEQIQf8AAeISESESER4AAH4KESESEB4AAYAQAQcTgcAAAO4REREREO4AAPAQkQkQoPwAACIAAACCMAABACgEQIIAACQCQCQCQCQAAIIEQCgBAAAMAQAQ0RAOAAAP4QETkUUUUP0AAP8RARARAP8AAf8REREREO4AAP4QEQEQEIIAAf8QEQEIIHwAAf8REREREQEAAf8RARARAQAAAP4QEQEREJ4AAf8BABABAf8AAQEf8QEAAAYAEQEf4QAAAf8BACgEQYMAAf8AEAEAEAEAAf8IAEACAEAIAf8AAf8EACABAf8AAP4QEQEQEP4AAf8RARARAOAAAP4QEQEQGP6AAf8RgRQRIOEAAOIREREREI4AAQAQAf8QAQAAAf4AEAEAEf4AAeABwAMBweAAAf8AIAQAgAQAIf8AAYMGwBAGwYMAAYAGAB8GAYAAAQMQ0REWEYEAAf8QEAAMACABgAQAMAAQEf8AAIAQAgAQAIAAAACACACACACAAgAwAAAAYCkCkCkB8AAf8CECECEB4AAB4CECECEBIAAB4CECECEf8AAB4CUCUCUBwAACAP8SAQAAAB4CFCFCFD+AAf8CACACAB8AACET8AEAAACABT+AAf8AgBQCIAEAAQEf8AEAAD8CACAD8CACAB8AAD8CACACAB8AAB4CECECEB4AAD/CECECEB4AAB4CECECED/AAD8BACACACAAABICkCkCkAYAACAP4CECEAAD4AEAEAED8AADAAwAMAwDAAAD4AEAEA4AEAED4AACMBQAgBQCMAAD4AFAFAFD+AACMCUCkDECEAABAO4QEQEAAf8AAQEQEO4BAAAYAgAQAQAIAwAAAAAAAAAAAAA"),
  b=atob("BQIEBgYGBwMEBAcGAwYCBwYFBgYGBgYGBgYCAwUGBQYHBgYGBgYGBgYEBgYGCAYGBgYGBgYGBggGBgYDBgMGBgMGBgYGBgUGBgQEBgQIBgYGBgYGBQYGCAYGBgUCBQcF");exports.add=function(c){c.prototype.setFont8x12=function(){return this.setFontCustom(a,32,b,12)}}
  });
  Modules.addCached("Font7x11Numeric7Seg",function(){exports.add=function(a){a.prototype.setFont7x11Numeric7Seg=function(){return this.setFontCustom(atob("AAAAAAAAAAAAAAAEAIAQAgAAAAAIAHvQBgDAGAL3gAAAAAAAAAAHvAAA9CGEMIYQvAAAACEMIYQwhe8AB4AIAQAgBA94ADwIQwhhDCEDwAHvQhhDCGEIHgAAAgBACAEAHvAAe9CGEMIYQveAA8CEMIYQwhe8AAABjDGAAAA96EEIIQQge8AB7wIQQghBCB4AD3oAwBgDAEAAAAPAhBCCEEL3gAPehDCGEMIQAAAe9CCEEIIQAAAA"),32,atob("BwAAAAAAAAAAAAAAAAcCAAcHBwcHBwcHBwcFAAAAAAAABwcHBwcH"),11)}}
  });
  require("Font7x11Numeric7Seg").add(Graphics);
  require("Font8x12").add(Graphics);
  
  const storage = require("Storage");
  const appId = "my-clock-3";
  
  // util
  
  function getTimeToNextAlarm() {
    const alarms = require("sched").getAlarms();
    const d = new Date();
    const currentTime =
      d.getHours() * 1000 * 60 * 60 +
      d.getMinutes() * 1000 * 60 +
      d.getSeconds() * 1000;
  
    const active = alarms
      .filter((a) => a.on && a.t > currentTime)
      .sort((a, b) => a.t - b.t);
  
    const timer = active[0];
  
    if (timer) {
      return require("sched").getTimeToAlarm(timer);
    }
  }
  
  function getFormattedTimeToNextAlarm(precise) {
    const timeLeft = getTimeToNextAlarm();
  
    let text;
    if (timeLeft !== undefined) {
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor(timeLeft / (1000 * 60));
      const seconds = Math.floor(timeLeft / 1000);
  
      if (hours >= 1) {
        text = `${hours}h ${minutes - (hours * 60)}m`;
      } else if (minutes >= 1) {
        text = `${minutes}m ${seconds - (minutes * 60)}s`;
      } else if (seconds >= 1) {
        if (precise) {
          text = `${seconds}s`;
        } else {
          text = "<1m";
        }
      }
    }
  
    return text;
  }
  
  function formatTime(d) {
    const h = d.getHours();
    const m = d.getMinutes();
    return ("0" + h).substr(-2) + ":" + ("0" + m).substr(-2);
  }
  
  // util-end
  function pageClock() {
    let timeout;
  
    (function draw() {
      g.setColor(g.theme.bg);
      g.fillRect(Bangle.appRect);
  
      const d = new Date();
      const time = formatTime(d);
      const date = require("locale").date(d);
      const day = require("locale").dow(d);
      const healthDay = Bangle.getHealthStatus("day");
      const timeToNextAlarm = getFormattedTimeToNextAlarm(false);
  
      g.setBgColor(g.theme.bg);
  
      g.setFontAlign(1, -1);
      g.setFont("Vector", 60);
  
      g.setColor(255, 0, 0);
      g.drawString(time, Bangle.appRect.x2 - 2, Bangle.appRect.y + 10, false);
  
      g.setColor(g.theme.fg);
      g.drawString(time, Bangle.appRect.x2 - 5, Bangle.appRect.y + 10, false);
  
      g.setFont("8x12", 1);
  
      g.drawString(
        `${day}, ${date}`,
        Bangle.appRect.x2 - 5,
        Bangle.appRect.y + 70,
        false
      );
      
      g.setColor(255, 0, 0);
      g.fillRect(
        Bangle.appRect.x,
        Bangle.appRect.y + 95,
        Bangle.appRect.x2,
        Bangle.appRect.y2
      );
      
      g.setColor(255,255,255);
  
      g.setFontAlign(1, 1);
      g.drawString(
        `     ${healthDay.steps} STEPS`,
        Bangle.appRect.x2 - 5,
        Bangle.appRect.y2 - 35,
        false
      );
  
      g.drawString(
        `     ${timeToNextAlarm || "-"} ALARM`,
        Bangle.appRect.x2 - 5,
        Bangle.appRect.y2 - 20,
        false
      );
  
      Bangle.drawWidgets();
  
      timeout = setTimeout(draw, 60000 - (Date.now() % 60000));
    })();
  
    return () => {
      clearTimeout(timeout);
    };
  }
  
  function pageSteps() {
    let timeout;
  
    (function draw() {
      g.setBgColor(g.theme.bg);
      g.clearRect(Bangle.appRect);
      g.setFont("8x12", 3);
      g.setColor(g.theme.fg);
  
      const last10 = Bangle.getHealthStatus();
      const day = Bangle.getHealthStatus("day");
  
      // header
      g.setFontAlign(0, 1);
      g.drawString(
        "STEPS",
        Bangle.appRect.x + Bangle.appRect.w / 2,
        Bangle.appRect.y + 50
      );
      g.fillRect(
        Bangle.appRect.x + 30,
        Bangle.appRect.y + 50,
        Bangle.appRect.x2 - 30,
        Bangle.appRect.y + 55
      );
  
      g.setFont("8x12", 2);
      g.setFontAlign(0, -1);
      g.drawString(
        `${day.steps}\n${last10.steps}`,
        Bangle.appRect.x + Bangle.appRect.w / 2,
        Bangle.appRect.y + 60
      );
  
      timeout = setTimeout(draw, 1000);
    })();
  
    return () => {
      clearTimeout(timeout);
    };
  }
  
  function pageTimer() {
    let timeout;
  
    (function draw() {
      g.setBgColor(g.theme.bg);
      g.clearRect(Bangle.appRect);
      g.setFont("8x12", 3);
      g.setColor(g.theme.fg);
  
      let text = getFormattedTimeToNextAlarm(true) || "N/A";
  
      // header
      g.setFontAlign(0, 1);
      g.drawString(
        "TIMER",
        Bangle.appRect.x + Bangle.appRect.w / 2,
        Bangle.appRect.y + 50
      );
      g.fillRect(
        Bangle.appRect.x + 30,
        Bangle.appRect.y + 50,
        Bangle.appRect.x2 - 30,
        Bangle.appRect.y + 55
      );
  
      g.setFont("8x12", 2);
      g.setFontAlign(0, -1);
      g.drawString(
        text,
        Bangle.appRect.x + Bangle.appRect.w / 2,
        Bangle.appRect.y + 60
      );
  
      timeout = setTimeout(draw, 1000);
    })();
  
    return () => {
      clearTimeout(timeout);
    };
  }
  
  function pageHRM() {
    let timeout;
    let hrm;
    let bestBPM;
    let bestConfidence = 0;
  
    Bangle.setHRMPower(true, appId);
    Bangle.on("HRM", (data) => (hrm = data));
  
    (function draw() {
      g.setBgColor(g.theme.bg);
      g.clearRect(Bangle.appRect);
      g.setFont("8x12", 3);
  
      g.setColor(g.theme.fg);
  
      const bpm = (hrm && hrm.bpm) || 0;
      const confidence = (hrm && hrm.confidence) || 0;
  
      if (confidence >= 80) {
        bestBPM = bpm;
        bestConfidence = confidence;
      }
  
      // header
      g.setFontAlign(0, 1);
      g.drawString(
        "HEART",
        Bangle.appRect.x + Bangle.appRect.w / 2,
        Bangle.appRect.y + 50
      );
      g.fillRect(
        Bangle.appRect.x + 30,
        Bangle.appRect.y + 50,
        Bangle.appRect.x2 - 30,
        Bangle.appRect.y + 55
      );
  
      g.setFont("8x12", 2);
      g.setFontAlign(0, -1);
  
      if (bestBPM) {
        g.setColor(1, 1, 1);
      } else {
        g.setColor(0.6, 0.6, 0.6);
      }
  
      g.drawString(
        `${bestBPM || bpm}`,
        Bangle.appRect.x + Bangle.appRect.w / 2,
        Bangle.appRect.y + 60
      );
  
      g.setColor(1, 1, 1);
  
      g.fillRect(
        Bangle.appRect.x + 60,
        Bangle.appRect.y + 88,
        Bangle.appRect.x2 - 60,
        Bangle.appRect.y + 89
      );
  
      g.setFont("8x12", 1);
      g.drawString(
        `${bestConfidence || confidence}%`,
        Bangle.appRect.x + Bangle.appRect.w / 2,
        Bangle.appRect.y + 95
      );
  
      timeout = setTimeout(draw, 1000);
    })();
  
    return () => {
      clearTimeout(timeout);
      Bangle.setHRMPower(false, appId);
    };
  }
  
  Bangle.setUI("clock");
  Bangle.loadWidgets();
  
  let pages = [pageClock, pageTimer, pageSteps, pageHRM];
  let currentPage = 0;
  let cleanup = pages[currentPage]();
  let returnTimeout;
  
  function gotoPage(n) {
    currentPage = n;
  
    if (cleanup) {
      cleanup();
    }
  
    cleanup = pages[n]();
  }
  
  Bangle.on("touch", () => {
    let nextPage = currentPage + 1;
    if (nextPage >= pages.length) {
      nextPage = 0;
    }
  
    if (returnTimeout) {
      clearTimeout(returnTimeout);
      returnTimeout = undefined;
    }
  
    if (nextPage !== 0) {
      returnTimeout = setTimeout(() => gotoPage(0), 60 * 1000);
    }
  
    gotoPage(nextPage);
  });
  