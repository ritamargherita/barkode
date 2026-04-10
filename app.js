const samples = [
  {
    id: "sample-dog-complete",
    label: "Balanced adult dog kibble",
    data: {
      productName: "Harbor Hound Adult Salmon",
      barcode: "5412345678901",
      species: "dog",
      lifeStage: "adult",
      feedType: "complete",
      format: "dry",
      isDietetic: false,
      typeShown: true,
      speciesShown: true,
      hasAnalyticalConstituents: true,
      hasAdditives: true,
      hasFeedingInstructions: true,
      hasContactChannel: true,
      hasVetAdvice: false,
      moisture: 8,
      protein: 27,
      fat: 15,
      fibre: 2.5,
      ash: 7.2,
      calcium: 1.2,
      phosphorus: 0.92,
      sodium: 0.21
    }
  },
  {
    id: "sample-cat-snack",
    label: "Cat complementary snack with gaps",
    data: {
      productName: "Moonstripe Tuna Topper",
      barcode: "8711111111111",
      species: "cat",
      lifeStage: "adult",
      feedType: "complementary",
      format: "wet",
      isDietetic: false,
      typeShown: true,
      speciesShown: true,
      hasAnalyticalConstituents: true,
      hasAdditives: false,
      hasFeedingInstructions: false,
      hasContactChannel: true,
      hasVetAdvice: false,
      moisture: 82,
      protein: 10.5,
      fat: 1.2,
      fibre: 0.3,
      ash: 2.1,
      calcium: 0.14,
      phosphorus: 0.11,
      sodium: null
    }
  },
  {
    id: "sample-mineral-edge",
    label: "High-ash mineral complementary feed",
    data: {
      productName: "Farmstead Mineral Boost",
      barcode: "4000000000005",
      species: "dog",
      lifeStage: "growth",
      feedType: "mineral",
      format: "dry",
      isDietetic: false,
      typeShown: true,
      speciesShown: true,
      hasAnalyticalConstituents: true,
      hasAdditives: true,
      hasFeedingInstructions: true,
      hasContactChannel: true,
      hasVetAdvice: false,
      moisture: 5,
      protein: null,
      fat: null,
      fibre: null,
      ash: 45,
      calcium: 16,
      phosphorus: 8,
      sodium: 2.4
    }
  }
];

const installStatusMessages = {
  ios: "On iPhone: open barkode in Safari, tap Share, then tap Add to Home Screen.",
  android:
    "On Android: open barkode in Chrome, tap the menu, then tap Install app or Add to Home Screen.",
  desktop:
    "On desktop: use this as your visual prototype. For phone practice, publish it to a small HTTPS host and open it from your device.",
  fallback:
    "Next step for phone practice: publish this folder to Netlify, Vercel, or GitHub Pages, then add it to the home screen from your phone browser."
};

const fieldIds = [
  "productName",
  "barcode",
  "species",
  "lifeStage",
  "feedType",
  "format",
  "isDietetic",
  "typeShown",
  "speciesShown",
  "hasAnalyticalConstituents",
  "hasAdditives",
  "hasFeedingInstructions",
  "hasContactChannel",
  "hasVetAdvice",
  "moisture",
  "protein",
  "fat",
  "fibre",
  "ash",
  "calcium",
  "phosphorus",
  "sodium"
];

function $(id) {
  return document.getElementById(id);
}

function detectInstallPlatform() {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return "ios";
  }

  if (/android/.test(userAgent)) {
    return "android";
  }

  if (/mac|win|linux/.test(userAgent)) {
    return "desktop";
  }

  return "fallback";
}

function toNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function round(value, decimals = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return null;
  }

  return Number(value.toFixed(decimals));
}

function percentToDryMatter(asFedPercent, moisturePercent) {
  if (
    asFedPercent === null ||
    moisturePercent === null ||
    moisturePercent >= 100
  ) {
    return null;
  }

  const dryMatter = 100 - moisturePercent;
  if (dryMatter <= 0) {
    return null;
  }

  return (asFedPercent / dryMatter) * 100;
}

