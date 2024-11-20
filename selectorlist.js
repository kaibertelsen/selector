const tomter = [
    {
        id: 1,
        nummer: 1,
        status: "ledig",
        navn: "Tomt A",
        tekst: "Denne tomten har fantastisk utsikt.",
        bilde360: "link_til_360_bilde_1",
        posX: 100,
        posY: 150
    },
    {
        id: 2,
        nummer: 2,
        status: "opptatt",
        navn: "Tomt B",
        tekst: "Denne tomten er solgt.",
        bilde360: "link_til_360_bilde_2",
        posX: 200,
        posY: 250
    },
    {
        id: 3,
        nummer: 3,
        status: "reservert",
        navn: "Tomt C",
        tekst: "Denne tomten er reservert.",
        bilde360: "link_til_360_bilde_3",
        posX: 300,
        posY: 350
    }
    // Legg til flere tomter her
];


function listbuttons(data){
    const buttonHolder = document.querySelector(".buttonholder");
    const templateButton = document.querySelector(".selectbutton");

    tomter.forEach(tomt => {
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
        newButton.style.left = `${tomt.posX}px`;
        newButton.style.top = `${tomt.posY}px`;

        // Legg til data-attributter for ekstra informasjon
        newButton.dataset.id = tomt.id;
        newButton.dataset.navn = tomt.navn;
        newButton.dataset.tekst = tomt.tekst;
        newButton.dataset.bilde360 = tomt.bilde360;

        // Legg til event for å vise ekstra informasjon
        newButton.addEventListener("click", () => {
            alert(
                `Tomt: ${tomt.navn}\n` +
                `Status: ${tomt.status}\n` +
                `Info: ${tomt.tekst}\n` +
                `360-bilde: ${tomt.bilde360}`
            );
        });
        
        // Legg til knappen i buttonholder
        buttonHolder.appendChild(newButton);
    });

    // Fjern originalen
    templateButton.style.display = "none";
}
