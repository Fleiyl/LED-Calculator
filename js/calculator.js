// ======================================================
// MARINE LIGHTING CALCULATOR
// ======================================================


// ======================================================
// 1. GET HTML ELEMENTS
// ======================================================

// Room dimension
const lengthInput =
    document.getElementById("length");

const widthInput =
    document.getElementById("width");

const ceilingHeightInput =
    document.getElementById("ceilingHeight");

const workingHeightInput =
    document.getElementById("workingHeight");


// Lamp selection
const ledTypeSelect =
    document.getElementById("ledType");

const lampModelSelect =
    document.getElementById("lampModel");


// Lamp specification
const lampPower =
    document.getElementById("lampPower");

const lampFlux =
    document.getElementById("lampFlux");

const lampLength =
    document.getElementById("lampLength");


// Reflection
const ceilingReflectionSelect =
    document.getElementById("ceilingReflection");

const wallReflectionSelect =
    document.getElementById("wallReflection");

const floorReflectionSelect =
    document.getElementById("floorReflection");


// Target illuminance
const targetLuxInput =
    document.getElementById("targetLux");


// Calculate button
const calculateButton =
    document.getElementById("calculateButton");


// Error message
const errorMessage =
    document.getElementById("errorMessage");


// Results
const areaResult =
    document.getElementById("areaResult");

const mountingHeightResult =
    document.getElementById("mountingHeightResult");

const roomIndexResult =
    document.getElementById("roomIndexResult");

const efficiencyResult =
    document.getElementById("efficiencyResult");

const tlResult =
    document.getElementById("tlResult");

const requiredFluxResult =
    document.getElementById("requiredFluxResult");

const calculatedQuantityResult =
    document.getElementById("calculatedQuantityResult");

const fixedQuantityResult =
    document.getElementById("fixedQuantityResult");

const actualLuxResult =
    document.getElementById("actualLuxResult");

const totalPowerResult =
    document.getElementById("totalPowerResult");


// ======================================================
// 2. INITIAL SETTINGS
// ======================================================

lampModelSelect.disabled = true;


// ======================================================
// 3. CREATE LED TYPE DROPDOWN
// ======================================================

const families = [
    ...new Set(
        lampData.map(lamp => lamp.family)
    )
];


families.forEach(family => {

    const option =
        document.createElement("option");

    option.value = family;
    option.textContent = family;

    ledTypeSelect.appendChild(option);

});


// ======================================================
// 4. LED TYPE → LAMP MODEL
// ======================================================

ledTypeSelect.addEventListener(
    "change",
    function () {

        const selectedFamily =
            this.value;


        // Reset model dropdown
        lampModelSelect.innerHTML =
            '<option value="">Select Lamp Model</option>';


        // Reset specification
        resetLampSpecification();


        // No family selected
        if (!selectedFamily) {

            lampModelSelect.disabled = true;

            return;
        }


        // Find lamps belonging to selected family
        const filteredLamps =
            lampData.filter(
                lamp =>
                    lamp.family === selectedFamily
            );


        // Add lamp models
        filteredLamps.forEach(lamp => {

            const option =
                document.createElement("option");

            option.value = lamp.id;

            option.textContent =
                lamp.name;

            lampModelSelect.appendChild(option);

        });


        // Enable lamp model dropdown
        lampModelSelect.disabled = false;

    }
);


// ======================================================
// 5. LAMP MODEL → LAMP SPECIFICATION
// ======================================================

lampModelSelect.addEventListener(
    "change",
    function () {

        const selectedId =
            Number(this.value);


        const selectedLamp =
            lampData.find(
                lamp =>
                    lamp.id === selectedId
            );


        if (!selectedLamp) {

            resetLampSpecification();

            return;
        }


        // Display lamp specification
        lampPower.textContent =
            formatNumber(selectedLamp.power);

        lampFlux.textContent =
            formatNumber(selectedLamp.flux);

        lampLength.textContent =
            formatNumber(selectedLamp.length);

    }
);


// ======================================================
// 6. CALCULATE BUTTON
// ======================================================

calculateButton.addEventListener(
    "click",
    calculateLighting
);


// ======================================================
// 7. MAIN CALCULATION FUNCTION
// ======================================================

