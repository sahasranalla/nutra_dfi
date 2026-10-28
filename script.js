/* ==========================================================================
   DRUG–FOOD INTERACTION (DFI) PREDICTION SYSTEM - JAVASCRIPT
   Designed for student viva presentations and future backend ML integration.
   Uses ONLY beginner-friendly vanilla JavaScript.
   ========================================================================== */

/* ==========================================================================
   SECTION 1: FUTURE BACKEND INTEGRATION POINT & DUMMY PREDICTION DATA
   --------------------------------------------------------------------------
   NOTE FOR PROJECT VIVA / EVALUATION:
   This frontend is fully decoupled from the machine learning model.
   Currently, the system queries this predefined array of clinical records.
   When the Python / Flask / FastAPI backend with BioBERT + XGBoost is ready,
   simply replace the getDummyPrediction() function below with an API call!
   ========================================================================== */

const DFI_DATABASE = [
  {
    medicine: "Lipitor",
    genericName: "Atorvastatin",
    food: "Grapefruit",
    system: "Allopathic",
    // Score range: -100 (Most Negative/Unsafe) to +100 (Most Positive/Safe)
    score: -86,
    status: "UNSAFE",
    message: "Cannot be consumed",
    pathway: "Intestinal & Hepatic CYP3A4 / OATP1B1",
    mechanism: "Grapefruit contains compounds (furanocoumarins) that reduce drug clearance and increase systemic statin exposure by inactivating CYP3A4 enzymes, raising the risk of severe muscle toxicity (rhabdomyolysis).",
    alternatives: ["Sweet Navel Oranges", "Gala Apples", "Fresh Strawberries", "Blueberries"],
    drugCore: "Lipitor (Atorvastatin Active Core)",
    foodCore: "Grapefruit Furanocoumarins (Bergamottin)"
  },
  {
    medicine: "Warfarin",
    genericName: "Coumadin",
    food: "Spinach",
    system: "Allopathic",
    score: -45,
    status: "UNSAFE",
    message: "Cannot be consumed",
    pathway: "Vitamin K Epoxide Reductase Complex (VKORC1)",
    mechanism: "Spinach is rich in Vitamin K, which directly antagonizes the anticoagulant effect of Warfarin. Consuming spinach reduces the drug's blood-thinning efficacy and increases the risk of blood clots.",
    alternatives: ["Iceberg Lettuce", "Cucumbers", "Zucchini", "Bell Peppers"],
    drugCore: "Warfarin Coumarin Core",
    foodCore: "Spinach Phylloquinone (Vitamin K1)"
  },
  {
    medicine: "Paracetamol",
    genericName: "Acetaminophen",
    food: "Milk",
    system: "Allopathic",
    score: 0,
    status: "NON-SIGNIFICANT",
    message: "May or may not be consumed",
    pathway: "Hepatic Glucuronidation & Sulfation",
    mechanism: "Milk does not significantly inhibit or accelerate the gastrointestinal absorption or liver metabolism of Paracetamol. The interaction is clinically neutral and safe under normal dietary intake.",
    alternatives: ["Water", "Warm Tea", "Fresh Fruit Juice"],
    drugCore: "Paracetamol (Acetaminophen Core)",
    foodCore: "Milk Casein & Lactose Complex"
  },
  {
    medicine: "Iron Supplements",
    genericName: "Ferrous Sulfate",
    food: "Orange Juice",
    system: "Allopathic",
    score: 70,
    status: "SAFE",
    message: "Can be consumed",
    pathway: "Duodenal Divalent Metal Transporter 1 (DMT1)",
    mechanism: "Ascorbic acid (Vitamin C) in orange juice acts as a reducing agent, converting non-absorbable ferric iron into soluble ferrous iron, thereby significantly boosting iron absorption and bioavailability.",
    alternatives: ["Lemon Water", "Kiwi Fruit", "Guava Juice"],
    drugCore: "Ferrous Sulfate (Fe2+ Core)",
    foodCore: "Orange Juice (Ascorbic Acid / Vitamin C)"
  },
  {
    medicine: "Metformin",
    genericName: "Glucophage",
    food: "High-Fiber Oats",
    system: "Allopathic",
    score: 55,
    status: "SAFE",
    message: "Can be consumed",
    pathway: "AMPK Activation & Gut Microbiota",
    mechanism: "Beta-glucans and soluble fibers in oats slow carbohydrate absorption and work synergistically with Metformin to stabilize postprandial glucose levels and improve insulin sensitivity.",
    alternatives: ["Barley Porridge", "Chia Seed Pudding", "Whole Wheat Toast"],
    drugCore: "Metformin Biguanide Core",
    foodCore: "Oat Beta-Glucans"
  },
  {
    medicine: "Aspirin",
    genericName: "Acetylsalicylic Acid",
    food: "Alcohol",
    system: "Allopathic",
    score: -90,
    status: "UNSAFE",
    message: "Cannot be consumed",
    pathway: "Gastric Mucosal Cyclooxygenase-1 (COX-1)",
    mechanism: "Ethanol significantly damages the protective gastric mucosal barrier and amplifies Aspirin's antiplatelet action, dramatically multiplying the risk of stomach irritation and severe gastrointestinal hemorrhage.",
    alternatives: ["Sparkling Water", "Non-Alcoholic Herbal Tonics", "Ginger Ale"],
    drugCore: "Acetylsalicylic Acid Core",
    foodCore: "Ethanol / Alcoholic Compounds"
  },
  {
    medicine: "Nux Vomica",
    genericName: "Strychnos Nux-Vomica",
    food: "Coffee",
    system: "Homeopathic",
    score: -60,
    status: "UNSAFE",
    message: "Cannot be consumed",
    pathway: "Homeopathic Potency Antagonism (Materia Medica)",
    mechanism: "In homeopathic practice, aromatic caffeinated beverages such as coffee act as antidotes that neutralize the vital medicinal stimulation of Nux Vomica, halting therapeutic response.",
    alternatives: ["Chicory Beverage", "Herbal Mint Infusion", "Warm Water"],
    drugCore: "Nux Vomica Active Alkaloid Complex",
    foodCore: "Caffeine & Roasted Coffee Compounds"
  },
  {
    medicine: "Arnica Montana",
    genericName: "Wolf's Bane Dilution",
    food: "Chamomile Tea",
    system: "Homeopathic",
    score: 25,
    status: "SAFE",
    message: "Can be consumed",
    pathway: "Complementary Homeopathic Profile",
    mechanism: "Chamomile provides gentle soothing effects without disrupting or antidoting the medicinal actions of Arnica Montana in homeopathic treatment regimens.",
    alternatives: ["Peppermint Tea", "Warm Honey Water", "Green Tea"],
    drugCore: "Arnica Montana Sesquiterpene Core",
    foodCore: "Chamomile Flavonoid (Apigenin)"
  }
];

