function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => resolve();
        script.onerror = () => reject(`Failed to load script: ${url}`);
        document.head.appendChild(script);
    });
}

// Liste over CDN-URL-er som skal lastes inn
const cdnScripts = [
    "https://kaibertelsen.github.io/selector/propertyinfo.js",
    "https://kaibertelsen.github.io/selector/selectorlist.js"
];

// Laste inn alle skriptene sekvensielt
cdnScripts.reduce((promise, script) => {
    return promise.then(() => loadScript(script));
}, Promise.resolve()).then(() => {
    console.log("All scripts loaded");
    listbuttons(tomter);

}).catch(error => {
    console.error(error);
});

/*<script src="https://kaibertelsen.github.io/innkjopsgruppen/value/valueloader.js"></script>*/