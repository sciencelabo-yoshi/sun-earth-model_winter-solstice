let earthShader;
let earthAngle = 0;

const earthRadius = 120;
const tilt = Math.PI * 23.4 / 180;

// 明石市
const akashiLat = 34.38 * Math.PI / 180;
const akashiLon = 135 * Math.PI / 180;

// UI
let sliderPitch;
let resetButton;
let northViewButton;

// ★ 季節ラベル
let seasonLabel;

// ★ 凡例ラベル
let legendLabel;

// カメラ用 yaw
let cameraYaw = 0;

// 北極点視点フラグ
let invertDayNight = false;

function preload() {
  earthShader = loadShader("earth.vert", "earth.frag");
}

function setup() {
  createCanvas(800, 600, WEBGL);

  // ===== 季節表示（キャンバス外） =====
  seasonLabel = createDiv("冬至");
  seasonLabel.position(50, 10);
  seasonLabel.style("font-size", "50px");
  seasonLabel.style("font-weight", "bold");
  seasonLabel.style("color", "#000");

  // ===== ★ 凡例表示（季節の下） =====
  legendLabel = createDiv(
    "<span style='color:blue;'>青：北極点</span><br>" +
    "<span style='color:red;'>赤：南極点</span><br>" +
    "<span style='color:orange;'>橙：明石市</span><br>" +
"<span style='color:orange;'>(北緯34.38度,東経135度)</span><br>" +
    "明・暗：昼・夜"
  );
  legendLabel.position(50, 100);
  legendLabel.style("font-size", "18px");
  legendLabel.style("line-height", "1.5");

  sliderPitch = createSlider(-90, 90, 0, 1);
  sliderPitch.position(20, 250);
  sliderPitch.style("width", "200px");
  sliderPitch.style("transform", "rotate(-90deg)");
  sliderPitch.style("display", "none");

  resetButton = createButton("最初に戻る");
  resetButton.position(230, 20);
  resetButton.mousePressed(resetView);

  northViewButton = createButton("北極点の真上から見る");
  northViewButton.position(230, 50);
  northViewButton.mousePressed(viewFromNorthPole);
}

function draw() {
  background(220);

  const pitch = sliderPitch.value() * Math.PI / 180;

  // ===== 視点（カメラ） =====
  rotateY(-cameraYaw);
  rotateX(-pitch);

  // ===== 太陽（世界座標） =====
  const sunDirWorld = { x: -1, y: 0, z: 0 };
  drawSunFromDir(sunDirWorld);

  // カメラ補正後の太陽方向（昼夜判定用）
  let sunDirView = rotateYVec(sunDirWorld, cameraYaw);

  if (invertDayNight) {
    sunDirView = {
      x: sunDirView.x,
      y: -sunDirView.y,
      z: -sunDirView.z
    };
  }

  // ===== 地球 =====
  rotateZ(tilt);
  rotateY(earthAngle);

  earthShader.setUniform("uSunDir", [
    sunDirView.x,
    sunDirView.y,
    sunDirView.z
  ]);

  shader(earthShader);
  noStroke();
  sphere(earthRadius);
  resetShader();

  drawAxis(earthRadius);
  drawPoles(earthRadius);
  drawAkashiMarker(earthRadius);

  earthAngle += 0.01;
}

// ---------------- ボタン ----------------
function resetView() {
  sliderPitch.value(0);
  cameraYaw = 0;
  earthAngle = 0;
  invertDayNight = false;
  seasonLabel.html("冬至");
}

function viewFromNorthPole() {
  sliderPitch.value(90);
  cameraYaw = tilt;
  invertDayNight = true;
}

// ---------------- 太陽 ----------------
function drawSunFromDir(dir) {
  push();
  translate(dir.x * 300, dir.y * 300, dir.z * 300);
  noStroke();
  fill(255, 200, 0);
  sphere(20);
  pop();
}

// ---------------- ベクトル回転 ----------------
function rotateYVec(v, a) {
  return {
    x:  v.x * Math.cos(a) + v.z * Math.sin(a),
    y:  v.y,
    z: -v.x * Math.sin(a) + v.z * Math.cos(a)
  };
}

// ---------------- 地軸・極 ----------------
function drawAxis(r) {
  stroke(0);
  strokeWeight(3);
  line(0, -r * 1.4, 0, 0, r * 1.4, 0);
}

function drawPoles(r) {
  push(); translate(0, -r, 0); noStroke(); fill(0,0,255); sphere(6); pop();
  push(); translate(0,  r, 0); noStroke(); fill(255,0,0); sphere(6); pop();
}

// ---------------- 明石市 ----------------
function drawAkashiMarker(r) {
  const x = r * Math.cos(akashiLat) * Math.cos(akashiLon);
  const y = -r * Math.sin(akashiLat);
  const z = r * Math.cos(akashiLat) * Math.sin(akashiLon);

  const nx = x / r, ny = y / r, nz = z / r;

  push();
  translate(x, y, z);
  stroke(255,120,0);
  line(0,0,0, nx*10, ny*10, nz*10);
  pop();
}