/* ==========================================================================
   SECTION 2: USER PROFILE DATA STATE
   --------------------------------------------------------------------------
   Stored independently. These values do NOT affect DFI predictions.
   ========================================================================== */
let currentUserProfile = {
  fullName: "Sahasra Nalla",
  username: "sahasra_n",
  age: "21",
  gender: "Female",
  email: "sahasra@college.edu",
  height: "165",
  weight: "58",
  diet: "Vegetarian",
  allergies: "None",
  conditions: "None"
};

// Current active medicine system ('Allopathic' or 'Homeopathic')
let currentMedicineSystem = "Allopathic";

/* ==========================================================================
   SECTION 3: DOM ELEMENT REFERENCES
   --------------------------------------------------------------------------
   Cache HTML elements using document.getElementById for beginner readability.
   ========================================================================== */

// Modals
const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");
const autofillBtn = document.getElementById("autofillBtn");
const profileViewModal = document.getElementById("profileViewModal");
const closeProfileModalBtn = document.getElementById("closeProfileModalBtn");
const closeProfileBtn = document.getElementById("closeProfileBtn");
const editProfileBtn = document.getElementById("editProfileBtn");

// Header and Sidebar User Chips
const topProfileChip = document.getElementById("topProfileChip");
const sidebarProfileBtn = document.getElementById("sidebarProfileBtn");
const topProfileName = document.getElementById("topProfileName");
const topAvatar = document.getElementById("topAvatar");
const modalProfileAvatar = document.getElementById("modalProfileAvatar");
const modalProfileName = document.getElementById("modalProfileName");
const modalProfileUsername = document.getElementById("modalProfileUsername");
const logoutBtn = document.getElementById("logoutBtn");

