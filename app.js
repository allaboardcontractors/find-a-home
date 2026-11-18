(function () {
  "use strict";
  var EMAIL = "info@shantekelleyrealty.com";
  var PHONE_DISPLAY = "832-272-0861";
  var $ = function (id) { return document.getElementById(id); };
  function on(el, ev, fn) { if (el) el.addEventListener(ev, fn); }
  function text(el, value) { if (el) el.textContent = value; }

  /* Finder form */
  var RENT_BUDGETS = ["Under $1,200/mo", "$1,200 to $1,500/mo", "$1,500 to $1,800/mo", "$1,800 to $2,200/mo", "$2,200 to $2,800/mo", "$2,800+/mo"];
  var BUY_BUDGETS = ["Under $200,000", "$200,000 to $300,000", "$300,000 to $400,000", "$400,000 to $500,000", "$500,000 to $650,000", "$650,000 to $750,000", "$750,000+"];
  var AREAS = ["Rosenberg", "Rosharon / Lakes of Savannah", "Pearland", "Manvel", "Alvin", "Fresno", "Missouri City", "Sugar Land", "Houston South", "Houston Southwest", "Houston other area", "Richmond", "Angleton / Lake Jackson", "Open to suggestions"];
  var MUSTS = ["Fenced yard", "Garage", "Single story", "Washer/dryer in home", "Updated kitchen", "Big backyard", "Near good schools", "Quiet street", "No HOA", "Owner financing OK", "Short commute to Houston"];

  var goal = "Rent";
  var beds = "3";
  var baths = "2";
  var budgetSelect = $("fBudget");

  function fillBudgets(list) {
    budgetSelect.innerHTML = "";
    var ph = document.createElement("option");
    ph.value = ""; ph.textContent = "Choose your budget";
    budgetSelect.appendChild(ph);
    list.forEach(function (label) {
      var opt = document.createElement("option");
      opt.value = label; opt.textContent = label;
      budgetSelect.appendChild(opt);
    });
    budgetSelect.value = "";
  }
  function buildChecks(containerId, items, name) {
    var box = $(containerId);
    items.forEach(function (label) {
      var lab = document.createElement("label");
      var cb = document.createElement("input");
      cb.type = "checkbox"; cb.name = name; cb.value = label;
      lab.appendChild(cb);
      lab.appendChild(document.createTextNode(" " + label));
      box.appendChild(lab);
    });
  }
  function checkedValues(name) {
    return Array.prototype.slice.call(document.querySelectorAll('input[name="' + name + '"]:checked')).map(function (c) { return c.value; });
  }
  function pillGroup(containerId, attr, setFn) {
    var box = $(containerId);
    if (!box) return;
    box.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      Array.prototype.forEach.call(box.querySelectorAll("button"), function (b) { b.classList.remove("active"); b.setAttribute("aria-pressed", "false"); });
      btn.classList.add("active"); btn.setAttribute("aria-pressed", "true");
      setFn(btn.getAttribute(attr));
    });
  }
  function fullName() { return ($("fFirstName").value.trim() + " " + $("fLastName").value.trim()).trim(); }
  function briefText() {
    var areas = checkedValues("area");
    var musts = checkedValues("must");
    var lines = [];
    lines.push("Home search brief for " + (fullName() || "[name not added yet]"));
    lines.push("Looking to: " + goal);
    lines.push("Budget: " + (budgetSelect.value || "Not added yet"));
    lines.push("Bedrooms: " + beds + "  Bathrooms: " + baths);
    lines.push("Areas: " + (areas.length ? areas.join(", ") : "Not chosen yet"));
    lines.push("Move date: " + ($("fMove").value || "Not chosen yet"));
    lines.push("Pets: " + $("fPets").value + ($("fPetDetails").value.trim() ? " (" + $("fPetDetails").value.trim() + ")" : ""));
    lines.push("Credit score: " + ($("fCredit").value.trim() || "Not added yet"));
    lines.push("Monthly income: " + ($("fIncome").value.trim() || "Not added yet"));
    lines.push("Rental history: " + ($("fHistory").value || "Not added yet"));
    lines.push("Must haves: " + (musts.length ? musts.join(", ") : "None chosen yet"));
    if ($("fNotes").value.trim()) lines.push("Notes: " + $("fNotes").value.trim());
    lines.push("Phone: " + ($("fPhone").value.trim() || "[phone not added yet]"));
    lines.push("Email: " + ($("fEmail").value.trim() || "[email not added yet]"));
    return lines.join("\n");
  }
  function validContact(name, phone, email) {
    var digits = phone.replace(/\D/g, "");
    var phoneOk = digits.length === 10 || (digits.length === 11 && digits.charAt(0) === "1");
    return name.trim().length > 1 && phoneOk && /.+@.+\..+/.test(email.trim());
  }
  function validFinder() {
    return $("fFirstName").value.trim().length > 1
      && $("fLastName").value.trim().length > 1
      && validContact(fullName(), $("fPhone").value, $("fEmail").value)
      && budgetSelect.value
      && $("fMove").value
      && checkedValues("area").length > 0
      && $("fCredit").value.trim()
      && $("fIncome").value.trim()
      && $("fHistory").value;
  }
  function updateBrief() {
    var areas = checkedValues("area");
    var musts = checkedValues("must");
    text($("briefGoal"), goal);
    text($("briefBudget"), budgetSelect.value || "Not added yet");
    text($("briefBeds"), beds + " bed, " + baths + " bath");
    text($("briefAreas"), areas.length ? areas.join(", ") : "Not chosen yet");
    text($("briefMove"), $("fMove").value || "Not chosen yet");
    text($("briefPets"), $("fPets").value + ($("fPetDetails").value.trim() ? " (" + $("fPetDetails").value.trim() + ")" : ""));
    text($("briefCredit"), $("fCredit").value.trim() || "Not added yet");
    text($("briefIncome"), $("fIncome").value.trim() || "Not added yet");
    text($("briefHistory"), $("fHistory").value || "Not added yet");
    text($("briefMust"), musts.length ? musts.join(", ") : "None chosen yet");
    var notes = $("fNotes").value.trim();
    $("briefNotes").hidden = !notes;
    if (notes) text($("briefNotes"), "Notes: " + notes);
  }

  if ($("finderForm")) {
  fillBudgets(RENT_BUDGETS);
  buildChecks("areaChecks", AREAS, "area");
  buildChecks("mustChecks", MUSTS, "must");
  pillGroup("goalPills", "data-goal", function (v) {
    goal = v;
    fillBudgets(v === "Rent" ? RENT_BUDGETS : BUY_BUDGETS);
    updateBrief();
  });
  pillGroup("bedPills", "data-value", function (v) { beds = v; updateBrief(); });
  pillGroup("bathPills", "data-value", function (v) { baths = v; updateBrief(); });
  ["fFirstName", "fLastName", "fPhone", "fEmail", "fMove", "fPetDetails", "fCredit", "fIncome", "fNotes"].forEach(function (id) { on($(id), "input", updateBrief); });
  on(budgetSelect, "change", updateBrief);
  on($("fPets"), "change", updateBrief);
  document.addEventListener("change", updateBrief);
  on($("copyBrief"), "click", function () {
    if (!validFinder()) {
      $("finderError").hidden = false;
      return;
    }
    $("finderError").hidden = true;
    var done = function () { $("copyNote").hidden = false; };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(briefText()).then(done, done);
    } else { done(); }
  });
  updateBrief();
  var finderForm = $("finderForm");
  if (finderForm) finderForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validFinder()) { $("finderError").hidden = false; return; }
    $("finderError").hidden = true;
    var fd = new FormData(finderForm);
    fd.set("brief", briefText());
    fd.set("_subject", "New home search application");
    fd.set("_template", "basic");
    fd.set("_captcha", "false");
    fd.set("_cc", "shantekelley75@gmail.com");
    fetch("https://formsubmit.co/ajax/info@shantekelleyrealty.com", { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(Object.fromEntries(fd)) })
      .then(function (r) { if (!r.ok) throw new Error("send failed"); $("briefSent").hidden = false; $("briefSent").scrollIntoView({ behavior: "smooth", block: "nearest" }); })
      .catch(function () { $("sendError").hidden = false; $("sendError").scrollIntoView({ behavior: "smooth", block: "nearest" }); });
  });
  }

  /* Apply form (apply.html): full questionnaire with credit, income, rental history */
  if ($("applyForm")) {
  var applyGoal = "Rent";
  var applyBeds = "3";
  var applyBaths = "2";
  var applyBudgetSelect = $("aBudget");
  function fillApplyBudgets(list) {
    applyBudgetSelect.innerHTML = "";
    var ph = document.createElement("option");
    ph.value = ""; ph.textContent = "Choose your budget";
    applyBudgetSelect.appendChild(ph);
    list.forEach(function (label) {
      var opt = document.createElement("option");
      opt.value = label; opt.textContent = label;
      applyBudgetSelect.appendChild(opt);
    });
    applyBudgetSelect.value = "";
  }
  fillApplyBudgets(RENT_BUDGETS);
  buildChecks("applyAreaChecks", AREAS, "applyArea");
  buildChecks("applyMustChecks", MUSTS, "applyMust");
  function applyCheckedValues(name) {
    return Array.prototype.slice.call(document.querySelectorAll('input[name="' + name + '"]:checked')).map(function (c) { return c.value; });
  }
  function applyBriefText() {
    var areas = applyCheckedValues("applyArea");
    var musts = applyCheckedValues("applyMust");
    var lines = [];
    lines.push("Home search application for " + ($("aName").value.trim() || "[name not added yet]"));
    lines.push("Looking to: " + applyGoal);
    lines.push("Budget: " + (applyBudgetSelect.value || "Not added yet"));
    lines.push("Bedrooms: " + applyBeds + "  Bathrooms: " + applyBaths);
    lines.push("Side of town: " + (areas.length ? areas.join(", ") : "Not chosen yet"));
    lines.push("Move date: " + ($("aMove").value || "Not chosen yet"));
    lines.push("Pets: " + $("aPets").value + ($("aPetDetails").value.trim() ? " (" + $("aPetDetails").value.trim() + ")" : ""));
    lines.push("Credit score: " + ($("aCredit").value.trim() || "Not added yet"));
    lines.push("Monthly income: " + ($("aIncome").value.trim() || "Not added yet"));
    lines.push("Rental history: " + ($("aHistory").value || "Not added yet") + ($("aHistoryDetail").value.trim() ? " (" + $("aHistoryDetail").value.trim() + ")" : ""));
    lines.push("Must haves: " + (musts.length ? musts.join(", ") : "None chosen yet"));
    if ($("aNotes").value.trim()) lines.push("Notes: " + $("aNotes").value.trim());
    lines.push("Phone: " + ($("aPhone").value.trim() || "[phone not added yet]"));
    lines.push("Email: " + ($("aEmail").value.trim() || "[email not added yet]"));
    return lines.join("\n");
  }
  function updateApplyBrief() {
    var areas = applyCheckedValues("applyArea");
    var musts = applyCheckedValues("applyMust");
    text($("applyBriefGoal"), applyGoal);
    text($("applyBriefBudget"), applyBudgetSelect.value || "Not added yet");
    text($("applyBriefBeds"), applyBeds + " bed, " + applyBaths + " bath");
    text($("applyBriefAreas"), areas.length ? areas.join(", ") : "Not chosen yet");
    text($("applyBriefMove"), $("aMove").value || "Not chosen yet");
    text($("applyBriefPets"), $("aPets").value + ($("aPetDetails").value.trim() ? " (" + $("aPetDetails").value.trim() + ")" : ""));
    text($("applyBriefCredit"), $("aCredit").value.trim() || "Not added yet");
    text($("applyBriefIncome"), $("aIncome").value.trim() || "Not added yet");
    text($("applyBriefHistory"), ($("aHistory").value || "Not added yet") + ($("aHistoryDetail").value.trim() ? " (" + $("aHistoryDetail").value.trim() + ")" : ""));
    text($("applyBriefMust"), musts.length ? musts.join(", ") : "None chosen yet");
    var notes = $("aNotes").value.trim();
    $("applyBriefNotes").hidden = !notes;
    if (notes) text($("applyBriefNotes"), "Notes: " + notes);
    var body = encodeURIComponent(applyBriefText());
    var subject = encodeURIComponent("Home search application" + ($("aName").value.trim() ? " for " + $("aName").value.trim() : ""));
    $("emailApply").href = "mailto:" + EMAIL + "?subject=" + subject + "&body=" + body;
  }
  pillGroup("applyGoalPills", "data-goal", function (v) {
    applyGoal = v;
    fillApplyBudgets(v === "Rent" ? RENT_BUDGETS : BUY_BUDGETS);
    updateApplyBrief();
  });
  pillGroup("applyBedPills", "data-value", function (v) { applyBeds = v; updateApplyBrief(); });
  pillGroup("applyBathPills", "data-value", function (v) { applyBaths = v; updateApplyBrief(); });
  ["aName", "aPhone", "aEmail", "aMove", "aPetDetails", "aCredit", "aIncome", "aHistoryDetail", "aNotes"].forEach(function (id) { on($(id), "input", updateApplyBrief); });
  on(applyBudgetSelect, "change", updateApplyBrief);
  on($("aPets"), "change", updateApplyBrief);
  on($("aHistory"), "change", function () {
    $("aHistoryDetailWrap").hidden = !$("aHistory").value || $("aHistory").value === "No evictions, clean rental history";
    updateApplyBrief();
  });
  document.addEventListener("change", updateApplyBrief);
  function validApply() {
    return validContact($("aName").value, $("aPhone").value, $("aEmail").value)
      && applyBudgetSelect.value
      && $("aMove").value
      && applyCheckedValues("applyArea").length > 0
      && $("aCredit").value.trim()
      && $("aIncome").value.trim()
      && $("aHistory").value;
  }
  on($("copyApply"), "click", function () {
    if (!validApply()) {
      $("applyError").hidden = false;
      return;
    }
    $("applyError").hidden = true;
    var done = function () { $("applyCopyNote").hidden = false; };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(applyBriefText()).then(done, done);
    } else { done(); }
  });
  function guardApplyLink(e) {
    if (!validApply()) {
      e.preventDefault();
      $("applyError").hidden = false;
    } else { $("applyError").hidden = true; }
  }
  on($("emailApply"), "click", guardApplyLink);
  updateApplyBrief();
  var applyForm = $("applyForm");
  if (applyForm) applyForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validApply()) { $("applyError").hidden = false; return; }
    $("applyError").hidden = true;
    var fd = new FormData(applyForm);
    fd.set("brief", applyBriefText());
    fd.set("_subject", "New home search application");
    fd.set("_template", "basic");
    fd.set("_captcha", "false");
    fd.set("_cc", "shantekelley75@gmail.com");
    fetch("https://formsubmit.co/ajax/info@shantekelleyrealty.com", { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(Object.fromEntries(fd)) })
      .then(function (r) { if (!r.ok) throw new Error("send failed"); $("applySent").hidden = false; })
      .catch(function () { $("applySent").hidden = false; });
  });
  }

  /* Homes list */
  var HOMES = [
    { price: 479000, priceText: "$479,000", address: "13502 Sorghum Dr", cityLine: "Rosharon, TX 77583", beds: 4, baths: "3.5", sqft: "3,539 sq ft", built: "Built 2016", mls: "61220321", badge: "Active, verified Nov 14, 2026", badgeWarn: false, detail: "$1,000 bonus to the agent who brings a buyer and closes by Dec 31, 2026", credit: "Listing courtesy Cindy Kleist, LoKation Real Estate", keywords: "rosharon lakes of savannah sorghum" },
    { price: 250000, priceText: "$250,000", address: "1619 Bonnie Lea Ln", cityLine: "Fresno, TX 77545", beds: 3, baths: "2", sqft: "1,659 sq ft", built: "Built 1994", mls: "80894059", badge: "Teal Run", badgeWarn: false, detail: "In the Teal Run community", credit: "Listing courtesy Shantel Lofton, Jireh MP Realty", keywords: "fresno teal run bonnie lea" },
    { price: 346000, priceText: "$346,000", address: "1306 Grove St", cityLine: "Houston, TX 77020", beds: 3, baths: "2.5", sqft: "1,876 sq ft", built: "Built 2026", mls: "86667600", badge: "Status to be confirmed with Shante before showing", badgeWarn: true, detail: "2 car garage. No HOA.", credit: "Listing courtesy Michael Muniz, Yellow Brick Realty TX LLC", keywords: "houston grove" }
  ];
  function renderHomes() {
    var maxPrice = $("filterPrice").value ? parseInt($("filterPrice").value, 10) : null;
    var minBeds = $("filterBeds").value ? parseInt($("filterBeds").value, 10) : null;
    var q = $("filterCity").value.trim().toLowerCase();
    var box = $("homeCards");
    box.innerHTML = "";
    var shown = 0;
    HOMES.forEach(function (h) {
      if (maxPrice && h.price > maxPrice) return;
      if (minBeds && h.beds < minBeds) return;
      if (q && (h.address + " " + h.cityLine + " " + h.keywords).toLowerCase().indexOf(q) === -1) return;
      shown++;
      var card = document.createElement("article");
      card.className = "home-card";
      var harLink = document.createElement("a");
      harLink.className = "badge";
      harLink.href = "https://www.har.com/search/dosearch?streetaddress=" + encodeURIComponent(h.mls);
      harLink.target = "_blank";
      harLink.rel = "noopener";
      harLink.textContent = "View on HAR";
      var price = document.createElement("p"); price.className = "price"; price.textContent = h.priceText;
      var title = document.createElement("h3"); title.textContent = h.address;
      var city = document.createElement("p"); city.textContent = h.cityLine;
      var facts = document.createElement("p"); facts.textContent = h.beds + " bed, " + h.baths + " bath, " + h.sqft + ", " + h.built;
      var mls = document.createElement("p"); mls.textContent = "MLS #" + h.mls;
      var detail = document.createElement("p"); detail.textContent = h.detail;
      var credit = document.createElement("p"); credit.textContent = h.credit;
      var avail = document.createElement("p"); avail.textContent = "Availability and price to be confirmed with Shante.";
      var actions = document.createElement("div"); actions.className = "card-actions";
      var ask = document.createElement("a"); ask.className = "button";
      var askBody = encodeURIComponent("Hi Shante, I would like to ask about " + h.address + ", " + h.cityLine + " at " + h.priceText + ", MLS #" + h.mls + ".");
      ask.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Question about " + h.address) + "&body=" + askBody;
      ask.textContent = "Ask Shante about this home";
      var bookBtn = document.createElement("a"); bookBtn.className = "button";
      bookBtn.href = "#booking";
      bookBtn.textContent = "Book Shante to see this home";
      bookBtn.addEventListener("click", function () {
        service = "Showing tour";
        var pills = document.querySelectorAll("#servicePills .pill");
        pills.forEach(function (p) {
          var on = p.getAttribute("data-service") === "Showing tour";
          p.classList.toggle("active", on);
          p.setAttribute("aria-pressed", on ? "true" : "false");
        });
        var note = document.getElementById("bNote");
        if (note) note.value = "Showing tour for " + h.address + ", " + h.cityLine + " at " + h.priceText + ", MLS #" + h.mls + ".";
      });
      actions.appendChild(ask); actions.appendChild(bookBtn);
      card.appendChild(harLink); card.appendChild(price); card.appendChild(title); card.appendChild(city);
      card.appendChild(facts); card.appendChild(mls); card.appendChild(detail); card.appendChild(credit); card.appendChild(avail); card.appendChild(actions);
      box.appendChild(card);
    });
    $("noHomes").hidden = shown > 0;
  }
  if ($("homeCards")) {
    ["filterPrice", "filterBeds", "filterCity"].forEach(function (id) { on($(id), "input", renderHomes); on($(id), "change", renderHomes); });
    renderHomes();
  }

  /* Booking */
  var TIMES = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];
  var service = "Home search call";
  var bookable = [];
  var viewYear, viewMonth;
  var pickedDay = null, pickedTime = null;
  function startOfDay(d) { var x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
  function buildBookable() {
    bookable = [];
    var d = startOfDay(new Date());
    d.setDate(d.getDate() + 1);
    while (bookable.length < 12) {
      var day = d.getDay();
      if (day !== 0) bookable.push(startOfDay(d));
      d.setDate(d.getDate() + 1);
    }
    viewYear = bookable[0].getFullYear(); viewMonth = bookable[0].getMonth();
  }
  function sameDay(a, b) { return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function isBookable(d) { return bookable.some(function (b) { return sameDay(b, d); }); }
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function renderCalendar() {
    var first = new Date(viewYear, viewMonth, 1);
    text($("calTitle"), MONTHS[viewMonth] + " " + viewYear);
    var firstBookable = bookable[0], lastBookable = bookable[bookable.length - 1];
    $("calPrev").disabled = viewYear === firstBookable.getFullYear() && viewMonth === firstBookable.getMonth();
    $("calNext").disabled = viewYear === lastBookable.getFullYear() && viewMonth === lastBookable.getMonth();
    var grid = $("calGrid"); grid.innerHTML = "";
    var offset = (first.getDay() + 6) % 7;
    for (var i = 0; i < offset; i++) {
      var blank = document.createElement("span"); blank.className = "empty"; grid.appendChild(blank);
    }
    var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    for (var day = 1; day <= daysInMonth; day++) {
      (function (dayNum) {
        var d = new Date(viewYear, viewMonth, dayNum);
        var btn = document.createElement("button");
        btn.type = "button"; btn.textContent = String(dayNum);
        btn.disabled = !isBookable(d);
        if (sameDay(d, pickedDay)) btn.classList.add("selected");
        btn.addEventListener("click", function () {
          pickedDay = d; pickedTime = null;
          renderCalendar(); renderTimes();
        });
        grid.appendChild(btn);
      })(day);
    }
  }
  function renderTimes() {
    var box = $("timePills"); box.innerHTML = "";
    TIMES.forEach(function (t) {
      var btn = document.createElement("button");
      btn.type = "button"; btn.className = "pill";
      btn.textContent = t;
      btn.disabled = !pickedDay;
      if (pickedTime === t) btn.classList.add("active");
      btn.addEventListener("click", function () {
        pickedTime = t; renderTimes();
      });
      box.appendChild(btn);
    });
  }
  pillGroup("servicePills", "data-service", function (v) { service = v; });
  on($("calPrev"), "click", function () { viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } renderCalendar(); });
  on($("calNext"), "click", function () { viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } renderCalendar(); });
  if ($("bookingForm")) { buildBookable(); renderCalendar(); renderTimes(); }

  function bookingText() {
    var dayText = pickedDay ? pickedDay.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "";
    var lines = [];
    lines.push("Booking request for " + ($("bName").value.trim() || "[name not added yet]"));
    lines.push("Service: " + service);
    lines.push("Day: " + dayText);
    lines.push("Time: " + (pickedTime || "") + " Central");
    lines.push("Phone: " + ($("bPhone").value.trim() || "[phone not added yet]"));
    lines.push("Email: " + ($("bEmail").value.trim() || "[email not added yet]"));
    if ($("bNote").value.trim()) lines.push("Note: " + $("bNote").value.trim());
    return lines.join("\n");
  }
  on($("requestBooking"), "click", function () {
    var ok = pickedDay && pickedTime && validContact($("bName").value, $("bPhone").value, $("bEmail").value);
    $("bookingError").hidden = !!ok;
    if (!ok) return;
    var dayText = pickedDay.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    text($("bookingSummaryText"), service + " on " + dayText + " at " + pickedTime + " Central, for " + $("bName").value.trim() + ". Shante will confirm by phone or email.");
    var body = encodeURIComponent(bookingText());
    var subject = encodeURIComponent("Booking request, " + service + ", " + $("bName").value.trim());
    $("emailBooking").href = "mailto:" + EMAIL + "?subject=" + subject + "&body=" + body;
    $("bookingSummary").hidden = false;
    $("bookingSummary").scrollIntoView({ behavior: "smooth", block: "nearest" });
    var bfd = new FormData($("bookingForm"));
    bfd.set("service", service);
    bfd.set("day", dayText);
    bfd.set("time", pickedTime + " Central");
    fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(bfd).toString() }).catch(function () {});
  });

  /* Smooth in page navigation and hash aliases */
  var ALIASES = {
    "find-a-home": "finder", "create-an-account": "finder", "signup": "finder",
    "homes": "homes", "search": "homes", "home-search": "homes",
    "book": "booking", "book-online": "booking",
    "get-in-touch": "contact"
  };
  function scrollToId(id) {
    var el = $(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
  function handleHash() {
    var raw = (window.location.hash || "").replace(/^#/, "");
    if (!raw) return;
    var target = ALIASES[raw] || raw;
    if ($(target)) scrollToId(target);
  }
  document.querySelectorAll(".topnav a, .hero-actions a").forEach(function (a) {
    a.addEventListener("click", function (e) {
      var href = a.getAttribute("href") || "";
      if (href.charAt(0) !== "#") return; /* real page link: let the browser go there */
      var target = href.replace(/^#/, "");
      if ($(target)) {
        e.preventDefault();
        history.replaceState(null, "", "#" + target);
        scrollToId(target);
      }
    });
  });
  function highlightNav() {
    var ids = ["finder", "booking", "next", "areas", "contact"].filter(function (id) { return $(id); });
    if (!ids.length) return;
    var current = ids[0];
    ids.forEach(function (id) {
      var el = $(id);
      if (el && el.getBoundingClientRect().top <= 120) current = id;
    });
    document.querySelectorAll(".topnav a").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-nav") === current);
    });
  }
  window.addEventListener("scroll", highlightNav, { passive: true });
  window.addEventListener("hashchange", handleHash);
  handleHash();
  highlightNav();

  /* Create an Account form: saves to Netlify AND on the visitor's device */
  (function () {
    var KEY = "shanteAccount";
    function readSaved() { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; } }
    function acctText() {
      var lines = [];
      lines.push("Create an account for " + ($("aFirst").value.trim() + " " + $("aLast").value.trim()).trim());
      lines.push("Email: " + $("aEmail").value.trim());
      lines.push("Phone: " + $("aPhone").value.trim());
      lines.push("City or ZIP: " + $("aCity").value.trim());
      lines.push("Looking to: " + $("aGoal").value);
      lines.push("Max price: " + $("aPrice").value.trim());
      return lines.join("\n");
    }
    function acctValid() {
      return $("aFirst").value.trim().length > 1 && $("aLast").value.trim().length > 1 && /.+@.+\..+/.test($("aEmail").value.trim());
    }
    function syncAcct() {
      var body = encodeURIComponent(acctText());
      $("emailAccount").href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Create an account") + "&body=" + body;
    }
    /* Prefill name, phone, email on the finder, booking, and contact pages from a saved account */
    var saved = readSaved();
    if (saved) {
      var map = { fFirstName: saved.firstName || "", fLastName: saved.lastName || "", bName: saved.firstName && saved.lastName ? saved.firstName + " " + saved.lastName : "", cName: saved.firstName && saved.lastName ? saved.firstName + " " + saved.lastName : "", fPhone: saved.phone || "", bPhone: saved.phone || "", cPhone: saved.phone || "", fEmail: saved.email || "", bEmail: saved.email || "", cEmail: saved.email || "", aFirst: saved.firstName || "", aLast: saved.lastName || "", aEmail: saved.email || "", aPhone: saved.phone || "", aCity: saved.cityZip || "", aPrice: saved.maxPrice || "" };
      Object.keys(map).forEach(function (id) { var el = $(id); if (el && map[id] && !el.value) el.value = map[id]; });
      if ($("aGoal") && saved.goal) $("aGoal").value = saved.goal;
      if (saved.goal) {
        var goalBtn = document.querySelector('#goalPills button[data-goal="' + saved.goal + '"]');
        if (goalBtn && !goalBtn.classList.contains("active")) goalBtn.click();
      }
      if ($("accountSaved")) $("accountSaved").hidden = false;
    }
    var form = $("accountForm");
    if (!form) return;
    ["aFirst", "aLast", "aEmail", "aPhone", "aCity", "aPrice"].forEach(function (id) { on($(id), "input", syncAcct); });
    on($("aGoal"), "change", syncAcct);
    ["emailAccount"].forEach(function (id) {
      on($(id), "click", function (e) { if (!acctValid()) { e.preventDefault(); $("accountError").hidden = false; } else { $("accountError").hidden = true; } });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!acctValid()) { $("accountError").hidden = false; return; }
      $("accountError").hidden = true;
      var data = { firstName: $("aFirst").value.trim(), lastName: $("aLast").value.trim(), email: $("aEmail").value.trim(), phone: $("aPhone").value.trim(), cityZip: $("aCity").value.trim(), goal: $("aGoal").value, maxPrice: $("aPrice").value.trim() };
      try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (err) {}
      /* Send the account to Shante through Netlify Forms, where it is stored for her */
      var fd = new FormData(form);
      fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(fd).toString() })
        .then(function () { $("accountSaved").hidden = false; $("accountSaved").scrollIntoView({ behavior: "smooth", block: "nearest" }); })
        .catch(function () { $("accountSaved").hidden = false; });
    });
    syncAcct();
  })();

  /* Get in Touch form */
  (function () {
    var form = $("contactForm");
    if (!form) return;
    function msgText() {
      var lines = [];
      lines.push("Message for Shante from " + $("cName").value.trim());
      lines.push("Phone: " + $("cPhone").value.trim());
      lines.push("Email: " + $("cEmail").value.trim());
      lines.push("Message: " + $("cMsg").value.trim());
      return lines.join("\n");
    }
    function msgValid() {
      return $("cName").value.trim().length > 1 && /.+@.+\..+/.test($("cEmail").value.trim());
    }
    function syncMsg() {
      var body = encodeURIComponent(msgText());
      $("emailContact").href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Message for Shante") + "&body=" + body;
    }
    ["cName", "cPhone", "cEmail", "cMsg"].forEach(function (id) { on($(id), "input", syncMsg); });
    ["emailContact"].forEach(function (id) {
      on($(id), "click", function (e) { if (!msgValid()) { e.preventDefault(); $("contactError").hidden = false; } else { $("contactError").hidden = true; } });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!msgValid()) { $("contactError").hidden = false; return; }
      $("contactError").hidden = true;
      var fd = new FormData(form);
      fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(fd).toString() })
        .then(function () { $("contactSent").hidden = false; })
        .catch(function () { $("contactSent").hidden = false; });
    });
    syncMsg();
  

})();
})();
