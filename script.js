// ===============================================================
//  CONFIGURAZIONE SUPABASE
// ===============================================================
const SUPABASE_URL = "https://vtmuhinvdxrcsktnskav.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0bXVoaW52ZHhyY3NrdG5za2F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MjcyMDksImV4cCI6MjA4MDQwMzIwOX0.VVxvoAFdxxyaeun_OCxGvh96H-Wo6thq5g-uhWrg_uI";

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ===============================================================
//  CARICA CSV STAMPANTI (IP → DNS)
// ===============================================================
let stampantiMap = {};

async function caricaCSV() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/kyoko981/appstampanti/main/stampanti.csv?" + Date.now());
        const text = await response.text();

        stampantiMap = {};
        const righe = text.split("\n");

        righe.forEach(riga => {
            const [ip, dns] = riga.split(";");
            if (ip && dns) {
                stampantiMap[ip.trim()] = dns.trim();
            }
        });

        console.log("CSV caricato:", Object.keys(stampantiMap).length, "voci");
    } catch (err) {
        console.error("Errore caricando CSV:", err);
    }
}

caricaCSV();

// ===============================================================
// CERCA DNS AUTOMATICAMENTE SCRIVENDO L'IP
// ===============================================================
async function cercaDNS() {
    const ip = document.getElementById("ipInput").value.trim();
    const output = document.getElementById("risultato");
    const copiaBtn = document.getElementById("btnCopia");

    if (!ip) {
        output.innerHTML = "Inserisci un IP…";
        copiaBtn.style.display = "none";
        return;
    }

    if (stampantiMap[ip]) {
        output.innerHTML = `✔ DNS trovato: <b>${stampantiMap[ip]}</b>`;
        copiaBtn.style.display = "inline-block";
        copiaBtn.dataset.value = stampantiMap[ip];
        return;
    }

    output.innerHTML = "❌ DNS non trovato";
    copiaBtn.style.display = "none";
}

// ===============================================================
//  COPIA DNS
// ===============================================================
function copiaDNS(btn) {
    navigator.clipboard.writeText(btn.dataset.value);
    btn.innerHTML = "✔ Copiato!";
    setTimeout(() => btn.innerHTML = "Copia DNS", 1200);
}

// ===============================================================
//  AGGIUNGI STAMPANTE IN SUPABASE
// ===============================================================
async function aggiungiStampante() {
    const ip = document.getElementById("add_ip").value.trim();
    const dns = document.getElementById("add_dns").value.trim();
    const msg = document.getElementById("add_msg");

    if (!ip || !dns) {
        msg.style.color = "#ff4444";
        msg.innerHTML = "⚠ Inserisci sia IP che DNS.";
        return;
    }

    // Inserisci nel DB Supabase (duplicati bloccati da policy RLS)
    const { data, error } = await sb
        .from("stampanti_in_attesa")
        .insert([{ ip, dns }]);

    if (error) {
        if (error.message.includes("duplicate")) {
            msg.style.color = "#ff4444";
            msg.innerHTML = "❌ IP già inserito in attesa.";
        } else {
            msg.style.color = "#ff4444";
            msg.innerHTML = "❌ Errore server: " + error.message;
        }
        return;
    }

    msg.style.color = "#00cc66";
    msg.innerHTML = "✔ Aggiunto correttamente!";
    
    document.getElementById("add_ip").value = "";
    document.getElementById("add_dns").value = "";
}

// ===============================================================
//  NEVE REGOLATA PIÙ VELOCE E SU TUTTO LO SFONDO
// ===============================================================
function initSnow() {
    const snowContainer = document.createElement('div');
    snowContainer.id = "snow";
    document.body.appendChild(snowContainer);

    const numeroFiocchi = 60;

    for (let i = 0; i < numeroFiocchi; i++) {
        const fiocco = document.createElement('div');
        fiocco.className = 'fiocco';
        fiocco.style.left = Math.random() * 100 + "vw";
        fiocco.style.animationDuration = (4 + Math.random() * 4) + "s"; // più veloce
        fiocco.style.opacity = Math.random();
        fiocco.style.fontSize = (10 + Math.random() * 14) + "px";

        snowContainer.appendChild(fiocco);
    }
}

document.addEventListener("DOMContentLoaded", initSnow);
