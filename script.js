/* ============================================================
    LOGIN
============================================================ */
async function login() {
    let matr = document.getElementById("matricola").value.trim();
    if (!matr) return;

    let res = await fetch("autorizzati.txt?" + Date.now());
    let list = (await res.text()).split(/\r?\n/).map(x => x.trim());

    if (!list.includes(matr)) {
        document.getElementById("loginError").innerText = "Matricola non autorizzata";
        return;
    }

    localStorage.setItem("ultimoAccesso", new Date().toLocaleString("it-IT"));
    document.getElementById("ultimoAccesso").innerText =
        localStorage.getItem("ultimoAccesso");

    document.getElementById("loginBox").style.display = "none";
    document.getElementById("app").style.display = "block";
}

/* ============================================================
    RICERCA DNS AUTOMATICA
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    const ipField = document.getElementById("ip");
    if (ipField) ipField.addEventListener("input", cercaDNS);
});

async function cercaDNS() {
    let ip = document.getElementById("ip").value.trim();
    let res = document.getElementById("risultato");
    let btn = document.getElementById("copyBtn");

    if (!ip) {
        res.innerText = "";
        btn.style.display = "none";
        return;
    }

    let file = await fetch("stampanti.csv?" + Date.now());
    let lines = (await file.text()).split(/\r?\n/);

    for (let l of lines) {
        let [c_ip, c_dns] = l.split(";");
        if (c_ip && c_ip.trim() === ip) {
            res.innerText = "DNS: " + c_dns;
            btn.dataset.dns = c_dns;
            btn.style.display = "block";
            return;
        }
    }

    res.innerText = "❌ DNS non trovato";
    btn.style.display = "none";
}

/* ============================================================
    COPIA DNS
============================================================ */
function copiaDNS() {
    let btn = document.getElementById("copyBtn");
    navigator.clipboard.writeText(btn.dataset.dns);

    btn.innerText = "✔ Copiato!";
    setTimeout(() => btn.innerText = "📋 Copia DNS", 1500);
}

/* ============================================================
    NEVE MIGLIORATA (su tutta la pagina)
============================================================ */
function creaNeve() {
    const snow = document.createElement("div");
    snow.className = "snowflake";
    snow.textContent = "❄";

    snow.style.position = "fixed";
    snow.style.left = Math.random() * 100 + "vw";
    snow.style.top = "-10px";

    snow.style.fontSize = (Math.random() * 8 + 14) + "px";
    snow.style.opacity = Math.random() * 0.8 + 0.2;

    snow.style.animationDuration = (Math.random() * 2 + 2.5) + "s";
    snow.style.animationDelay = (Math.random() * 1) + "s";
    snow.style.animationTimingFunction = "linear";

    document.body.appendChild(snow);
    setTimeout(() => snow.remove(), 5000);
}

setInterval(creaNeve, 150);

/* ============================================================
    MODALE AGGIUNGI
============================================================ */
function apriModale() {
    document.getElementById("modal").style.display = "flex";
}

function chiudiModale() {
    document.getElementById("modal").style.display = "none";
    document.getElementById("modalError").innerText = "";
}

/* ============================================================
    AGGIUNGI IP/DNS (controllo + invio)
============================================================ */
async function inviaNuovo() {
    let ip = document.getElementById("new_ip").value.trim();
    let dns = document.getElementById("new_dns").value.trim();
    let err = document.getElementById("modalError");

    if (!ip || !dns) {
        err.innerText = "Compila entrambi i campi.";
        err.style.color = "red";
        return;
    }

    /* --- Controlla stampanti.csv --- */
    let mainCSV = await fetch("stampanti.csv?" + Date.now());
    let mainLines = (await mainCSV.text()).split(/\r?\n/);
    for (let r of mainLines) {
        let [c_ip] = r.split(";");
        if (c_ip === ip) {
            err.innerText = "❌ IP già registrato in stampanti.csv";
            err.style.color = "red";
            return;
        }
    }

    /* --- Controlla inattesa.csv --- */
    let attCSV = await fetch("inattesa.csv?" + Date.now());
    let attLines = (await attCSV.text()).split(/\r?\n/);
    for (let r of attLines) {
        let [c_ip] = r.split(";");
        if (c_ip === ip) {
            err.innerText = "❌ IP già in attesa di registrazione";
            err.style.color = "red";
            return;
        }
    }

    /* --- Se è tutto ok → invia alla Action --- */
    await scriviInAttesa(ip, dns);

    err.style.color = "lightgreen";
    err.innerText = "✔ Aggiunto correttamente! (verrà salvato a breve)";

    /* --- Svuota i campi --- */
    document.getElementById("new_ip").value = "";
    document.getElementById("new_dns").value = "";
}

/* ============================================================
    PRENDE IL TOKEN DA GITHUB PAGES (sicuro)
============================================================ */
async function getDispatchToken() {
    const r = await fetch("/.github/pages/origin/secret/DISPATCH_TOKEN");
    const j = await r.json();
    return j.value;
}

/* ============================================================
    INVIA L'EVENTO ALLA ACTION aggiungi.yml
============================================================ */
async function scriviInAttesa(ip, dns) {

    const token = await getDispatchToken();

    await fetch("https://api.github.com/repos/kyoko981/appstampanti/actions/workflows/aggiungi.yml/dispatches", {
        method: "POST",
        headers: {
            "Accept": "application/vnd.github.everest-preview+json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            ref: "main",
            inputs: {
                ip: ip,
                dns: dns
            }
        })
    });
}

/* ============================================================
    ULTIMO ACCESSO
============================================================ */
window.onload = () => {
    let last = localStorage.getItem("ultimoAccesso");
    if (last) document.getElementById("ultimoAccesso").innerText = last;
};
