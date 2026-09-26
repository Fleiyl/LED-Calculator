const ledTypeSelect = document.getElementById("ledType");

const families = [...new Set(
    lampData.map(lamp => lamp.family)
)];

families.forEach(family => {

    const option = document.createElement("option");

    option.value = family;
    option.textContent = family;

    ledTypeSelect.appendChild(option);

});
