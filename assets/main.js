const $canvas = document.getElementById("faces");
const $header = document.getElementById("header");
let dotsColor;

main();

async function main() {
  // $header.style.height = window.innerHeight;
  random();
  const data = await getData();
  animate(data);
  window.addEventListener("resize", resizeCanvas, { passive: true });
}

async function getData() {
  const res = await fetch("/assets/faces");
  return res.json();
}

function resizeCanvas() {
  const s = Math.max($header.clientHeight, $header.clientWidth);
  $canvas.width = s;
  $canvas.height = s;
  $canvas.style.bottom = $canvas.style.top = `${
    ($header.clientHeight - s) / 2
  }px`;
  $canvas.style.left = $canvas.style.right = `${
    ($header.clientWidth - s) / 2
  }px`;
}

function animate(data) {
  resizeCanvas();
  const ctx = $canvas.getContext("2d");
  let frameIx = 0;
  const PI2 = 2 * Math.PI;
  let direction = 1;
  const render = () => {
    const { width, height } = $canvas;
    const frame = data[frameIx];
    ctx.fillStyle = dotsColor;
    ctx.clearRect(0, 0, width, height);
    const xshift = 0.08;
    const yshift = 0.08;

    const ratio = Math.max(width, height);
    const noise = () => 0; //ratio * Math.random() * 0.001;
    const middle = 0.5;
    for (let i = 0, t = frame.length; i < t; i++) {
      let [x, y] = frame[i];
      x = (x + xshift) * ratio + noise();
      y = (y + yshift) * ratio + noise();
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, PI2);
      ctx.fill();
    }
    direction = data[frameIx + direction] ? direction : -direction;
    frameIx = frameIx + direction;
    requestAnimationFrame(render);
  };
  render();
}

function random() {
  const dotBlack = "rgba(1,1,1,0.5)";
  const dotWhite = "rgba(255,255,255,0.5)";
  const records = [
    ["#5bc0eb", dotBlack, ["📘", "🚾", "🔵", "💎"]],
    ["#fde74c", dotBlack, ["🧀", "🍋", "🌕", "🌼"]],
    ["#9bc53d", dotBlack, ["🍀", "🌳", "🐢", "🦖"]],
    ["#e55934", dotBlack, ["🦀", "🔴", "🎒", "⛑"]],
    ["#fa7921", dotBlack, ["🆚", "📙", "🍊", "🥕"]],
  ];
  const index = Math.floor(Math.random() * records.length);
  const record = records[index];
  const icon = record[2][Math.floor(Math.random() * 4)];
  const iconUrl = `https://twemoji.confraria.workers.dev/${icon}`;
  document.querySelector("link[rel=icon]").href = iconUrl;
  document.body.style.setProperty("--bg-color", record[0]);
  dotsColor = record[1];
  const manifest = {
    name: "Luis Confraria",
    short_name: "confraria",
    description: "The internet place of Luis Confraria",
    icons: [
      {
        src: iconUrl,
        sizes: "168x168",
        type: "image/svg",
      },
    ],
  };
  document.querySelector("meta[name=theme-color]").content = record[0];
  document.querySelector(
    "link[rel=manifest]"
  ).href = `data:application/manifest+json,${JSON.stringify(manifest)}`;
}
