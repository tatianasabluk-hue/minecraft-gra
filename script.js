const canvas = document.getElementById("world");
const ctx = canvas.getContext("2d");
const SIZE = 40, COLS = 24, ROWS = 12;
const colors = {
  grass: "#55a832", dirt: "#86512d", stone: "#888888",
  wood: "#9a642e", sand: "#e5d18a"
};
let world = [], selected = "grass", removed = 0, adminLogged = false;

function newWorld() {
  world = [];
  for (let y = 0; y < ROWS; y++) {
    world[y] = [];
    for (let x = 0; x < COLS; x++) {
      world[y][x] = y < 6 ? null : y === 6 ? "grass" : y < 9 ? "dirt" : "stone";
    }
  }
  removed = 0;
  drawWorld();
}

function drawWorld() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#87ceeb";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffe65c";
  ctx.beginPath();
  ctx.arc(850, 65, 35, 0, Math.PI * 2);
  ctx.fill();
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const block = world[y][x];
      if (!block) continue;
      ctx.fillStyle = colors[block];
      ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE);
      ctx.strokeStyle = "#0003";
      ctx.lineWidth = 2;
      ctx.strokeRect(x * SIZE, y * SIZE, SIZE, SIZE);
    }
  }
  document.getElementById("count").textContent = removed;
}

document.querySelectorAll(".block").forEach(button => {
  button.addEventListener("click", () => {
    selected = button.dataset.block;
    document.querySelectorAll(".block").forEach(b => b.classList.remove("selected"));
    button.classList.add("selected");
  });
});

canvas.addEventListener("contextmenu", e => e.preventDefault());
canvas.addEventListener("mousedown", e => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) * canvas.width / rect.width / SIZE);
  const y = Math.floor((e.clientY - rect.top) * canvas.height / rect.height / SIZE);
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return;
  if (e.button === 0 && world[y][x]) { world[y][x] = null; removed++; }
  if (e.button === 2 && !world[y][x]) world[y][x] = selected;
  drawWorld();
});

document.getElementById("saveButton").onclick = () => {
  localStorage.setItem("minecraftWorld", JSON.stringify(world));
  alert("Світ збережено! 💾");
};

function loadWorld() {
  const saved = localStorage.getItem("minecraftWorld");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === ROWS &&
          parsed.every(row => Array.isArray(row) && row.length === COLS &&
          row.every(block => block === null || Object.hasOwn(colors, block)))) {
        world = parsed;
      } else newWorld();
    } catch { newWorld(); }
  } else newWorld();
  drawWorld();
}

document.getElementById("resetButton").onclick = () => {
  if (confirm("Точно створити новий світ?")) newWorld();
};

const modal = document.getElementById("adminModal");
document.getElementById("adminButton").onclick = () => modal.style.display = "flex";
document.getElementById("closeAdmin").onclick = () => modal.style.display = "none";

// ДЕМО-ПАРОЛЬ: не використовуй його як захист реального сайту.
const ADMIN_PASSWORD = "Creeper_Не_Вибухай_2026!";

document.getElementById("loginButton").onclick = () => {
  const password = document.getElementById("password").value;
  if (password === ADMIN_PASSWORD) {
    adminLogged = true;
    document.getElementById("login").hidden = true;
    document.getElementById("adminContent").hidden = false;
    document.getElementById("error").textContent = "";
  } else {
    document.getElementById("error").textContent = "❌ Неправильний пароль! Кріпер не пускає!";
  }
};

document.getElementById("applyButton").onclick = () => {
  if (!adminLogged) return;
  const title = document.getElementById("newTitle").value.trim();
  const message = document.getElementById("newMessage").value.trim();
  if (title) document.getElementById("gameTitle").textContent = title;
  if (message) document.getElementById("message").textContent = message;
  alert("Налаштування змінено!");
};

document.getElementById("adminReset").onclick = () => {
  if (!adminLogged) return;
  if (confirm("Адмін: очистити світ?")) {
    newWorld();
    localStorage.removeItem("minecraftWorld");
  }
};

document.getElementById("logoutButton").onclick = () => {
  adminLogged = false;
  document.getElementById("login").hidden = false;
  document.getElementById("adminContent").hidden = true;
  document.getElementById("password").value = "";
  modal.style.display = "none";
};

loadWorld();