function getFormData() {
  return {
    productName: $("productName").value.trim(),
    barcode: $("barcode").value.trim(),
    species: $("species").value,
    lifeStage: $("lifeStage").value,
    feedType: $("feedType").value,
    format: $("format").value,
    isDietetic: $("isDietetic").checked,
    typeShown: $("typeShown").checked,
    speciesShown: $("speciesShown").checked,
    hasAnalyticalConstituents: $("hasAnalyticalConstituents").checked,
    hasAdditives: $("hasAdditives").checked,
    hasFeedingInstructions: $("hasFeedingInstructions").checked,
    hasContactChannel: $("hasContactChannel").checked,
    hasVetAdvice: $("hasVetAdvice").checked,
    moisture: toNumber($("moisture").value),
    protein: toNumber($("protein").value),
    fat: toNumber($("fat").value),
    fibre: toNumber($("fibre").value),
    ash: toNumber($("ash").value),
    calcium: toNumber($("calcium").value),
    phosphorus: toNumber($("phosphorus").value),
    sodium: toNumber($("sodium").value)
  };
}

function applyDataToForm(data) {
  fieldIds.forEach((fieldId) => {
    const field = $(fieldId);
    const value = data[fieldId];
    if (field.type === "checkbox") {
      field.checked = Boolean(value);
    } else {
      field.value = value ?? "";
    }
  });
}

function resetForm() {
  applyDataToForm({
    productName: "",
    barcode: "",
    species: "",
    lifeStage: "adult",
    feedType: "complete",
    format: "dry",
    isDietetic: false,
    typeShown: true,
    speciesShown: true,
    hasAnalyticalConstituents: true,
    hasAdditives: true,
    hasFeedingInstructions: true,
    hasContactChannel: true,
    hasVetAdvice: false,
    moisture: "",
    protein: "",
    fat: "",
    fibre: "",
    ash: "",
    calcium: "",
    phosphorus: "",
    sodium: ""
  });
  $("sampleSelect").value = "";
}

function addFinding(collection, severity, title, detail, basis) {
  collection.push({ severity, title, detail, basis });
}

function requiredAnalyticalFieldsForFeed(feedType) {
  if (feedType === "mineral") {
    return ["calcium", "phosphorus", "sodium"];
  }

  return ["protein", "fat", "fibre", "ash"];
}

function severityLabel(severity) {
  switch (severity) {
    case "high":
      return "Action needed";
    case "medium":
      return "Important";
    case "low":
      return "Good";
    default:
      return "Context";
  }
}

function summarizeSeverity(findings) {
  const counts = findings.reduce(
    (accumulator, finding) => {
      accumulator[finding.severity] += 1;
      return accumulator;
    },
    { high: 0, medium: 0, low: 0, info: 0 }
  );

  if (counts.high > 0) {
    return {
      headline: "This label has clear issues under the current barkode rule set.",
      tone: "Needs attention"
    };
  }

  if (counts.medium > 0) {
    return {
      headline: "This label is usable, but there are important limitations or cautions.",
      tone: "Partial confidence"
    };
  }

  return {
    headline: "No obvious rule break was found in the data entered here.",
    tone: "Promising"
  };
}

