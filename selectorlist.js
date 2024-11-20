const tomter = [
    {
        airtable: 1,
        nummer: 1,
        status: "ledig",
        navn: "Tomt A",
        tekst: "Denne tomten har fantastisk utsikt.",
        bilde360: "link_til_360_bilde_1",
        posX: 10,
        posY: 10
    },
    {
        airtable: 2,
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
    const createNewTomtButton = document.getElementById("createNewTomt");
    const mapHolder = document.querySelector(".mapholder");

    let isAdminMode = false;
    let buttons = [];

    adminToggle.addEventListener("click", () => {
        isAdminMode = !isAdminMode;
        adminToggle.textContent = isAdminMode ? "Deaktiver Admin-modus" : "Aktiver Admin-modus";
        generateArrayButton.style.display = isAdminMode ? "flex" : "none";
        createNewTomtButton.style.display = isAdminMode ? "flex" : "none";
        document.body.classList.toggle("admin-mode", isAdminMode);

        buttons = document.querySelectorAll(".selectbutton");
        buttons.forEach(button => {
            button.draggable = isAdminMode;

            if (isAdminMode) {
                button.addEventListener("click", editTomt);
                button.addEventListener("dragstart", dragStart);
                button.addEventListener("dragend", dragEnd);
            } else {
                button.removeEventListener("click", editTomt);
                button.removeEventListener("dragstart", dragStart);
                button.removeEventListener("dragend", dragEnd);
            }
        });
    });

    createNewTomtButton.addEventListener("click", () => {
        const newTomtNumber = buttons.length + 1; // Generer nytt tomtenummer
        const newButton = createNewButton(newTomtNumber);
        buttonHolder.appendChild(newButton);
        buttons = document.querySelectorAll(".selectbutton");
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

            const buttonRect = activeButton.getBoundingClientRect();
            const buttonWidth = buttonRect.width;
            const buttonHeight = buttonRect.height;

            // Beregn senterposisjon
            const posX = ((event.clientX - rect.left - buttonWidth / 2) / mapWidth) * 100;
            const posY = ((event.clientY - rect.top - buttonHeight / 2) / mapHeight) * 100;

            activeButton.style.left = `${posX}%`;
            activeButton.style.top = `${posY}%`;
            activeButton.dataset.posX = posX.toFixed(2);
            activeButton.dataset.posY = posY.toFixed(2);

            activeButton = null;
        }
    }

    generateArrayButton.addEventListener("click", () => {
        const tomterArray = Array.from(buttons).map(button => ({
            airtable: button.dataset.airtable || null,
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
            const newButton = createNewButton(tomt.nummer, tomt);
            buttonHolder.appendChild(newButton);
        });

        // Fjern originalen
        const templateButtonElement = document.querySelector(".selectbutton");
        templateButtonElement.style.display = "none";
    }

    function createNewButton(tomtNumber, tomtData = {}) {
        const templateButton = document.querySelector(".selectbutton");
        const newButton = templateButton.cloneNode(true);
    
        const numberElement = newButton.querySelector(".number");
        numberElement.textContent = tomtNumber;
    
        // Sett standard status til "ledig"
        const status = tomtData.status || "ledig";
        setButtonBackground(newButton, status);
    
        newButton.style.position = "absolute";
        newButton.style.left = `${tomtData.posX || 10}%`;
        newButton.style.top = `${tomtData.posY || 10}%`;
        newButton.style.display = "flex"; // Sørg for at knappen vises som flex
    
        newButton.dataset.airtable = tomtData.airtable || null;
        newButton.dataset.navn = tomtData.navn || `Tomt ${tomtNumber}`;
        newButton.dataset.tekst = tomtData.tekst || "Ingen beskrivelse.";
        newButton.dataset.bilde360 = tomtData.bilde360 || "link_til_360_bilde";
        newButton.dataset.status = status;
    
        newButton.draggable = isAdminMode;
    
        if (isAdminMode) {
            newButton.addEventListener("click", editTomt);
            newButton.addEventListener("dragstart", dragStart);
            newButton.addEventListener("dragend", dragEnd);
        }
    
        return newButton;
    }

    function editTomt(event) {
        const button = event.target.closest(".selectbutton");
        const tomtNumber = button.querySelector(".number").textContent;
        const status = button.dataset.status || "ledig";
    
        const newStatus = prompt(
            `Rediger tomt ${tomtNumber}\nStatus (ledig, reservert, opptatt):`,
            status
        );
    
        if (newStatus) {
            button.dataset.status = newStatus.toLowerCase();
            setButtonBackground(button, newStatus.toLowerCase());
        }
    }

    function setButtonBackground(button, status) {
        switch (status) {
            case "ledig":
                button.style.backgroundColor = "rgba(0, 255, 0, 0.5)"; // Grønn med 50% gjennomsiktighet
                break;
            case "opptatt":
                button.style.backgroundColor = "rgba(255, 0, 0, 0.5)"; // Rød med 50% gjennomsiktighet
                break;
            case "reservert":
                button.style.backgroundColor = "rgba(255, 255, 0, 0.5)"; // Gul med 50% gjennomsiktighet
                break;
            default:
                button.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Standard svart med 50% gjennomsiktighet
        }
    }
}


