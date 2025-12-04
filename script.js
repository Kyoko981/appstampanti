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

async function cercaDNS() {
    let ip = document.getElementById("ip").value.trim();
    if (!ip) return;

    let res = await fetch("stampanti.csv?" + Date.now());
    let text = await res.text();

    let lines = text.split(/\r?\n/);

    for (let l of lines) {
        let [c_ip, c_dns] = l.split(";");   // ← QUI IL CAMBIAMENTO IMPORTANTE

        if (c_ip && c_ip.trim() === ip) {
            document.getElementById("risultato").innerText = "DNS: " + c_dns;
            return;
        }
    }

    document.getElementById("risultato").innerText = "❌ DNS non trovato";
}

window.onload = () => {
    let last = localStorage.getItem("ultimoAccesso");
    if (last) document.getElementById("ultimoAccesso").innerText = last;
};

// ===== NEVE ANIMATA =====

function creaNeve() {
    const snow = document.createElement("div");
    snow.className = "snowflake";
    snow.textContent = "❄";

    snow.style.left = Math.random() * 100 + "vw";
    snow.style.fontSize = (Math.random() * 10 + 10) + "px";
    snow.style.animationDuration = (Math.random() * 5 + 5) + "s";

    document.body.appendChild(snow);

    setTimeout(() => snow.remove(), 12000);
}

setInterval(creaNeve, 150);

