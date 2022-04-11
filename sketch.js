/***********************************************************************
     
 Copyright (c) 2016-2022 Ayush Mishra, www.Ayushmishra.design
 *** Ayush Mishra Designs ***
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of MSA Visuals nor the names of its contributors
 *       may be used to endorse or promote products derived from this software
 *       without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS
 * OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
 * OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***********************************************************************/
let vmin, vmax;
let cx, cy;
let ctx;
let pg;
let dotArr = [];
let NUM = 8000;
let idx = 0;
let modeArr = [
  'line-V',
  'line-H',
  'cross-+',
  'cross-X',
  'circle',
  'sin',
  'sin-circle',
];
let mode = modeArr[0];

let P = Math.PI;
let P2 = P * 2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  vmin = min(width, height);
  vmax = max(width, height);
  cx = width / 2;
  cy = height / 2;
  
  for (let i = 0; i < NUM; i++) {
    let pos = createVector(random(width), random(height));
    dotArr.push({
      i,
      pos,
      targetPos: pos.copy(),
      r: random(1, 4),
      e: random(0.01, 0.2)
    });
  }
  
  idx = modeArr.length - 1;
  mode = modeArr[idx];
}

function draw() {
  let sec = millis() / 1000;
  blendMode(BLEND);
  background(0,9,69);
  blendMode(ADD);
  
  // for (let dot of dotArr) {
	for (let i = 0; i < dotArr.length; i++) {
		let { pos, targetPos, r, e } = dotArr[i];
    if (mode === 'sin') {
      targetPos.x = map(i, 0, NUM - 1, 0, width);
      targetPos.y = cy + sin(map(i, 0, NUM - 1, 0, 1) * PI * 4 + sec) * vmin * 0.15;
    } else if (mode === 'sin-circle') {
      let a = map(i, 0, NUM - 1, 0, P2);
      let r = vmin * 0.3 + sin(map(i, 0, NUM - 1, 0, 1) * P * 10 + sec) * vmin * 0.05;
      targetPos.x = cx + cos(a) * r;
      targetPos.y = cy + sin(a) * r;
    }
    
    pos.x += (targetPos.x - pos.x) * e;
    pos.y += (targetPos.y - pos.y) * e;
    
    noStroke();
    fill(65,240,223);
    let nx = noise(i, sec) * 10;
    let ny = noise(i, sec + 123.4567) * 10;
    circle(pos.x + nx, pos.y + ny, r);
  }
}

function switchMode() {
  idx = (idx + 1) % modeArr.length;
  mode = modeArr[idx];
  for (let { i, targetPos } of dotArr) {
    let rnd = random() < 0.5;
    switch(mode) {
      case 'line-V': {
        targetPos.x = cx;
        targetPos.y = random(height);
        break;
      }
      case 'line-H': {
        targetPos.x = random(width);
        targetPos.y = cy;
        break;
      }
      case 'cross-+': {
        targetPos.x = rnd ? cx : random(width);
        targetPos.y = rnd ? random(height) : cy;
      }
        break;
      case 'cross-X': {
        let len = random(sqrt(2) * vmin / 2);
        let a = floor(random(4)) * (P / 2) + P / 4;
        targetPos.x = cx + cos(a) * len;
        targetPos.y = cy + sin(a) * len;
        break;
      }
      case 'circle': {
        let a = random(P2);
        let r = vmin * 0.3;
        targetPos.x = cx + cos(a) * r;
        targetPos.y = cy + sin(a) * r;
        break;
      }
    }
  }
}

function mousePressed() {
  switchMode();
}
