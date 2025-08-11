const optHideBtn = document.getElementById('option-hide');
const optOpenBtn = document.getElementById('option-open');
const optionsCont = document.getElementById('options-container');
const headerRigntCont = document.getElementById('header-hopt-right-container');


const filterHideBtn = document.getElementById('filter-hide');
const filterOpenBtn = document.getElementById('filter-open');
const filterCont = document.getElementById('filter-container');
const headerLeftCont = document.getElementById('header-hfilter-left-container');


optHideBtn.addEventListener('click', () => {
  optionsCont.classList.add('hide');
  headerRigntCont.classList.add('open');
});
optOpenBtn.addEventListener('click', () => {
  optionsCont.classList.remove('hide');
  headerRigntCont.classList.remove('open');
});

filterHideBtn.addEventListener('click', () => {
  filterCont.classList.add('hide');
  headerLeftCont.classList.add('open');
});
filterOpenBtn.addEventListener('click', () => {
  filterCont.classList.remove('hide');
  headerLeftCont.classList.remove('open');
});

const optionsOpen = document.getElementById('option-open');
const filterClearBtn = document.getElementById('filter-reset');

const iconParam = new Map();
const regionParam = new Map();

document.addEventListener('DOMContentLoaded', () => {
  const svgMap = {
    or:    document.getElementById('--or'),
    exclude: document.getElementById('--exclude'),
    and:   document.getElementById('--and')
  };
  
  const states = ['none', 'or', 'exclude', 'and'];
  
  const orDelta  = [ 0,  1, -1,  0]; // 1:+1, 2:-1
  const andDelta = [-1,  0,  0,  1]; // 0:-1, 3:+1
  
  
  let allIconsOR = 0;
  let allIconsAND = 0;
  
  let allRegionOR = 0;
  let allRegionAND = 0;
  


  document.querySelectorAll('.icons-grid label').forEach(iconsgrid => {
	let iconstatesIndex = 0;
    const checkbox = iconsgrid.querySelector('input[type="checkbox"]');
    const indicatorContainer = document.createElement('span');
    indicatorContainer.className = 'indicator-container';
    iconsgrid.prepend(indicatorContainer);
	

    iconsgrid.dataset.state = 'none';
	checkbox.checked = false;
	
	const iconId = checkbox.value;

    iconsgrid.addEventListener('click', e => {
      e.preventDefault();
	  const nextIndex = (states.indexOf(iconsgrid.dataset.state) + 1) % states.length;
	  
	  allIconsOR += orDelta[nextIndex];
	  allIconsAND += andDelta[nextIndex];
	  
	  iconstatesIndex = nextIndex;
	  
	  const nextState = states[nextIndex];
      indicatorContainer.innerHTML = '';

      
      if (nextState !== 'none') {
        const orig = svgMap[nextState];
        if (orig) {
          const clone = orig.cloneNode(true);
          clone.removeAttribute('id');
          indicatorContainer.appendChild(clone);
        }
        checkbox.checked = true;
		iconParam.set(iconId, iconstatesIndex);
      } else {
        checkbox.checked = false;
		iconParam.delete(iconId);
      }

      iconsgrid.dataset.state = nextState;
    });
  });

  
  document.querySelectorAll('.filter-region label').forEach(filterregion => {
	let iconstatesIndex = 0;
    const checkbox = filterregion.querySelector('input[type="checkbox"]');
    const indicatorContainer = document.createElement('span');
    indicatorContainer.className = 'indicator-container';
    filterregion.prepend(indicatorContainer);


    filterregion.dataset.state = 'none';
	checkbox.checked = false;
	
	const regionId = checkbox.value;

    filterregion.addEventListener('click', e => {
      e.preventDefault();
	  const nextIndex = (states.indexOf(filterregion.dataset.state) + 1) % states.length;
	  
	  allRegionOR += orDelta[nextIndex];
	  allRegionAND += andDelta[nextIndex];

	  regionstatesIndex = nextIndex;
	  
	  const nextState = states[nextIndex];
      indicatorContainer.innerHTML = '';

      
      if (nextState !== 'none') {
        const orig = svgMap[nextState];
        if (orig) {
          const clone = orig.cloneNode(true);
          clone.removeAttribute('id');
          indicatorContainer.appendChild(clone);
        }
        checkbox.checked = true;
		regionParam.set(regionId, regionstatesIndex);
      } else {
        checkbox.checked = false;
		regionParam.delete(regionId);
      }

      filterregion.dataset.state = nextState;
    });
  });
  
  
  
  let collectedstatesIndex = 0;
  const collectedswitch = document.querySelector('.collected-switch label');
  const checkboxcollectedswitch = collectedswitch.querySelector('input[type="checkbox"]');
  const indicatorContainercollectedswitch = document.createElement('span');
  indicatorContainercollectedswitch.className = 'indicator-container';
  collectedswitch.prepend(indicatorContainercollectedswitch);
  
  const collectedId = checkboxcollectedswitch.value;
  
  collectedswitch.dataset.state = 'none';
  checkboxcollectedswitch.checked = false;

    collectedswitch.addEventListener('click', e => {
      e.preventDefault();
	  const nextIndex = (states.indexOf(collectedswitch.dataset.state) + 1) % states.length;

	  
	  
	  collectedstatesIndex = nextIndex;
	  
	  const nextState = states[nextIndex];

      indicatorContainercollectedswitch.innerHTML = '';

      
      if (nextState !== 'none') {
        const orig = svgMap[nextState];
        if (orig) {
          const clone = orig.cloneNode(true);
          clone.removeAttribute('id');
          indicatorContainercollectedswitch.appendChild(clone);
        }
        checkboxcollectedswitch.checked = true;
      } else {
        checkboxcollectedswitch.checked = false;
      }

      collectedswitch.dataset.state = nextState;
    });
  });
  
  
  
  filterClearBtn.addEventListener('click', () => {
	allIconsOR = 0;
	allIconsAND = 0;
	allRegionOR = 0;
	allRegionAND = 0;
	
	iconParam.clear(); 
	regionParam.clear();
	document.querySelectorAll('.filter-body label').forEach(label => {
	  iconstatesIndex = 0;
	  regionstatesIndex = 0;
	  collectedstatesIndex = 0;
	  const indicatorContainer = label.querySelector('.indicator-container');
	  const checkbox = label.querySelector('input[type="checkbox"]');
	  indicatorContainer.innerHTML = '';
	  checkbox.checked = false;
	  label.dataset.state = 'none';
	});
  });
});