function evaluate(data) {
  const findings = [];
  const computedFacts = [];
  const requiredFields = requiredAnalyticalFieldsForFeed(data.feedType);
  const dryMatterFacts = [];

  if (!data.productName) {
    addFinding(
      findings,
      "info",
      "No product name entered",
      "That is fine for testing, but a real barcode lookup should anchor the analysis to one specific SKU.",
      "Product workflow"
    );
  }

  if (!data.typeShown) {
    addFinding(
      findings,
      "high",
      "Feed type is not shown on the label",
      "EU labelling rules require pet food to indicate whether it is complete or complementary feed.",
      "Regulation (EC) No 767/2009, Article 15(a)"
    );
  }

  if (!data.speciesShown || !data.species) {
    addFinding(
      findings,
      "high",
      "Target species is missing",
      "Compound feed labelling should indicate the species or category of animals the feed is intended for.",
      "Regulation (EC) No 767/2009, Article 17(1)(a)"
    );
  }

  if (!data.hasFeedingInstructions) {
    addFinding(
      findings,
      "high",
      "Feeding instructions are missing",
      "Compound feed should carry instructions for proper use so the purchaser knows how the product is intended to be fed.",
      "Regulation (EC) No 767/2009, Article 17(1)(b)"
    );
  }

  if (!data.hasAdditives) {
    addFinding(
      findings,
      "high",
      "Additives section is missing",
      "Pet food labelling should include the additives information required under the feed-additive rules.",
      "Regulation (EC) No 767/2009, Article 15(f) and Annex VII"
    );
  }

  if (!data.hasContactChannel) {
    addFinding(
      findings,
      "medium",
      "No contact channel was captured",
      "Pet food labels should include a free telephone number or another appropriate way for purchasers to request additive and ingredient information.",
      "Regulation (EC) No 767/2009, Article 19"
    );
  }

  if (!data.hasAnalyticalConstituents) {
    addFinding(
      findings,
      "high",
      "Analytical constituents are missing",
      "This blocks the minimum label checks and makes nutrient screening much weaker.",
      "Regulation (EC) No 767/2009, Annex VII, Chapter II"
    );
  }

  if (data.hasAnalyticalConstituents) {
    const missingConstituents = requiredFields.filter((key) => data[key] === null);
    if (missingConstituents.length > 0) {
      const labelNames = {
        protein: "protein",
        fat: "fat",
        fibre: "fibre",
        ash: "ash",
        calcium: "calcium",
        phosphorus: "phosphorus",
        sodium: "sodium"
      };
      addFinding(
        findings,
        "high",
        "Some expected analytical constituents are missing",
        `For this feed type, barkode expected: ${missingConstituents
          .map((key) => labelNames[key])
          .join(", ")}.`,
        "Regulation (EC) No 767/2009, Annex VII, Chapter II"
      );
    }
  }

  if (data.feedType === "complementary") {
    addFinding(
      findings,
      "medium",
      "Complementary feed is not nutritionally complete on its own",
      "European law defines complementary feed as sufficient for a daily ration only when used together with other feed.",
      "Regulation (EC) No 767/2009, Article 3(2)(j)"
    );
  }

  if (data.feedType === "mineral") {
    addFinding(
      findings,
      "medium",
      "Mineral feed needs extra care with use directions",
      "High-ash mineral products can be legitimate, but they should be fed exactly as directed and not treated like a full bowl food.",
      "Regulation (EC) No 767/2009, Article 3(2)(k) and Annex VII"
    );
  }

  if (data.ash !== null && data.ash >= 40 && data.feedType !== "mineral") {
    addFinding(
      findings,
      "high",
      "Ash level looks like a mineral feed, but the selected type is not mineral",
      "EU law defines mineral feed as complementary feed containing at least 40% crude ash.",
      "Regulation (EC) No 767/2009, Article 3(2)(k)"
    );
  }

  if (data.isDietetic && !data.hasVetAdvice) {
    addFinding(
      findings,
      "high",
      "Dietetic feed is missing the expert-advice warning",
      "Dietetic feed should indicate that a nutrition expert or veterinarian should be consulted before use or before extending its period of use.",
      "Regulation (EC) No 767/2009, Article 18(c)"
    );
  }

  if (data.moisture !== null) {
    ["protein", "fat", "fibre", "ash", "calcium", "phosphorus", "sodium"].forEach((key) => {
      if (data[key] !== null) {
        const dryMatterValue = round(percentToDryMatter(data[key], data.moisture));
        if (dryMatterValue !== null) {
          dryMatterFacts.push(`${key}: ${dryMatterValue}% DM`);
        }
      }
    });
  }

  if (dryMatterFacts.length > 0) {
    computedFacts.push(...dryMatterFacts.slice(0, 4));
  }

  if (data.calcium !== null && data.phosphorus !== null && data.phosphorus > 0) {
    const ratio = round(data.calcium / data.phosphorus);
    computedFacts.push(`Ca:P ratio: ${ratio}:1`);

    let minRatio = 1;
    let maxRatio = 2;
    let basis = "FEDIAF Nutritional Guidelines 2025, Tables III-3/III-4";

    if (data.species === "cat" && data.lifeStage === "growth") {
      maxRatio = 1.5;
    } else if (data.species === "dog" && data.lifeStage === "growth") {
      maxRatio = 1.6;
      basis =
        "FEDIAF Nutritional Guidelines 2025, Table III-3c; early growth and some late-growth diets use tighter upper limits";
    }

    if (ratio < minRatio || ratio > maxRatio) {
      addFinding(
        findings,
        "high",
        "Calcium-to-phosphorus ratio falls outside barkode's current safe range",
        `Calculated ratio is ${ratio}:1. This prototype expects ${minRatio}:1 to ${maxRatio}:1 for the selected species and life stage.`,
        basis
      );
    } else {
      addFinding(
        findings,
        "low",
        "Calcium-to-phosphorus ratio is within the current barkode range",
        `Calculated ratio is ${ratio}:1 for the data entered.`,
        basis
      );
    }
  } else {
    addFinding(
      findings,
      "info",
      "Calcium-phosphorus ratio could not be checked",
      "That needs both calcium and phosphorus on the label or from the manufacturer.",
      "FEDIAF Nutritional Guidelines 2025"
    );
  }

  if (data.feedType === "complete") {
    addFinding(
      findings,
      "info",
      "Full nutrient adequacy still needs more than the front-label panel",
      "FEDIAF recommendations depend on life stage, energy basis, and additional nutrients like amino acids, vitamins, and trace elements. A barcode app will need manufacturer data or OCR of the full label to go further safely.",
      "FEDIAF Nutritional Guidelines 2025"
    );
  }

  if (data.species === "cat") {
    addFinding(
      findings,
      "info",
      "Cat food screening is especially limited without taurine and additive details",
      "Cats have species-specific requirements such as taurine, and those are often not fully assessable from a short analytical panel.",
      "FEDIAF Nutritional Guidelines 2025"
    );
  }

  if (!data.barcode) {
    addFinding(
      findings,
      "info",
      "No barcode captured yet",
      "This MVP is label-first. The next build should attach this rule engine to barcode lookup and OCR so users do not type values by hand.",
      "Product roadmap"
    );
  }

  return { findings, computedFacts };
}

