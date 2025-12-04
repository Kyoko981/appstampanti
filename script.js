/* ===== SFONDO ANIMATO "ONDE BLU" ===== */

body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    font-family: Arial, sans-serif;
    color: white;
    text-align: center;
    overflow-x: hidden;
    overflow-y: hidden;

    background: linear-gradient(120deg, #001f3f, #003e73, #001f3f);
    background-size: 300% 300%;
    animation: ondaBlu 12s ease infinite;
}

@keyframes ondaBlu {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

/* ===== NEVE ===== */

.snowflake {
    position: fixed;
    top: -10px;
    color: white;
    font-size: 1em;
    user-select: none;
    animation: fall linear infinite, spin linear infinite;
}

@keyframes fall {
    to { transform: translateY(110vh) rotate(20deg); opacity: 0.2; }
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* ===== LUCINE COLORATE ANIMATE ===== */

.luci {
    width: 100%;
    padding: 18px 0;
    display: flex;
    justify-content: center;
    gap: 15px;

    background: none;
    border-bottom: none;
}

.luce {
    width: 18px;
    height: 32px;
    border-radius: 50%;
    animation: colorBlink 1.5s infinite, glow 1.5s infinite;
}

@keyframes colorBlink {
    0%   { background: red; }
    25%  { background: yellow; }
    50%  { background: lime; }
    75%  { background: cyan; }
    100% { background: red; }
}

@keyframes glow {
    0%   { box-shadow: 0 0 8px white; }
    50%  { box-shadow: 0 0 15px white; }
    100% { box-shadow: 0 0 8px white; }
}

/* ===== BOX ===== */

.container {
    margin: 50px auto;
    max-width: 420px;
    padding: 30px;
    background: rgba(0,0,0,0.55);
    border-radius: 20px;
    box-shadow: 0 0 25px #fff3;
    backdrop-filter: blur(6px);
}

input {
    width: 90%;
    padding: 10px;
    margin: 10px;
    border: none;
    border-radius: 6px;
}

button {
    padding: 10px 22px;
    background: #d7263d;
    border: none;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    font-weight: bold;
}

button:hover {
    background: #ff435c;
}

.last {
    font-size: 12px;
    opacity: 0.7;
    margin-bottom: 10px;
}

.error {
    color: #ffbbbb;
}

/* ===== ALBERELLO ===== */

.footer-tree {
    position: fixed;
    bottom: 15px;
    right: 15px;
    font-size: 38px;
    opacity: 0.85;
}
