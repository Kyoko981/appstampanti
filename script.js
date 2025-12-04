/* ===========================
   SUPABASE CONFIG
=========================== */
const SUPABASE_URL = "https://vtmuhinvdxrcsktnskav.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bXVoaW52ZHhyY3NrdG5za2F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MjcyMDksImV4cCI6MjA4MDQwMzIwOX0.VVxvoAFdxxyaeun_OCxGvh96H-Wo6thq5g-uhWrg_uI";

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ===========================
   ADMIN CHECK
=========================== */
function isAdmin(matricola) {
    return ["r010687"].includes(matricola.toLowerCase());
}

/* ===========================
   LOGIN
=========================== */
function login() {
    let m = document.getElementById("matricola").value.trim().toLowerCase();

    if (!m) {
        document.getElementById("loginError").innerText = "Inserisci una matricola.";
        return;
    }

    localStorage.setItem("matricola", m);

    document.getElementById("loginBox").style.display = "none";
    document.getElementById("app").style.display = "block";

    if (isAdmin(m)) {
        document.getElementById("btnAdmin").style.display = "inline-block";
    }

    let ultimo = new Date().toLocaleString();
    localStorage.setItem("ultimoAccesso", ultimo);
    document.getElementById("ultimoAccesso").innerText = "Ultimo accesso: " + ultimo;
}

/* ===========================
   CARICA CSV STAMPANTI
=========================== */
let stampantiMap = {};

async function caricaCSV() {
    try {
        const res = await fetch("stampanti.csv?" + Date.now());
        const text = await res.text();

        stampantiMap = {};
        text.split("\n").forEach(r => {
            let [ip, dns] = r.split(";");
            if (ip && dns) stampantiMap[ip.trim()] = dns.trim();
        });
    } catch (e) {
        console.error("Errore CSV:", e);
    }
}

caricaCSV();

/* ===========================
   AUTO SEARCH DNS
=========================== */
document.addEventListener("DOMContentLoaded", () => {
    initSnow();

    const ipField = document.getElementById("ipInput");
    if (ipField) ipField.addEventListener("input", cercaDNS);
});

function cercaDNS() {
    const ip = document.getElementById("ipInput").value.trim();
    const out = document.getElementById("risultato");
    const btn = document.getElementById("btnCopia");

    if (!ip) {
        out.innerHTML = "";
        btn.style.display = "none";
        return;
    }

    if (stampantiMap[ip]) {
        out.innerHTML = `✔ DNS: <b>${stampantiMap[ip]}</b>`;
        btn.style.display = "inline-block";
        btn.dataset.value = stampantiMap[ip];
    } else {
        out.innerHTML = "❌ DNS non trovato";
        btn.style.display = "none";
    }
}

/* ===========================
   COPIA DNS
=========================== */
function copiaDNS(btn) {
    navigator.clipboard.writeText(btn.dataset.value);
    btn.innerHTML = "✔ Copiato!";
    setTimeout(() => btn.innerHTML = "Copia DNS", 1200);
}

/* ===========================
   AGGIUNGI STAMPANTE (SUPABASE)
=========================== */
async function aggiungiStampante() {
    const ip = document.getElementById("add_ip").value.trim();
    const dns = document.getElementById("add_dns").value.trim();
    const msg = document.getElementById("add_msg");

    if (!ip || !dns) {
        msg.innerHTML = "⚠ Inserisci IP e DNS.";
        msg.style.color = "#ffaaaa";
        return;
    }

    const { error } = await sb.from("stampanti_in_attesa").insert([{ ip, dns }]);

    if (error) {
        msg.innerHTML = "❌ " + error.message;
        msg.style.color = "#ffaaaa";
        return;
    }

    msg.innerHTML = "✔ Aggiunto con successo!";
    msg.style.color = "#00ff99";

    document.getElementById("add_ip").value = "";
    document.getElementById("add_dns").value = "";
}

/* ===========================
   VAI ADMIN
=========================== */
function vaiAdmin() {
    window.location.href = "admin.html";
}

/* ===========================
   ELIMINA RICHIESTA
=========================== */
async function eliminaRichiesta(id) {
    if (!confirm("Eliminare questa richiesta?")) return;

    await sb.from("stampanti_in_attesa").delete().eq("id", id);

    alert("✔ Eliminato!");
    location.reload();
}

/* ===========================
   NEVE
=========================== */
function initSnow() {
    const c = document.getElementById("snow");

    for (let i = 0; i < 70; i++) {
        let f = document.createElement("div");
        f.className = "fiocco";
        f.textContent = "❄";
        f.style.left = Math.random() * 100 + "vw";
        f.style.animationDuration = (4 + Math.random() * 4) + "s";
        f.style.fontSize = (10 + Math.random() * 24) + "px";
        f.style.opacity = Math.random();
        c.appendChild(f);
    }
}
