/*
	Parallelism by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$main = $('#main'),
		settings = {

			// Keyboard shortcuts.
				keyboardShortcuts: {

					// If true, enables scrolling via keyboard shortcuts.
						enabled: true,

					// Sets the distance to scroll when using the left/right arrow keys.
						distance: 50

				},

			// Scroll wheel.
				scrollWheel: {

					// If true, enables scrolling via the scroll wheel.
						enabled: true,

					// Sets the scroll wheel factor. (Ideally) a value between 0 and 1 (lower = slower scroll, higher = faster scroll).
						factor: 1

				},

			// Scroll zones.
				scrollZones: {

					// If true, enables scrolling via scroll zones on the left/right edges of the scren.
						enabled: true,

					// Sets the speed at which the page scrolls when a scroll zone is active (higher = faster scroll, lower = slower scroll).
						speed: 15

				}

		};

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '481px',   '736px'  ],
			xsmall:  [ null,      '480px'  ],
		});

	// Tweaks/fixes.

		// Mobile: Revert to native scrolling.
			if (browser.mobile) {

				// Disable all scroll-assist features.
					settings.keyboardShortcuts.enabled = false;
					settings.scrollWheel.enabled = false;
					settings.scrollZones.enabled = false;

				// Re-enable overflow on main.
					$main.css('overflow-x', 'auto');

			}

		// IE: Fix min-height/flexbox.
			if (browser.name == 'ie')
				$wrapper.css('height', '100vh');

		// iOS: Compensate for address bar.
			if (browser.os == 'ios')
				$wrapper.css('min-height', 'calc(100vh - 30px)');

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Items.

		// Assign a random "delay" class to each thumbnail item.
			$('.item.thumb').each(function() {
				$(this).addClass('delay-' + Math.floor((Math.random() * 6) + 1));
			});

		// IE: Fix thumbnail images.
			if (browser.name == 'ie')
				$('.item.thumb').each(function() {

					var $this = $(this),
						$img = $this.find('img');

					$this
						.css('background-image', 'url(' + $img.attr('src') + ')')
						.css('background-size', 'cover')
						.css('background-position', 'center');

					$img
						.css('opacity', '0');

				});

	// Poptrox.
		$main.poptrox({
			onPopupOpen: function() { $body.addClass('is-poptrox-visible'); },
			onPopupClose: function() { $body.removeClass('is-poptrox-visible'); },
			overlayColor: '#1a1f2c',
			overlayOpacity: 0.75,
			popupCloserText: '',
			popupLoaderText: '',
			selector: '.item.thumb a.image:not(.video-popup)',
			caption: function($a) {
				return $a.prev('h2').html();
			},
			usePopupDefaultStyling: false,
			usePopupCloser: false,
			usePopupCaption: true,
			usePopupNav: true,
			windowMargin: 50
		});

		breakpoints.on('>small', function() {
			$main[0]._poptrox.windowMargin = 50;
		});

		breakpoints.on('<=small', function() {
			$main[0]._poptrox.windowMargin = 0;
		});

	// Keyboard shortcuts.
		if (settings.keyboardShortcuts.enabled)
			(function() {

				$window

					// Keypress event.
						.on('keydown', function(event) {

							var scrolled = false;

							if ($body.hasClass('is-poptrox-visible'))
								return;

							switch (event.keyCode) {

								// Left arrow.
									case 37:
										$main.scrollLeft($main.scrollLeft() - settings.keyboardShortcuts.distance);
										scrolled = true;
										break;

								// Right arrow.
									case 39:
										$main.scrollLeft($main.scrollLeft() + settings.keyboardShortcuts.distance);
										scrolled = true;
										break;

								// Page Up.
									case 33:
										$main.scrollLeft($main.scrollLeft() - $window.width() + 100);
										scrolled = true;
										break;

								// Page Down, Space.
									case 34:
									case 32:
										$main.scrollLeft($main.scrollLeft() + $window.width() - 100);
										scrolled = true;
										break;

								// Home.
									case 36:
										$main.scrollLeft(0);
										scrolled = true;
										break;

								// End.
									case 35:
										$main.scrollLeft($main.width());
										scrolled = true;
										break;

							}

							// Scrolled?
								if (scrolled) {

									// Prevent default.
										event.preventDefault();
										event.stopPropagation();

									// Stop link scroll.
										$main.stop();

								}

						});

			})();

	// Scroll wheel.
		if (settings.scrollWheel.enabled)
			(function() {

				// Based on code by @miorel + @pieterv of Facebook (thanks guys :)
				// github.com/facebook/fixed-data-table/blob/master/src/vendor_upstream/dom/normalizeWheel.js
					var normalizeWheel = function(event) {

						var	pixelStep = 10,
							lineHeight = 40,
							pageHeight = 800,
							sX = 0,
							sY = 0,
							pX = 0,
							pY = 0;

						// Legacy.
							if ('detail' in event)
								sY = event.detail;
							else if ('wheelDelta' in event)
								sY = event.wheelDelta / -120;
							else if ('wheelDeltaY' in event)
								sY = event.wheelDeltaY / -120;

							if ('wheelDeltaX' in event)
								sX = event.wheelDeltaX / -120;

						// Side scrolling on FF with DOMMouseScroll.
							if ('axis' in event
							&&	event.axis === event.HORIZONTAL_AXIS) {
								sX = sY;
								sY = 0;
							}

						// Calculate.
							pX = sX * pixelStep;
							pY = sY * pixelStep;

							if ('deltaY' in event)
								pY = event.deltaY;

							if ('deltaX' in event)
								pX = event.deltaX;

							if ((pX || pY)
							&&	event.deltaMode) {

								if (event.deltaMode == 1) {
									pX *= lineHeight;
									pY *= lineHeight;
								}
								else {
									pX *= pageHeight;
									pY *= pageHeight;
								}

							}

						// Fallback if spin cannot be determined.
							if (pX && !sX)
								sX = (pX < 1) ? -1 : 1;

							if (pY && !sY)
								sY = (pY < 1) ? -1 : 1;

						// Return.
							return {
								spinX: sX,
								spinY: sY,
								pixelX: pX,
								pixelY: pY
							};

					};

				// Wheel event.
					$body.on('wheel', function(event) {

						// Disable on <=small.
							if (breakpoints.active('<=small'))
								return;

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Stop link scroll.
							$main.stop();

						// Calculate delta, direction.
							var	n = normalizeWheel(event.originalEvent),
								x = (n.pixelX != 0 ? n.pixelX : n.pixelY),
								delta = Math.min(Math.abs(x), 150) * settings.scrollWheel.factor,
								direction = x > 0 ? 1 : -1;

						// Scroll page.
							$main.scrollLeft($main.scrollLeft() + (delta * direction));

					});

			})();

	// Scroll zones.
		if (settings.scrollZones.enabled)
			(function() {

				var	$left = $('<div class="scrollZone left"></div>'),
					$right = $('<div class="scrollZone right"></div>'),
					$zones = $left.add($right),
					paused = false,
					intervalId = null,
					direction,
					activate = function(d) {

						// Disable on <=small.
							if (breakpoints.active('<=small'))
								return;

						// Paused? Bail.
							if (paused)
								return;

						// Stop link scroll.
							$main.stop();

						// Set direction.
							direction = d;

						// Initialize interval.
							clearInterval(intervalId);

							intervalId = setInterval(function() {
								$main.scrollLeft($main.scrollLeft() + (settings.scrollZones.speed * direction));
							}, 25);

					},
					deactivate = function() {

						// Unpause.
							paused = false;

						// Clear interval.
							clearInterval(intervalId);

					};

				$zones
					.appendTo($wrapper)
					.on('mouseleave mousedown', function(event) {
						deactivate();
					});

				$left
					.css('left', '0')
					.on('mouseenter', function(event) {
						activate(-1);
					});

				$right
					.css('right', '0')
					.on('mouseenter', function(event) {
						activate(1);
					});

				$body
					.on('---pauseScrollZone', function(event) {

						// Pause.
							paused = true;

						// Unpause after delay.
							setTimeout(function() {
								paused = false;
							}, 500);

					});

			})();

	// Typewriter Animation
		(function() {
			const typewriterElement = document.getElementById('typewriter');
			const phrases = [
				'Animator...',
				'Digital Designer...', 
				'3D Modeler...',
				'Visual Artist...',
				'Storyteller...',
				'Problem Solver...'
			];
			
			let phraseIndex = 0;
			let charIndex = 0;
			let isDeleting = false;
			let typingSpeed = 100;
			
			function typeWriter() {
				const currentPhrase = phrases[phraseIndex];
				
				if (isDeleting) {
					// Deleting characters
					typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
					charIndex--;
					typingSpeed = 50;
				} else {
					// Typing characters
					typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
					charIndex++;
					typingSpeed = 100;
				}
				
				// Handle transitions
				if (!isDeleting && charIndex === currentPhrase.length) {
					// Finished typing, wait then start deleting
					typingSpeed = 2000; // Wait 2 seconds
					isDeleting = true;
				} else if (isDeleting && charIndex === 0) {
					// Finished deleting, move to next phrase
					isDeleting = false;
					phraseIndex = (phraseIndex + 1) % phrases.length;
					typingSpeed = 500; // Wait 0.5 seconds before starting next phrase
				}
				
				setTimeout(typeWriter, typingSpeed);
			}
			
			// Start the typewriter effect
			setTimeout(typeWriter, 2000); // Initial delay
		})();

	// Custom YouTube video popup
	(function() {
		var $videoOverlay = null;
		var $videoContainer = null;
		var $closeBtn = null;

		function showVideoPopup(videoId) {
			// Create overlay and container if not already present
			if (!$videoOverlay) {
				$videoOverlay = $('<div id="video-popup-overlay" style="display:flex;position:fixed;z-index:10010;top:0;left:0;width:100vw;height:100vh;background:rgba(18,21,29,0.92);justify-content:center;align-items:center;"></div>');
				$videoContainer = $('<div id="video-popup-container" style="position:relative;width:90vw;max-width:1200px;aspect-ratio:16/9;max-height:80vh;display:flex;align-items:center;justify-content:center;background:none;"></div>');
				$closeBtn = $('<span style="position:absolute;top:-32px;right:0;font-size:2.5em;color:#fff;cursor:pointer;z-index:10011;">&times;</span>');
				$videoContainer.append($closeBtn);
				$videoOverlay.append($videoContainer);
				$('body').append($videoOverlay);

				// Close on overlay click (but not when clicking the video)
				$videoOverlay.on('mousedown', function(e) {
					if (e.target === this) closeVideoPopup();
				});
				// Close on close button
				$closeBtn.on('click', closeVideoPopup);
				// Close on ESC
				$(document).on('keydown.videoPopup', function(e) {
					if ($videoOverlay.is(':visible') && (e.key === 'Escape' || e.keyCode === 27)) closeVideoPopup();
				});
			}

			var $iframe = $('<iframe>', {
				width: '100%',
				height: '100%',
				src: 'https://www.youtube.com/embed/' + videoId + '?autoplay=1',
				frameborder: 0,
				allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
				allowfullscreen: true,
				style: 'border-radius:12px;width:100%;height:100%;background:#000;aspect-ratio:16/9;'
			});
			$videoContainer.find('iframe').remove();
			$videoContainer.append($iframe);
			$videoOverlay.fadeIn(200);
			$('body').addClass('is-poptrox-visible');
		}

		function closeVideoPopup() {
			if ($videoOverlay) {
				$videoOverlay.fadeOut(200, function() {
					$videoContainer.find('iframe').remove();
					$('body').removeClass('is-poptrox-visible');
				});
			}
		}

		// Open video popup on click
		$(document).on('click', 'a.video-popup', function(e) {
			e.preventDefault();
			e.stopPropagation();
			var videoId = $(this).data('video-id');
			if (videoId) showVideoPopup(videoId);
		});
	})();

})(jQuery);