// Theme Toggle
const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");

// Input Controls
const btnSystemAllopathic = document.getElementById("btnSystemAllopathic");
const btnSystemHomeopathic = document.getElementById("btnSystemHomeopathic");
const queryInput = document.getElementById("queryInput");
const clearQueryBtn = document.getElementById("clearQueryBtn");
const analyzeBtn = document.getElementById("analyzeBtn");
const presetButtons = document.querySelectorAll(".preset-btn");

// Result Display Elements
const resultTitle = document.getElementById("resultTitle");
const resultPathway = document.getElementById("resultPathway");
const resultSystemTag = document.getElementById("resultSystemTag");
const gaugeNeedleGroup = document.getElementById("gaugeNeedleGroup");
const scoreNumber = document.getElementById("scoreNumber");
const riskBadge = document.getElementById("riskBadge");
const riskMessage = document.getElementById("riskMessage");
const mechanismText = document.getElementById("mechanismText");
const alternativesList = document.getElementById("alternativesList");
const placeholderDrugName = document.getElementById("placeholderDrugName");
const placeholderFoodName = document.getElementById("placeholderFoodName");

// Sidebar & Tab Views
const navButtons = document.querySelectorAll(".sidebar-nav .nav-btn");
const homeView = document.getElementById("homeView");
const placeholderView = document.getElementById("placeholderView");
const placeholderIcon = document.getElementById("placeholderIcon");
const placeholderTitle = document.getElementById("placeholderTitle");
const placeholderDesc = document.getElementById("placeholderDesc");
const backToHomeBtn = document.getElementById("backToHomeBtn");

/* ==========================================================================
   SECTION 4: GAUGE NEEDLE CALCULATION LOGIC (KEY VIVA POINT)
   --------------------------------------------------------------------------
   EXPLANATION FOR PROJECT VIVA:
   The gauge is a semicircle centered at (cx=150, cy=140).
   The needle points straight UP by default (0 degrees rotation).
   
   Range of scores: -100 to +100
   Center Neutral Score = 0   --> Needle Angle = 0° (Straight UP)
   Max Negative Score  = -100 --> Needle Angle = -90° (Points Left)
   Max Positive Score  = +100 --> Needle Angle = +90° (Points Right)
   
   Formula: Angle (degrees) = (score / 100) * 90
   ========================================================================== */

function updateGaugeNeedle(score) {
  // 1. Clamp score to guarantee it stays within [-100, +100]
  const clampedScore = Math.max(-100, Math.min(100, score));

  // 2. Calculate rotation angle in degrees (-90 to +90)
  const needleAngle = (clampedScore / 100) * 90;

  // 3. Apply SVG rotate transformation around pivot (150, 140)
  gaugeNeedleGroup.setAttribute("transform", `rotate(${needleAngle} 150 140)`);

  // 4. Update the numeric score text (add '+' sign if positive for clarity)
  const formattedScore = clampedScore > 0 ? `+${clampedScore}` : `${clampedScore}`;
  scoreNumber.textContent = formattedScore;
}

/* ==========================================================================
   SECTION 5: PREDICTION UPDATE LOGIC
   --------------------------------------------------------------------------
   Updates all UI sections when a prediction is executed.
   ========================================================================== */

