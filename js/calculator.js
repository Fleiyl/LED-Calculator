// =====================================================
// 1. GET HTML ELEMENTS
// =====================================================

const ledTypeSelect = document.getElementById("ledType");
const lampModelSelect = document.getElementById("lampModel");

const lampPower = document.getElementById("lampPower");
const lampFlux = document.getElementById("lampFlux");
const lampLength = document.getElementById("lampLength");


// =====================================================
// 2. CREATE LED TYPE DROPDOWN
// =====================================================

const families = [...new Set(
    lampData.map(lamp => lamp.family)
)];

families.forEach(family => {

    const option = document.createElement("option");

    option.value = family;
    option.textContent = family;

    ledTypeSelect.appendChild(option);

});


// =====================================================
// 3. LED TYPE → LAMP MODEL
// =====================================================

ledTypeSelect.addEventListener("change", function () {

    const selectedFamily = this.value;

    lampModelSelect.innerHTML =
        '<option value="">Select Lamp Model</option>';

    lampPower.textContent = "-";
    lampFlux.textContent = "-";
    lampLength.textContent = "-";

    if (!selectedFamily) {
        lampModelSelect.disabled = true;
        return;
    }

    const filteredLamps = lampData.filter(
        lamp => lamp.family === selectedFamily
    );

    filteredLamps.forEach(lamp => {

        const option = document.createElement("option");

        option.value = lamp.id;
        option.textContent = lamp.name;

        lampModelSelect.appendChild(option);

    });

    lampModelSelect.disabled = false;

});


// =====================================================
// 4. LAMP MODEL → LAMP SPECIFICATION
// =====================================================

lampModelSelect.addEventListener("change", function () {

    const selectedId = this.value;

    const selectedLamp = lampData.find(
        lamp => lamp.id == selectedId
    );

    if (!selectedLamp) {
        lampPower.textContent = "-";
        lampFlux.textContent = "-";
        lampLength.textContent = "-";
        return;
    }

    lampPower.textContent = selectedLamp.power;
    lampFlux.textContent = selectedLamp.flux;
    lampLength.textContent = selectedLamp.length;

});
