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


    const buttonHolder = document.querySelector(".buttonholder");
    const adminToggle = document.getElementById("adminToggle");
    const generateArrayButton = document.getElementById("generateArray");
    const createNewTomtButton = document.getElementById("createNewTomt");
    const mapHolder = document.querySelector(".mapholder");

    const editModal = document.getElementById("editModal");
    const closeModal = document.getElementById("closeModal");
    const saveTomt = document.getElementById("saveTomt");

    let activeButton = null;

    adminToggle.addEventListener("click", () => {
        const isAdminMode = adminToggle.textContent === "Aktiver Admin-modus";
        adminToggle.textContent = isAdminMode ? "Deaktiver Admin-modus" : "Aktiver Admin-modus";
        generateArrayButton.style.display = isAdminMode ? "flex" : "none";
        createNewTomtButton.style.display = isAdminMode ? "flex" : "none";
        document.body.classList.toggle("admin-mode", isAdminMode);
    });

    createNewTomtButton.addEventListener("click", () => {
        const newTomtNumber = buttons.length + 1;
        const newButton = createNewButton(newTomtNumber);
        buttonHolder.appendChild(newButton);
    });

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

    closeModal.addEventListener("click", () => {
        editModal.style.display = "none";
    });

    saveTomt.addEventListener("click", () => {
        // Oppdater knappedata fra modal
        const tomtNummer = document.getElementById("tomtNummer").value;
        const tomtStatus = document.getElementById("tomtStatus").value;
        const tomtNavn = document.getElementById("tomtNavn").value;
        const tomtTekst = document.getElementById("tomtTekst").value;
        const tomt360 = document.getElementById("tomt360").value;

        activeButton.querySelector(".number").textContent = tomtNummer;
        activeButton.dataset.status = tomtStatus;
        activeButton.dataset.navn = tomtNavn;
        activeButton.dataset.tekst = tomtTekst;
        activeButton.dataset.bilde360 = tomt360;

        // Oppdater bakgrunnsfarge basert på status
        setButtonBackground(activeButton, tomtStatus);

        // Skjul modal
        editModal.style.display = "none";
    });

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
        }
    }