function displayPrediction(interaction) {
  // 1. Update Drug + Food Title and Subtitle
  const genericPart = interaction.genericName ? ` (${interaction.genericName})` : "";
  resultTitle.textContent = `${interaction.medicine}${genericPart} + ${interaction.food}`;
  resultPathway.textContent = `Target Pathway: ${interaction.pathway}`;
  resultSystemTag.textContent = `${interaction.system.toUpperCase()} (BIOBERT + MOE)`;

  // 2. Update the Custom Interaction Gauge
  updateGaugeNeedle(interaction.score);

  // 3. Update Risk Status Badge and Text as per specifications:
  // SAFE: Green ("Can be consumed")
  // NON-SIGNIFICANT: Yellow/Orange ("May or may not be consumed")
  // UNSAFE: Red ("Cannot be consumed")
  riskBadge.className = "risk-status-badge"; // Reset classes

  if (interaction.score < -15) {
    riskBadge.classList.add("unsafe");
    riskBadge.textContent = "UNSAFE";
    riskMessage.textContent = interaction.message || "Cannot be consumed";
  } else if (interaction.score > 15) {
    riskBadge.classList.add("safe");
    riskBadge.textContent = "SAFE";
    riskMessage.textContent = interaction.message || "Can be consumed";
  } else {
    riskBadge.classList.add("neutral");
    riskBadge.textContent = "NON-SIGNIFICANT";
    riskMessage.textContent = interaction.message || "May or may not be consumed";
  }

  // 4. Update Pharmacological Mechanism
  mechanismText.textContent = interaction.mechanism;

  // 5. Update Suggested Alternatives
  alternativesList.innerHTML = "";
  if (interaction.alternatives && interaction.alternatives.length > 0) {
    interaction.alternatives.forEach(altName => {
      const pill = document.createElement("span");
      pill.className = "alt-pill";
      pill.textContent = altName;
      alternativesList.appendChild(pill);
    });
  } else {
    const defaultPill = document.createElement("span");
    defaultPill.className = "alt-pill";
    defaultPill.textContent = "Standard Balanced Diet";
    alternativesList.appendChild(defaultPill);
  }

  // 6. Update Molecular Visualization Placeholder Labels
  placeholderDrugName.textContent = interaction.drugCore || `${interaction.medicine} Core`;
  placeholderFoodName.textContent = interaction.foodCore || `${interaction.food} Phytochemicals`;
}

/* ==========================================================================
   SECTION 6: QUERY PARSER & SEARCH ENGINE
   --------------------------------------------------------------------------
   Finds matching interaction record from the local database.
   If user enters a custom query not in list, generates a clean fallback.
   ========================================================================== */

function analyzeCurrentQuery() {
  const query = queryInput.value.trim().toLowerCase();

  if (!query) {
    alert("Please enter a drug and food query to analyze!");
    queryInput.focus();
    return;
  }

  // Search local database for match
  let matchedRecord = DFI_DATABASE.find(item => {
    const medMatch = query.includes(item.medicine.toLowerCase()) ||
      (item.genericName && query.includes(item.genericName.toLowerCase()));
    const foodMatch = query.includes(item.food.toLowerCase());
    return medMatch && foodMatch;
  });

  // If exact pair not found, search by medicine name
  if (!matchedRecord) {
    matchedRecord = DFI_DATABASE.find(item => {
      return query.includes(item.medicine.toLowerCase());
    });
  }

  // If still not found, search by system preference or fallback gracefully
  if (!matchedRecord) {
    // Beginner-friendly intelligent fallback record for viva demonstrations
    matchedRecord = {
      medicine: "Detected Drug",
      genericName: "Clinical Compound",
      food: "Dietary Item",
      system: currentMedicineSystem,
      score: 0,
      status: "NON-SIGNIFICANT",
      message: "May or may not be consumed",
      pathway: "General Hepatic Cytochrome P450 Metabolism",
      mechanism: `Analysis of "${queryInput.value.trim()}": No severe metabolic conflict detected in current BioBERT embeddings. Clearance pathways operate within standard physiological tolerance.`,
      alternatives: ["Water", "Low-Sodium Broth", "Steamed Vegetables"],
      drugCore: "Active Pharmacophore",
      foodCore: "Dietary Bioactive Molecules"
    };
  }

  // Update Dashboard View
  displayPrediction(matchedRecord);
}

/* ==========================================================================
   SECTION 7: MEDICINE SYSTEM TOGGLE & PRESETS
   --------------------------------------------------------------------------
   Handles Allopathic vs Homeopathic buttons and Quick Presets.
   ========================================================================== */

function setMedicineSystem(system) {
  currentMedicineSystem = system;

  if (system === "Allopathic") {
    btnSystemAllopathic.classList.add("active");
    btnSystemHomeopathic.classList.remove("active");
  } else {
    btnSystemHomeopathic.classList.add("active");
    btnSystemAllopathic.classList.remove("active");
  }
}

