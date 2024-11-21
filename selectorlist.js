
    const buttonHolder = document.querySelector(".buttonholder");
    const adminToggle = document.getElementById("adminToggle");
    const generateArrayButton = document.getElementById("generateArray");
    const createNewTomtButton = document.getElementById("createNewTomt");
    const mapHolder = document.querySelector(".mapholder");

    const editModal = document.getElementById("editModal");
    const closeModal = document.getElementById("closeModal");
    const saveTomt = document.getElementById("saveTomt");

    let isAdminMode = false;
    let activeButton = null;

// Funksjon for å håndtere visning og skjuling av kart
function toggleMapWithFade() {
    const satellittkart = document.getElementById("satelittkart");
    const reguleringskart = document.getElementById("reguleringskart");

    if (satellittkart.classList.contains("visible")) {
        // Fader ut satellittkart, inn reguleringskart
        satellittkart.classList.remove("visible");
        satellittkart.classList.add("hidden");
        reguleringskart.classList.remove("hidden");
        reguleringskart.classList.add("visible");
    } else {
        // Fader ut reguleringskart, inn satellittkart
        reguleringskart.classList.remove("visible");
        reguleringskart.classList.add("hidden");
        satellittkart.classList.remove("hidden");
        satellittkart.classList.add("visible");
    }
}

// Legg til en event listener på knappen
document.getElementById("mapchangerbutton").addEventListener("click", toggleMapWithFade);
document.getElementById("backtooverviewbutton").addEventListener("click", backtooverview);



// Aktiver/deaktiver admin-modus
adminToggle.addEventListener("click", () => {
    isAdminMode = !isAdminMode;
    adminToggle.textContent = isAdminMode ? "Deaktiver Admin-modus" : "Aktiver Admin-modus";
    generateArrayButton.style.display = isAdminMode ? "flex" : "none";
    createNewTomtButton.style.display = isAdminMode ? "flex" : "none";
    document.body.classList.toggle("admin-mode", isAdminMode);

    // Oppdater hendelser basert på modus
    buttons.forEach(button => {
        button.draggable = isAdminMode;

        if (isAdminMode) {
            // Legg til admin-spesifikke hendelser
            button.addEventListener("click", editTomt);
            button.addEventListener("dragstart", dragStart);
            button.addEventListener("dragend", dragEnd);

            // Fjern brukermodus-hendelsen midlertidig
            button.removeEventListener("click", handleTomteknappClick);
        } else {
            // Fjern admin-spesifikke hendelser
            button.removeEventListener("click", editTomt);
            button.removeEventListener("dragstart", dragStart);
            button.removeEventListener("dragend");

            // Legg tilbake brukermodus-hendelsen
            button.addEventListener("click", handleTomteknappClick);
        }
    });
});

// Opprett ny tomt
createNewTomtButton.addEventListener("click", () => {
        const newTomtNumber = document.querySelectorAll(".selectbutton").length + 1;
        const newButton = createNewButton(newTomtNumber);
        buttonHolder.appendChild(newButton);
});

// Rediger tomt
function editTomt(event) {
        activeButton = event.target.closest(".selectbutton");

        // Fyll modal med data fra den aktive tomten
        document.getElementById("tomtNummer").value = activeButton.querySelector(".number").textContent;
        document.getElementById("tomtStatus").value = activeButton.dataset.status || "ledig";
        document.getElementById("tomtNavn").value = activeButton.dataset.navn || "";
        document.getElementById("tomtTekst").value = activeButton.dataset.tekst || "";
        document.getElementById("tomt360").value = activeButton.dataset.bilde360 || "";

        // Vis modal
        editModal.style.display = "block";
}

// Lukk modal
closeModal.addEventListener("click", () => {
        editModal.style.display = "none";
});

// Lagre tomteinformasjon
saveTomt.addEventListener("click", () => {
        const tomtNummer = document.getElementById("tomtNummer").value;
        const tomtStatus = document.getElementById("tomtStatus").value;
        const tomtNavn = document.getElementById("tomtNavn").value;
        const tomtTekst = document.getElementById("tomtTekst").value;
        const tomt360 = document.getElementById("tomt360").value;

        // Oppdater knappedata fra modal
        activeButton.querySelector(".number").textContent = tomtNummer;
        activeButton.dataset.status = tomtStatus;
        activeButton.dataset.navn = tomtNavn;
        activeButton.dataset.tekst = tomtTekst;
        activeButton.dataset.bilde360 = tomt360;

        // Oppdater bakgrunnsfarge
        setButtonBackground(activeButton, tomtStatus);

        // Skjul modal
        editModal.style.display = "none";
});

// Dra og slipp funksjonalitet
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

