async function login() {
    let matr = document.getElementById("matricola").value.trim();

    if (!matr) return;

    let res = await fetch("autorizzati.txt?" + Date.now());
    let text = await res.text();
    let list = text.split(/\r?\n/).map(x => x.trim());

    if (!list.includes(matr)) {
        document.getElementById("loginError").innerText = "Matricola non autorizzata";
        return;
    }

    localStorage.setItem("ultimoAccesso", new Date().toLocaleString("it-IT"));
    document.getElementById("ultimoAccesso").innerText = localStorage.getItem("ultimoAccesso");

    document.getElementById("loginBox").style.display = "none";
    document.getElementById("app").style.display = "block";
}

// ===== RICERCA DNS AUTOMATICA mentre scrivi =====
document.addEventListener("DOMContentLoaded", () => {
    const ipField = document.getElementById("ip");
    if (ipField) {
        ipField.addEventListener("input", cercaDNS);
    }
});

async function cercaDNS() {
    let ip = document.getElementById("ip").value.trim();
    if (!ip) {
        document.getElementById("risultato").innerText = "";
        return;
    }

    let res = await fetch("stampanti.csv?" + Date.now());
    let text = await res.text();

    let lines = text.split(/\r?\n/);

    for (let l of lines) {
        let [c_ip, c_dns] = l.split(";");
        if (c_ip && c_ip.trim() === ip) {
            document.getElementById("risultato").innerText = "DNS: " + c_dns;
            return;
        }
    }

    document.getElementById("risultato").innerText = "❌ DNS non trovato";
}

// ===== NEVE ANIMATA LENTA E ROTANTE =====

function creaNeve() {
    const snow = document.createElement("div");
    snow.className = "snowflake";
    snow.textContent = "❄";

    snow.style.left = Math.random() * 100 + "vw";
    snow.style.fontSize = (Math.random() * 10 + 16) + "px";
    snow.style.animationDuration = (Math.random() * 10 + 10) + "s";
    snow.style.opacity = Math.random() * 0.9 + 0.1;

    document.body.appendChild(snow);

    setTimeout(() => snow.remove(), 20000);
}

// neve lenta
setInterval(creaNeve, 250);

// ultimo accesso
window.onload = () => {
    let last = localStorage.getItem("ultimoAccesso");
    if (last) document.getElementById("ultimoAccesso").innerText = last;
};