function renderSummary(data, findings) {
  const { headline, tone } = summarizeSeverity(findings);
  const high = findings.filter((item) => item.severity === "high").length;
  const medium = findings.filter((item) => item.severity === "medium").length;
  const info = findings.filter((item) => item.severity === "info").length;
  const productLabel = data.productName || "Untitled product";

  $("summaryCard").innerHTML = `
    <h3>${headline}</h3>
    <p>${productLabel} is currently treated as <strong>${data.feedType}</strong> for a <strong>${data.species || "not yet specified"}</strong>.</p>
    <div class="summary-meta">
      <span>Status: ${tone}</span>
      <span>${high} high-priority findings</span>
      <span>${medium} cautions</span>
      <span>${info} context notes</span>
    </div>
  `;
}

function renderFacts(facts) {
  if (!facts.length) {
    $("computedFacts").innerHTML = '<span class="fact-pill">Add moisture and minerals to unlock more calculations.</span>';
    return;
  }

  $("computedFacts").innerHTML = facts
    .map((fact) => `<span class="fact-pill">${fact}</span>`)
    .join("");
}

function renderFindings(findings) {
  const ordered = [...findings].sort((left, right) => {
    const order = { high: 0, medium: 1, low: 2, info: 3 };
    return order[left.severity] - order[right.severity];
  });

  $("resultsList").innerHTML = ordered
    .map(
      (finding) => `
        <article class="result-card" data-severity="${finding.severity}">
          <div class="result-top">
            <h3>${finding.title}</h3>
            <span class="badge ${finding.severity}">${severityLabel(finding.severity)}</span>
          </div>
          <p>${finding.detail}</p>
          <p><strong>Basis:</strong> ${finding.basis}</p>
        </article>
      `
    )
    .join("");
}

function analyze() {
  const data = getFormData();
  const { findings, computedFacts } = evaluate(data);
  renderSummary(data, findings);
  renderFacts(computedFacts);
  renderFindings(findings);
}

function populateSamples() {
  const sampleSelect = $("sampleSelect");
  samples.forEach((sample) => {
    const option = document.createElement("option");
    option.value = sample.id;
    option.textContent = sample.label;
    sampleSelect.append(option);
  });

  sampleSelect.addEventListener("change", (event) => {
    const sample = samples.find((item) => item.id === event.target.value);
    if (!sample) {
      return;
    }

    applyDataToForm(sample.data);
    analyze();
  });
}

function init() {
  populateSamples();
  $("analyzeButton").addEventListener("click", analyze);
  $("resetButton").addEventListener("click", () => {
    resetForm();
    analyze();
  });
  $("installStatus").textContent =
    installStatusMessages[detectInstallPlatform()] || installStatusMessages.fallback;
  resetForm();
  analyze();
  registerServiceWorker();
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      $("installStatus").textContent =
        "This preview still works in the browser, but offline install features are not active yet in this environment.";
    });
  });
}

init();