const showMarkers = new Map();



function buildShowTable(IA, IO, RA, RO) {
  const st = { None:0, Or:1, Excl:2, And:3 };
  const allow = pickStrategy(IA, IO, RA, RO);
  const t = Array.from({ length: 4 }, () => new Uint8Array(4));
  for (let si = 0; si < 4; si++) {
    for (let sr = 0; sr < 4; sr++) {
      t[si][sr] = (si !== st.Excl && sr !== st.Excl && allow(si, sr)) ? 1 : 0;
    }
  }
  return t;
}

function setFilterFast(existingMarkers, iconParam, regionParam, allIconsOR, allIconsAND, allRegionOR, allRegionAND) {
  const IA = allIconsAND  > 0, IO = allIconsOR  > 0;
  const RA = allRegionAND > 0, RO = allRegionOR > 0;

  const showTable = buildShowTable(IA, IO, RA, RO);

  for (const marker of existingMarkers.values()) {
    const si = iconParam.get(marker.options.icon_id) ?? 0;
    const sr = regionParam.get(marker.options.region) ?? 0;
    const show = !!showTable[si][sr];
    showMarkers.set(marker.options.id, show);
  }
}

//
//
//function setFilter (existingMarkers, iconParam, regionParam, allIconsOR, allIconsAND, allRegionOR, allRegionAND) {
//	
//	const allOr = allIconsOR + allRegionOR;
//	const allAnd = allIconsAND + allRegionAND;
//	
//	
//	const fillterIconParamLength = iconParam.size;
//	const fillterRegionParamLength = regionParam.size;
//	
//	const fillterIconParamLengthB = (fillterIconParamLength === 1);
//	const fillterRegionParamLengthB = (fillterRegionParamLength === 1);
//	
//	existingMarkers.forEach(marker => {
//		const iconStateidx = (iconParam.get(marker.options.icon_id) ?? 0);
//		const regionStateidx = (regionParam.get(marker.options.region) ?? 0);
//		let show = !allOr && !allAnd;
//		if (show) {
//			show = (iconStateidx !== 2 && regionStateidx !== 2);
//		} else {
//			show = (iconStateidx !== 2 && regionStateidx !== 2) && ( || (allAnd && !allOr && ((allIconsAND === 0 && regionStateidx === 3) || (allRegionAND === 0 && iconStateidx === 3) || (iconStateidx === 3 && regionStateidx === 3))) || (!allAnd && allOr && (iconStateidx === 1 || regionStateidx === 1)) || (allAnd && allOr && ((allIconsAND === 0 && allIconsOR === 0 && regionStateidx === 3) || (allRegionAND === 0 && allRegionOR === 0 && iconStateidx === 3) || (allIconsAND === 0 && (regionStateidx === 3 && iconStateidx === 1)) || (allRegionAND === 0 && (iconStateidx === 3 && regionStateidx === 1)) || (iconStateidx === 3 && regionStateidx === 3)));
//		};
//		showMarkers.set(marker.options.id, show)
//	});
//}



//unction setFilterFast(existingMarkers, iconParam, regionParam, allIconsOR, allIconsAND, allRegionOR, allRegionAND) {
//  const IA = allIconsAND  > 0, IO = allIconsOR  > 0;
//  const RA = allRegionAND > 0, RO = allRegionOR > 0;
//  showMarkers.clear();
//  const showTable = buildShowTable(IA, IO, RA, RO);
//
//  for (const marker of existingMarkers.values()) {
//    const si = iconParam.get(marker.options.icon_id) ?? 0;
//    const sr = regionParam.get(marker.options.region) ?? 0;
//    const show = !!showTable[si][sr];
//   showMarkers.set(marker.options.id, show);
//  }
//}
