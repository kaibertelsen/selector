
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
    const buttons = document.querySelectorAll('.selectbutton');
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
            button.removeEventListener("dragend", dragEnd);

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
            tekst: button.dataset.tekst || "",
            bilde360: button.dataset.bilde360 || "",
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
            if(tomt.status == "ledig"){
            newButton.addEventListener("click", handleTomteknappClick);
            }
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
        newButton.dataset.posX = tomtData.posX || 10;
        newButton.dataset.posY = tomtData.posY || 10;

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
                button.style.backgroundColor = "rgba(0, 255, 0, 0.8)";
                break;
            case "reservert":
                button.style.backgroundColor = "rgba(255, 255, 0, 0.8)";
                break;
            case "opptatt":
                button.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
                break;
            default:
                button.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        }
}



// Funksjon som kjøres når en tomteknapp trykkes i brukermodus
function handleTomteknappClick(event) {
    if (isAdminMode) return; // Ikke gjør noe i admin-modus
    document.getElementById("selecttabbutton").click();
    const button = event.target.closest(".selectbutton");

    document.getElementById("headertomtnamelable").textContent = button.dataset.navn || "Ukjent tomt";
    document.getElementById("tomtetextlable").textContent = button.dataset.tekst || "Ukjent tomt";


      // Starter 360-visning med 100 ms forsinkelse hvis bilde360 finnes
      if (button.dataset.bilde360 && button.dataset.bilde360.trim() !== "") {
        setTimeout(() => {
            start360Viewer(button.dataset.bilde360);
            scrollToTop();
        }, 500);
    }

}

function backtooverview(){
    stop360Viewer();
    document.getElementById("overviewtabbutton").click();
    document.getElementById("backtooverviewbutton").style.display = "none";
}

let currentViewer = null; // Variabel for å holde viewer-instansen

function initialize360Viewer(url) {
    let update = true;
    const panoramaDiv = document.getElementById("panorama");
    if (!panoramaDiv) {
        // Opprett panorama-div hvis det ikke finnes
        const newPanoramaDiv = document.createElement("div");
        newPanoramaDiv.id = "panorama";
        newPanoramaDiv.style.width = "100%";
        newPanoramaDiv.style.height = "100%";
        newPanoramaDiv.style.zIndex = "0";
        document.getElementById("panpramaviewer").appendChild(newPanoramaDiv);
        update = false;
    }

    if (!currentViewer) {
        // Opprett viewer hvis det ikke finnes
        currentViewer = pannellum.viewer('panorama', {
            "default": {
                "firstScene": "defaultScene",
                "autoLoad": true,
                "autoRotate": -1.5,
                "showControls": false
            },
            "scenes": {
                "defaultScene": {
                    "type": "equirectangular",
                    "panorama": url,
                    "autoLoad": true
                }
            }
        });
        update = false;
    }
    return update;
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth" // Gir en jevn rulleffekt
    });
}


function start360Viewer(url) {

    let update =  initialize360Viewer(url); // Sørg for at viewer er initialisert
   
    const panoramaDiv = document.getElementById("panorama");
    if (panoramaDiv) {
        panoramaDiv.style.display = "block"; // Gjør div-en synlig igjen
    }

if(update){
    // Legg til eller oppdater en scene
    currentViewer.addScene("newScene", {
        "type": "equirectangular",
        "panorama": url,
        "defaultZoom": 1, 
        "autoLoad": true,
        "autoRotate": -1.5
    });

    // Last den nye scenen
    currentViewer.loadScene("newScene");
    currentViewer.resize(); // Juster visningen
}
    // Vis tilbakeknappen
    document.getElementById("backtooverviewbutton").style.display = "block";
}

function stop360Viewer() {
    if (currentViewer) {
        currentViewer.stopAutoRotate(); // Stopp rotasjon
    }

    const panoramaDiv = document.getElementById("panorama");
    if (panoramaDiv) {
        panoramaDiv.style.display = "none"; // Skjul div i stedet for å fjerne den
    }

    // Skjul tilbakeknappen
    document.getElementById("backtooverviewbutton").style.display = "none";
}