// Generer array
generateArrayButton.addEventListener("click", () => {
        const buttons = document.querySelectorAll(".selectbutton");
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

// Opprett nye knapper basert på tomter
function listbuttons(data) {
        data.forEach(tomt => {
            const newButton = createNewButton(tomt.nummer, tomt);
            newButton.addEventListener("click", handleTomteknappClick);
            buttonHolder.appendChild(newButton);
        });

        // Fjern mal-knappen
        const templateButton = document.querySelector(".selectbutton");
        templateButton.style.display = "none";



}

// Opprett en ny tomtknapp
function createNewButton(tomtNumber, tomtData = {}) {
        const templateButton = document.querySelector(".selectbutton");
        const newButton = templateButton.cloneNode(true);

        const numberElement = newButton.querySelector(".number");
        numberElement.textContent = tomtNumber;

        const status = tomtData.status || "ledig";
        setButtonBackground(newButton, status);

        newButton.style.position = "absolute";
        newButton.style.left = `${tomtData.posX || 10}%`;
        newButton.style.top = `${tomtData.posY || 10}%`;
        newButton.style.display = "flex";

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

// Oppdater bakgrunnsfarge basert på status
function setButtonBackground(button, status) {
        switch (status) {
            case "ledig":
                button.style.backgroundColor = "rgba(0, 255, 0, 0.5)";
                break;
            case "reservert":
                button.style.backgroundColor = "rgba(255, 255, 0, 0.5)";
                break;
            case "opptatt":
                button.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
                break;
            default:
                button.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        }
}



// Funksjon som kjøres når en tomteknapp trykkes i brukermodus
function handleTomteknappClick(event) {
    if (isAdminMode) return; // Ikke gjør noe i admin-modus
    document.getElementById("selecttabbutton").click();
    const button = event.target.closest(".selectbutton");

    document.getElementById("headertomtnamelable").textContent = button.dataset.navn || "Ukjent tomt";
    document.getElementById("tomtetextlable").textContent = button.dataset.tekst || "Ukjent tomt";

    if(button.dataset.bilde360 != ""){
    start360Viewer(button.dataset.bilde360 || "");
    }
}

function backtooverview(){
    stop360Viewer();
    document.getElementById("overviewtabbutton").click();
    document.getElementById("backtooverviewbutton").style.display = "none";
}

let currentViewer = null; // Variabel for å holde viewer-instansen

function initialize360Viewer(url) {
    // Opprett panorama-div hvis det ikke finnes
    let panoramaDiv = document.getElementById("panorama");
    if (!panoramaDiv) {
        panoramaDiv = document.createElement("div");
        panoramaDiv.id = "panorama";
        panoramaDiv.style.width = "100%";
        panoramaDiv.style.height = "100%";
        panoramaDiv.style.zIndex = "0";
        document.getElementById("panpramaviewer").appendChild(panoramaDiv);
    }

    // Opprett viewer hvis det ikke finnes
    if (!currentViewer) {
        currentViewer = pannellum.viewer('panorama', {
            "type": "equirectangular",
            "panorama": url, // Start uten panoramabilde
            "autoLoad": true,
            "showControls": false,
            "autoRotate": -1.5 // Rotasjonshastighet
        });

        let interactionTimeout = null;

        // Funksjon for å starte rotasjon etter brukerinteraksjon
        function startRotationAfterDelay() {
            interactionTimeout = setTimeout(() => {
                if (currentViewer) {
                    currentViewer.startAutoRotate(-1.5);
                }
            }, 5000);
        }

        // Stopp rotasjonen ved brukerinteraksjon
        function stopRotationOnInteraction() {
            clearTimeout(interactionTimeout);
            if (currentViewer) {
                currentViewer.stopAutoRotate();
            }
        }

        // Lytt etter brukerinteraksjon
        currentViewer.on('mousedown', stopRotationOnInteraction);
        currentViewer.on('touchstart', stopRotationOnInteraction);
        currentViewer.on('pointerdown', stopRotationOnInteraction);

        // Start rotasjon igjen etter interaksjon
        currentViewer.on('mouseup', startRotationAfterDelay);
        currentViewer.on('touchend', startRotationAfterDelay);
        currentViewer.on('pointerup', startRotationAfterDelay);
    }
}

function update360Viewer(url) {
    if (currentViewer) {
        currentViewer.setPanorama(url, { 
            "autoLoad": true, 
            "autoRotate": -1.5 // Start rotasjon umiddelbart
        });
    } else {
        console.error("Viewer er ikke initialisert.");
    }
}

function start360Viewer(url) {

    if(currentViewer){
        update360Viewer(url)
    }else{
        initialize360Viewer(url); // Førstegang
    }
    // Vis tilbakeknappen
    document.getElementById("backtooverviewbutton").style.display = "block";
}

function stop360Viewer() {
    // Stopp rotasjon og skjul panorama-div
    if (currentViewer) {
        currentViewer.stopAutoRotate();
    }

    const panoramaDiv = document.getElementById("panorama");
    if (panoramaDiv) {
        panoramaDiv.style.display = "none"; // Skjul div i stedet for å fjerne den
    }

   
}