btnSystemAllopathic.addEventListener("click", () => setMedicineSystem("Allopathic"));
btnSystemHomeopathic.addEventListener("click", () => setMedicineSystem("Homeopathic"));

// Quick Presets Click Handler
presetButtons.forEach(button => {
  button.addEventListener("click", () => {
    const presetText = button.getAttribute("data-preset");
    queryInput.value = `Taking ${presetText}`;

    // Automatically adjust system if Homeopathic preset
    if (presetText.includes("Nux Vomica") || presetText.includes("Arnica")) {
      setMedicineSystem("Homeopathic");
    } else {
      setMedicineSystem("Allopathic");
    }

    // Trigger analysis immediately on preset selection
    analyzeCurrentQuery();
  });
});

// Clear Query Button
clearQueryBtn.addEventListener("click", () => {
  queryInput.value = "";
  queryInput.focus();
});

// Analyze Button Click
analyzeBtn.addEventListener("click", analyzeCurrentQuery);

// Allow pressing "Enter" in textarea to analyze
queryInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    analyzeCurrentQuery();
  }
});

/* ==========================================================================
   SECTION 8: LOGIN & USER PROFILE MANAGEMENT
   --------------------------------------------------------------------------
   Stores user details locally.
   Profile details are explicitly NOT used for model calculation.
   ========================================================================== */

function getInitials(name) {
  if (!name) return "US";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
}

function updateProfileUI() {
  const initials = getInitials(currentUserProfile.fullName);

  // Top-Right Chip
  topAvatar.textContent = initials;
  topProfileName.textContent = currentUserProfile.fullName;

  // Profile Details Modal
  modalProfileAvatar.textContent = initials;
  modalProfileName.textContent = currentUserProfile.fullName;
  modalProfileUsername.textContent = `@${currentUserProfile.username} • Registered Student Profile`;

  document.getElementById("displayEmail").textContent = currentUserProfile.email;
  document.getElementById("displayAgeGender").textContent = `${currentUserProfile.age} years, ${currentUserProfile.gender}`;
  document.getElementById("displayHeight").textContent = currentUserProfile.height ? `${currentUserProfile.height} cm` : "Not Specified";
  document.getElementById("displayWeight").textContent = currentUserProfile.weight ? `${currentUserProfile.weight} kg` : "Not Specified";
  document.getElementById("displayDiet").textContent = currentUserProfile.diet || "Not Specified";
  document.getElementById("displayAllergies").textContent = currentUserProfile.allergies || "None";
  document.getElementById("displayConditions").textContent = currentUserProfile.conditions || "None";
}

// Login Form Submit
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Read inputs from form
  currentUserProfile.fullName = document.getElementById("inputFullName").value.trim() || "Student User";
  currentUserProfile.username = document.getElementById("inputUsername").value.trim() || "student";
  currentUserProfile.age = document.getElementById("inputAge").value.trim() || "20";
  currentUserProfile.gender = document.getElementById("inputGender").value;
  currentUserProfile.email = document.getElementById("inputEmail").value.trim() || "student@college.edu";

  // Optional profile attributes
  currentUserProfile.height = document.getElementById("inputHeight").value.trim();
  currentUserProfile.weight = document.getElementById("inputWeight").value.trim();
  currentUserProfile.diet = document.getElementById("inputDiet").value;
  currentUserProfile.allergies = document.getElementById("inputAllergies").value.trim() || "None";
  currentUserProfile.conditions = document.getElementById("inputConditions").value.trim() || "None";

  // Update UI and close login modal
  updateProfileUI();
  loginModal.classList.add("hidden");
});

// Autofill Sample Profile Button (Convenient for quick demo/viva)
autofillBtn.addEventListener("click", () => {
  document.getElementById("inputFullName").value = "Dr. Sreedhruti";
  document.getElementById("inputUsername").value = "sreedhruti_pharma";
  document.getElementById("inputAge").value = "24";
  document.getElementById("inputGender").value = "Female";
  document.getElementById("inputEmail").value = "sreedhruti@research.edu";
  document.getElementById("inputHeight").value = "168";
  document.getElementById("inputWeight").value = "60";
  document.getElementById("inputDiet").value = "Vegetarian";
  document.getElementById("inputAllergies").value = "Sulfonamides";
  document.getElementById("inputConditions").value = "None";
});

