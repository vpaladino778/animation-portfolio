/*
	Starry Night Sky Background Animation
	Creates a subtle animated starry background for the portfolio website
*/

(function() {
	'use strict';

	// Create canvas element
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	
	// Set canvas to full window size
	canvas.style.position = 'fixed';
	canvas.style.top = '0';
	canvas.style.left = '0';
	canvas.style.width = '100%';
	canvas.style.height = '100%';
	canvas.style.zIndex = '-1';
	canvas.style.pointerEvents = 'none';
	
	// Insert canvas at the beginning of body
	document.body.insertBefore(canvas, document.body.firstChild);
	
	// Set canvas size
	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
	
	// Initial resize
	resizeCanvas();
	
	// Resize on window resize
	window.addEventListener('resize', resizeCanvas);
	
	// Star class
	class Star {
		constructor() {
			this.reset();
			this.twinkleBoost = 0; // For occasional strong twinkle
			this.twinkleBoostTimer = 0;
		}
		
		reset() {
			this.x = Math.random() * canvas.width;
			this.y = Math.random() * canvas.height;
			this.size = Math.random() * 1 + 0.2;
			this.opacity = Math.random() * 0.8 + 0.5;
			this.twinkleSpeed = Math.random() * 0.02 + 0.005;
			this.twinklePhase = Math.random() * Math.PI * 2;
			this.brightness = Math.random() * 0.6 + 0.7;
			this.twinkleBoost = 0;
			this.twinkleBoostTimer = 0;
		}
		
		update() {
			this.twinklePhase += this.twinkleSpeed;
			let twinkle = Math.sin(this.twinklePhase) * 0.3;
			if (this.twinkleBoost > 0) {
				twinkle *= this.twinkleBoost;
				this.twinkleBoostTimer--;
				if (this.twinkleBoostTimer <= 0) {
					this.twinkleBoost = 0;
				}
			}
			this.opacity = this.brightness + twinkle;
		}
		
		draw() {
			ctx.save();
			ctx.globalAlpha = Math.max(0, this.opacity);
			ctx.fillStyle = '#ffffff';
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			ctx.fill();
			
			// Add subtle glow for some stars
			if (this.size > 1.5) {
				ctx.globalAlpha = this.opacity * 0.3;
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.restore();
		}
	}
	
	// Create stars
	const stars = [];
	const numStars = Math.min(400, Math.floor((canvas.width * canvas.height) / 3500));
	
	for (let i = 0; i < numStars; i++) {
		stars.push(new Star());
	}
	
	// Animation loop
	function animate() {
		// Fill canvas with solid black
		ctx.fillStyle = '#000000';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		// Update and draw stars
		stars.forEach(star => {
			star.update();
			star.draw();
		});
		
		requestAnimationFrame(animate);
	}
	
	// Start animation when page is loaded
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', animate);
	} else {
		animate();
	}
	
	// Add some shooting stars occasionally
	function createShootingStar() {
		const star = {
			x: Math.random() * canvas.width,
			y: 0,
			vx: (Math.random() - 0.5) * 1.2,
			vy: Math.random() * 1.5 + 1.2,
			size: Math.random() * 1 + 0.3,
			opacity: 1,
			trail: []
		};
		
		function updateShootingStar() {
			star.x += star.vx;
			star.y += star.vy;
			star.opacity -= 0.008;
			
			// Add to trail
			star.trail.push({x: star.x, y: star.y, opacity: star.opacity});
			if (star.trail.length > 10) {
				star.trail.shift();
			}
			
			// Draw trail
			ctx.save();
			star.trail.forEach((point, index) => {
				const alpha = (index / star.trail.length) * star.opacity;
				ctx.globalAlpha = alpha;
				ctx.fillStyle = '#ffffff';
				ctx.beginPath();
				ctx.arc(point.x, point.y, star.size * (index / star.trail.length), 0, Math.PI * 2);
				ctx.fill();
			});
			ctx.restore();
			
			// Continue or remove
			if (star.opacity > 0 && star.y < canvas.height) {
				requestAnimationFrame(updateShootingStar);
			}
		}
		
		updateShootingStar();
	}
	
	// Create shooting stars randomly
	setInterval(() => {
		if (Math.random() < 0.1) { // 10% chance every interval
			createShootingStar();
		}
	}, 3000);
	
	// Occasionally boost twinkle for a few random stars
	setInterval(() => {
		for (let i = 0; i < Math.floor(stars.length * 0.03); i++) { // 3% of stars
			const idx = Math.floor(Math.random() * stars.length);
			if (stars[idx].twinkleBoost === 0) {
				stars[idx].twinkleBoost = Math.random() * 1.5 + 1.5; // Stronger twinkle
				stars[idx].twinkleBoostTimer = Math.floor(Math.random() * 30 + 20); // Frames
			}
		}
	}, 1200);
	
})(); 