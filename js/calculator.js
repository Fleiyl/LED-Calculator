document.addEventListener("DOMContentLoaded", () => {

    console.log("Calculator loaded.");

    // =========================
    // ELEMENT
    // =========================

    const ledTypeSelect = document.getElementById("ledType");
    const lampModelSelect = document.getElementById("lampModel");

    const lampPower = document.getElementById("lampPower");
    const lampFlux = document.getElementById("lampFlux");
    const lampLength = document.getElementById("lampLength");

    console.log("Lamp Database:", lampData);

    // =========================
    // CHECK DATABASE
    // =========================

    if (!Array.isArray(lampData)) {
        console.error("lampData tidak ditemukan atau bukan Array.");
        return;
    }

    if (lampData.length === 0) {
        console.error("lampData kosong.");
        return;
    }

    // =========================
    // GET UNIQUE LED FAMILIES
    // =========================

    const families = [
        ...new Set(
            lampData
                .map(lamp => lamp.family)
                .filter(family => family)
        )
    ];

    console.log("LED Families:", families);

    // =========================
    // POPULATE LED TYPE
    // =========================

    ledTypeSelect.innerHTML = "";

    const defaultTypeOption = document.createElement("option");
    defaultTypeOption.value = "";
    defaultTypeOption.textContent = "Select LED Type";
    ledTypeSelect.appendChild(defaultTypeOption);

    families.forEach(family => {

        const option = document.createElement("option");

        option.value = family;
        option.textContent = family;

        ledTypeSelect.appendChild(option);
    });

    // =========================
    // INITIAL LAMP MODEL STATE
    // =========================

    lampModelSelect.innerHTML = "";

    const defaultModelOption = document.createElement("option");
    defaultModelOption.value = "";
    defaultModelOption.textContent = "Select Lamp Model";

    lampModelSelect.appendChild(defaultModelOption);

    lampModelSelect.disabled = true;

    // =========================
    // LED TYPE CHANGE
    // =========================

    ledTypeSelect.addEventListener("change", () => {

        const selectedFamily = ledTypeSelect.value;

        console.log("Selected LED Type:", selectedFamily);

        lampModelSelect.innerHTML = "";

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select Lamp Model";

        lampModelSelect.appendChild(defaultOption);

        if (!selectedFamily) {
            lampModelSelect.disabled = true;
            return;
        }

        const filteredLamps = lampData.filter(
            lamp => lamp.family === selectedFamily
        );

        console.log("Filtered Lamps:", filteredLamps);

        filteredLamps.forEach(lamp => {

            const option = document.createElement("option");

            option.value = lamp.id;
            option.textContent = lamp.name;

            lampModelSelect.appendChild(option);
        });

        lampModelSelect.disabled = false;
    });

    // =========================
    // LAMP MODEL CHANGE
    // =========================

    lampModelSelect.addEventListener("change", () => {

        const selectedId = Number(lampModelSelect.value);

        const selectedLamp = lampData.find(
            lamp => lamp.id === selectedId
        );

        console.log("Selected Lamp:", selectedLamp);

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

});