function calculateLighting() {

    clearError();


    // --------------------------------------------------
    // GET INPUT VALUES
    // --------------------------------------------------

    const length =
        Number(lengthInput.value);

    const width =
        Number(widthInput.value);

    const ceilingHeight =
        Number(ceilingHeightInput.value);

    const workingHeight =
        Number(workingHeightInput.value);

    const targetLux =
        Number(targetLuxInput.value);


    const ceilingReflection =
        Number(ceilingReflectionSelect.value);

    const wallReflection =
        Number(wallReflectionSelect.value);

    const floorReflection =
        Number(floorReflectionSelect.value);


    const selectedLampId =
        Number(lampModelSelect.value);


    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    const validationError =
        validateInputs({
            length,
            width,
            ceilingHeight,
            workingHeight,
            targetLux,
            selectedLampId
        });


    if (validationError) {

        showError(validationError);

        return;
    }


    // --------------------------------------------------
    // GET SELECTED LAMP
    // --------------------------------------------------

    const selectedLamp =
        lampData.find(
            lamp =>
                lamp.id === selectedLampId
        );


    if (!selectedLamp) {

        showError(
            "Selected lamp could not be found."
        );

        return;
    }


    // --------------------------------------------------
    // ROOM AREA
    // --------------------------------------------------

    const roomArea =
        length * width;


    // --------------------------------------------------
    // MOUNTING HEIGHT
    // --------------------------------------------------

    const mountingHeight =
        ceilingHeight - workingHeight;


    // --------------------------------------------------
    // ROOM INDEX
    // --------------------------------------------------

    const roomIndex =
        (
            length * width
        ) /
        (
            mountingHeight *
            (length + width)
        );


    // --------------------------------------------------
    // EFFICIENCY
    // --------------------------------------------------
    //
    // eff_data.js is intentionally NOT used.
    //
    // Temporary value:
    // efficiency = 1.00
    //
    // This means the current calculation does not apply
    // a separate utilization efficiency factor.
    //
    // Replace this value later when the engineering
    // efficiency method has been finalized.
    // --------------------------------------------------

    const efficiency = 1.00;


    // --------------------------------------------------
    // TOTAL LOSS FACTOR
    // --------------------------------------------------
    //
    // Temporary value:
    // TL = 1.00
    //
    // No additional loss factor is applied for now.
    //
    // Reflection values are still read from the UI
    // so they can be integrated later.
    // --------------------------------------------------

    const totalLossFactor = 1.00;


    // --------------------------------------------------
    // REQUIRED LUMINOUS FLUX
    // --------------------------------------------------
    //
    // Basic lumen-method relationship:
    //
    // Required Flux =
    // Target Lux × Area
    // ----------------------------
    // Efficiency × Loss Factor
    //
    // --------------------------------------------------

    const requiredFlux =
        (
            targetLux *
            roomArea
        ) /
        (
            efficiency *
            totalLossFactor
        );


    // --------------------------------------------------
    // CALCULATED LAMP QUANTITY
    // --------------------------------------------------

    const calculatedQuantity =
        requiredFlux /
        selectedLamp.flux;


    // --------------------------------------------------
    // FIXED LAMP QUANTITY
    // --------------------------------------------------
    //
    // Number of lamps must be an integer.
    //
    // Therefore round UP.
    // --------------------------------------------------

    const fixedQuantity =
        Math.ceil(calculatedQuantity);


    // --------------------------------------------------
    // ACTUAL ILLUMINANCE
    // --------------------------------------------------

    const actualLux =
        (
            fixedQuantity *
            selectedLamp.flux *
            efficiency *
            totalLossFactor
        ) /
        roomArea;


    // --------------------------------------------------
    // TOTAL POWER
    // --------------------------------------------------

    const totalPower =
        fixedQuantity *
        selectedLamp.power;


    // --------------------------------------------------
    // DISPLAY RESULTS
    // --------------------------------------------------

    areaResult.textContent =
        formatNumber(roomArea, 2);

    mountingHeightResult.textContent =
        formatNumber(mountingHeight, 2);

    roomIndexResult.textContent =
        formatNumber(roomIndex, 2);

    efficiencyResult.textContent =
        formatPercentage(efficiency);

    tlResult.textContent =
        formatPercentage(totalLossFactor);

    requiredFluxResult.textContent =
        formatNumber(requiredFlux, 0);

    calculatedQuantityResult.textContent =
        formatNumber(calculatedQuantity, 2);

    fixedQuantityResult.textContent =
        formatNumber(fixedQuantity, 0);

    actualLuxResult.textContent =
        formatNumber(actualLux, 1);

    totalPowerResult.textContent =
        formatNumber(totalPower, 0);


    // --------------------------------------------------
    // OPTIONAL CONSOLE DEBUG
    // --------------------------------------------------

    console.log("=== MARINE LIGHTING CALCULATION ===");

    console.log({
        length,
        width,
        ceilingHeight,
        workingHeight,

        roomArea,
        mountingHeight,
        roomIndex,

        ceilingReflection,
        wallReflection,
        floorReflection,

        selectedLamp,

        targetLux,

        efficiency,
        totalLossFactor,

        requiredFlux,
        calculatedQuantity,
        fixedQuantity,

        actualLux,
        totalPower
    });

}


// ======================================================
// 8. VALIDATION FUNCTION
// ======================================================

function validateInputs({
    length,
    width,
    ceilingHeight,
    workingHeight,
    targetLux,
    selectedLampId
}) {

    if (!Number.isFinite(length) || length <= 0) {

        return "Length must be greater than 0.";

    }


    if (!Number.isFinite(width) || width <= 0) {

        return "Width must be greater than 0.";

    }


    if (
        !Number.isFinite(ceilingHeight) ||
        ceilingHeight <= 0
    ) {

        return "Ceiling height must be greater than 0.";

    }


    if (
        !Number.isFinite(workingHeight) ||
        workingHeight < 0
    ) {

        return "Working height cannot be negative.";

    }


    if (workingHeight >= ceilingHeight) {

        return (
            "Working height must be lower than ceiling height."
        );

    }


    if (
        !Number.isFinite(targetLux) ||
        targetLux <= 0
    ) {

        return "Target illuminance must be greater than 0.";

    }


    if (!selectedLampId) {

        return "Please select a lamp model.";

    }


    return null;
}


// ======================================================
// 9. RESET LAMP SPECIFICATION
// ======================================================

function resetLampSpecification() {

    lampPower.textContent = "-";

    lampFlux.textContent = "-";

    lampLength.textContent = "-";

}


// ======================================================
// 10. ERROR MESSAGE
// ======================================================

function showError(message) {

    errorMessage.textContent = message;

    errorMessage.hidden = false;

}


function clearError() {

    errorMessage.textContent = "";

    errorMessage.hidden = true;

}


// ======================================================
// 11. NUMBER FORMATTER
// ======================================================

function formatNumber(
    value,
    decimalPlaces = 0
) {

    return Number(value).toLocaleString(
        "en-US",
        {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces
        }
    );

}


// ======================================================
// 12. PERCENTAGE FORMATTER
// ======================================================

function formatPercentage(value) {

    return `${(
        value * 100
    ).toFixed(0)}%`;

}
