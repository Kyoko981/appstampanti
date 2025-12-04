/* ===== LOGIN ===== */
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

/* ===== RICERCA DNS AUTOMATICA ===== */
document.addEventListener("DOMContentLoaded", () => {
    const ipField = document.getElementById("ip");
    if (ipField) {
        ipField.addEventListener("input", cercaDNS);
    }
});

async function cercaDNS() {
    let ip = document.getElementById("ip").value.trim();
    let res = document.getElementById("risultato");
    let copyBtn = document.getElementById("copyBtn");

    if (!ip) {
        res.innerText = "";
        copyBtn.style.display = "none";
        return;
    }

    let file = await fetch("stampanti.csv?" + Date.now());
    let text = await file.text();
    let lines = text.split(/\r?\n/);

    for (let l of lines) {
        let [c_ip, c_dns] = l.split(";");
        if (c_ip && c_ip.trim() === ip) {
            res.innerText = "DNS: " + c_dns;
            copyBtn.dataset.dns = c_dns;
            copyBtn.style.display = "block";
            return;
        }
    }

    res.innerText = "❌ DNS non trovato";
    copyBtn.style.display = "none";
}

/* ===== BOTTONE COPIA DNS ===== */
function copiaDNS() {
    let btn = document.getElementById("copyBtn");
    navigator.clipboard.writeText(btn.dataset.dns);

    btn.innerText = "✔ Copiato!";
    setTimeout(() => btn.innerText = "📋 Copia DNS", 1500);
}

/* ===== NEVE SUPER VELOCE + SCIOGLIMENTO ===== */
function creaNeve() {
    const snow = document.createElement("div");
    snow.className = "snowflake";
    snow.textContent = "❄";

    snow.style.left = Math.random() * 100 + "vw";
    snow.style.fontSize = (Math.random() * 10 + 16) + "px";
    snow.style.animationDuration = (Math.random() * 4 + 4) + "s"; 
    snow.style.opacity = Math.random() * 0.9 + 0.1;

    document.body.appendChild(snow);
    setTimeout(() => snow.remove(), 7000);
}

setInterval(creaNeve, 160);

/* ===== ULTIMO ACCESSO ===== */
window.onload = () => {
    let last = localStorage.getItem("ultimoAccesso");
    if (last) document.getElementById("ultimoAccesso").innerText = last;
};
