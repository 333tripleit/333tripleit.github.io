const customCursor = document.getElementById('custom-cursor');
const scaleGroup = document.getElementById('scaleSup');
const customCursorMode   = document.getElementById('toggle-cursor');

const hasTouch = navigator.maxTouchPoints > 0;

let customCursorEnabled = true;
document.body.classList.add('custom-cursor-on');

let mouseX = 0, mouseY = 0, ticking = false;
customCursor.style.opacity = '0';


if (!hasTouch) {
	if (customCursorEnabled) {
		document.addEventListener('mousemove', handleMouseMove);
	}

	customCursorMode.addEventListener('change', () => {
	  customCursorEnabled = !customCursorEnabled;
	  customCursor.style.display = customCursorEnabled ? 'block' : 'none';
	  document.body.classList.toggle('custom-cursor-on', customCursorEnabled);
		if (customCursorEnabled) {
			document.addEventListener('mousemove', handleMouseMove);
		} else {
			document.removeEventListener('mousemove', handleMouseMove)
		}
	});
	
	const activeSelectors = '.leaflet-marker-icon, a, button, .leaflet-popup-close-button';

	document.addEventListener('mouseover', e => {
	  if (e.target.closest(activeSelectors) && !e.relatedTarget?.closest(activeSelectors)) {
		customCursor.classList.remove('cursor-base');
		customCursor.classList.add('cursor-base--hover');
		scaleGroup.style.transform = 'scale(1)';
	  }
	});

	document.addEventListener('mouseout', e => {
	  if (e.target.closest(activeSelectors) && !e.relatedTarget?.closest(activeSelectors)) {
		customCursor.classList.remove('cursor-base--hover');
		customCursor.classList.add('cursor-base');
		scaleGroup.style.transform = 'scale(0.7)';
	  }
	});
} else {
	customCursor.style.display = 'none';
	customCursorMode.addEventListener('change', () => {
	  customCursorEnabled = !customCursorEnabled;
	  customCursor.style.display = 'none';
	});
}

function handleMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (!ticking) {
	requestAnimationFrame(() => {
	  if (customCursorEnabled) {
		customCursor.style.transform = `translate(${mouseX - 26}px, ${mouseY - 26}px)`;
	  }
	  ticking = false;
	  customCursor.style.opacity = '1';
	});
	ticking = true;
  }
}