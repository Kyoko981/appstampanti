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
        let [c_ip, c_dns] = l.split(",");
        if (c_ip === ip) {
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
