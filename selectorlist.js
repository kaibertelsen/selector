const tomter = [
    {
        id: 1,
        nummer: 1,
        status: "ledig",
        navn: "Tomt A",
        tekst: "Denne tomten har fantastisk utsikt.",
        bilde360: "link_til_360_bilde_1",
        posX: 10,
        posY: 10
    },
    {
        id: 2,
        nummer: 2,
        status: "opptatt",
        navn: "Tomt B",
        tekst: "Denne tomten er solgt.",
        bilde360: "link_til_360_bilde_2",
        posX: 20,
        posY: 20
    }
];





function initializeTomterAdmin(tomter) {
    listbuttons(tomter);

    const buttonHolder = document.querySelector(".buttonholder");
    const adminToggle = document.getElementById("adminToggle");
    const generateArrayButton = document.getElementById("generateArray");
    const mapHolder = document.querySelector(".mapholder");

    let isAdminMode = false;
    let buttons = [];

    adminToggle.addEventListener("click", () => {
        isAdminMode = !isAdminMode;
        adminToggle.textContent = isAdminMode ? "Deaktiver Admin-modus" : "Aktiver Admin-modus";
        generateArrayButton.style.display = isAdminMode ? "block" : "none";
        document.body.classList.toggle("admin-mode", isAdminMode);

        // Oppdater knappene
        buttons = document.querySelectorAll(".selectbutton");

        buttons.forEach(button => {
            button.draggable = isAdminMode;

            if (isAdminMode) {
                button.addEventListener("dragstart", dragStart);
                button.addEventListener("dragend", dragEnd);
            } else {
                button.removeEventListener("dragstart", dragStart);
                button.removeEventListener("dragend", dragEnd);
            }
        });
    });

    let activeButton = null;

    function dragStart(event) {
        activeButton = event.target;
    }

    function dragEnd(event) {
        if (activeButton) {
            const rect = mapHolder.getBoundingClientRect();
            const mapWidth = rect.width;
            const mapHeight = rect.height;

            // Beregn prosentbaserte posisjoner
            const posX = ((event.clientX - rect.left) / mapWidth) * 100;
            const posY = ((event.clientY - rect.top) / mapHeight) * 100;

            // Oppdater knappens stil
            activeButton.style.left = `${posX}%`;
            activeButton.style.top = `${posY}%`;
            activeButton.dataset.posX = posX.toFixed(2);
            activeButton.dataset.posY = posY.toFixed(2);

            activeButton = null;
        }
    }

    generateArrayButton.addEventListener("click", () => {
        const tomterArray = Array.from(buttons).map(button => ({
            id: button.dataset.id || null,
            nummer: button.querySelector(".number").textContent,
            status: button.dataset.status || "ledig",
            navn: button.dataset.navn || `Tomt ${button.querySelector(".number").textContent}`,
            tekst: button.dataset.tekst || "Ingen beskrivelse.",
            bilde360: button.dataset.bilde360 || "link_til_360_bilde",
            posX: button.dataset.posX,
            posY: button.dataset.posY
        }));

        console.log(JSON.stringify(tomterArray, null, 2)); // Kopier arrayen fra konsollen
        alert("Tomte-array generert! Sjekk konsollen for data.");
    });

    function listbuttons(data) {
        const buttonHolder = document.querySelector(".buttonholder");
        const templateButton = document.querySelector(".selectbutton");

        data.forEach(tomt => {
            // Klon knappen
            const newButton = templateButton.cloneNode(true);

            // Oppdater tomtenummeret
            const numberElement = newButton.querySelector(".number");
            numberElement.textContent = tomt.nummer;

            // Sett status og farge
            switch (tomt.status) {
                case "ledig":
                    newButton.style.backgroundColor = "green";
                    break;
                case "opptatt":
                    newButton.style.backgroundColor = "red";
                    break;
                case "reservert":
                    newButton.style.backgroundColor = "yellow";
                    break;
            }

            // Sett plassering basert på posisjon
            newButton.style.position = "absolute";
            newButton.style.left = `${tomt.posX}%`;
            newButton.style.top = `${tomt.posY}%`;

            // Legg til data-attributter for ekstra informasjon
            newButton.dataset.id = tomt.id;
            newButton.dataset.navn = tomt.navn;
            newButton.dataset.tekst = tomt.tekst;
            newButton.dataset.bilde360 = tomt.bilde360;

            // Legg til knappen i buttonholder
            buttonHolder.appendChild(newButton);
        });

        // Fjern originalen
        templateButton.style.display = "none";
    }
}