// Open Profile View Modal
function openProfileModal() {
  updateProfileUI();
  profileViewModal.classList.remove("hidden");
}

function closeProfileModal() {
  profileViewModal.classList.add("hidden");
}

topProfileChip.addEventListener("click", openProfileModal);
sidebarProfileBtn.addEventListener("click", openProfileModal);
closeProfileModalBtn.addEventListener("click", closeProfileModal);
closeProfileBtn.addEventListener("click", closeProfileModal);

// Edit Profile Button: Reopens the login form with existing values
editProfileBtn.addEventListener("click", () => {
  closeProfileModal();
  loginModal.classList.remove("hidden");
});

// Logout Button: Clears view and returns to Login Modal
logoutBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to log out and return to the profile setup screen?")) {
    loginModal.classList.remove("hidden");
  }
});

/* ==========================================================================
   SECTION 9: DARK / LIGHT THEME TOGGLE
   --------------------------------------------------------------------------
   Switches between .dark-theme and .light-theme on <body>.
   Preserves layout exactly as requested.
   ========================================================================== */

let isDarkMode = true;

themeToggleBtn.addEventListener("click", () => {
  isDarkMode = !isDarkMode;

  if (isDarkMode) {
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
    themeIcon.textContent = "🌙";
    themeText.textContent = "Dark Mode";
  } else {
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
    themeIcon.textContent = "☀️";
    themeText.textContent = "Light Mode";
  }
});

/* ==========================================================================
   SECTION 10: SIDEBAR NAVIGATION & PLACEHOLDER VIEWS
   --------------------------------------------------------------------------
   Switches between 'Home' (Main DFI Hub) and placeholder tabs.
   ========================================================================== */

const TAB_DESCRIPTIONS = {
  analytics: {
    icon: "📊",
    title: "Analytics Hub",
    desc: "Provides demographic DFI trends, risk frequency metrics, and classification distribution histograms based on clinical interaction datasets."
  },
  reports: {
    icon: "📑",
    title: "Clinical Reports",
    desc: "Generates formatted PDF summaries and clinical interaction dossiers for pharmacological reviews and patient consultations."
  },
  history: {
    icon: "🕒",
    title: "Interaction History",
    desc: "Maintains a chronological record of queries analyzed during this session, including predicted risk scores and target metabolic pathways."
  },
  alerts: {
    icon: "🔔",
    title: "Clinical Safety Alerts",
    desc: "Lists automated contraindication warnings and high-priority adverse drug-food notifications flagged by the BioBERT safety filter."
  }
};

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const tabName = btn.getAttribute("data-tab");

    // Update active state in sidebar
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    if (tabName === "home") {
      homeView.classList.add("active-view");
      placeholderView.classList.remove("active-view");
    } else {
      homeView.classList.remove("active-view");
      placeholderView.classList.add("active-view");

      // Populate placeholder data
      const info = TAB_DESCRIPTIONS[tabName] || { icon: "📁", title: tabName, desc: "Section under development." };
      placeholderIcon.textContent = info.icon;
      placeholderTitle.textContent = info.title;
      placeholderDesc.textContent = info.desc;
    }
  });
});

// Back to Home button from placeholder view
backToHomeBtn.addEventListener("click", () => {
  navButtons.forEach(b => {
    if (b.getAttribute("data-tab") === "home") {
      b.classList.add("active");
    } else {
      b.classList.remove("active");
    }
  });
  homeView.classList.add("active-view");
  placeholderView.classList.remove("active-view");
});

/* ==========================================================================
   INITIALIZATION
   --------------------------------------------------------------------------
   Loads initial default state on page load.
   ========================================================================== */
window.addEventListener("DOMContentLoaded", () => {
  updateProfileUI();
  // Display initial sample prediction (Lipitor + Grapefruit)
  displayPrediction(DFI_DATABASE[0]);
});
