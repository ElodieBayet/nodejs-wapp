'use strict';
/**
 * @author :: Elodie Bayet
 *   @role :: Fullstack Web Developer
 *   @date :: 2020.01 + 2021.10
 * @origin :: Belgium, EU
 */

/**
 * Manage Chrono-Graphic
 * @param {Object} reseter HTML element of infography
 * @param {Array} togglers HTML elements List of periods
 */
 class Chronographic {
    constructor(container, periods) {
		this._chronographic = container;
		this._periods = periods;

		if(window.innerWidth > 680){
			this.buildLadder();
			if (window.matchMedia('(any-hover:hover)').matches) this.enable();
		}
	}

	/**
	 * Build Infographic w/ date rungs and sets periods
	 * [!] - This function must be called once. When and id screen-sizes match
	 */
	buildLadder(){
		let begin = 500;	// Ladder Dates begin at 500 after J.C.
		let end = 2000;		// Ladder Dates end at 2000 after J.C.
		let space = 100;	// Ladder Dates spaced by 100 years

		/** Add date on Chronologic Ladder */
		for( ; end >= begin ; end = end-space){
			this._chronographic.insertAdjacentHTML('afterbegin', `<span class="year" style="top:${end - begin}px"><strong>${end}</strong></span>`);
		}

		/** Position of each period on Chronologic Ladder */
		this._periods.forEach( period => {
			period.style.top = `${period.getAttribute('data-begin') - begin}px`;
			period.style.height = `${period.getAttribute('data-delay')}px`;
		});

		/** Enable CSS */
		this._chronographic.classList.add('ladder');
	}

	/**
	 * Enable asynchronous requests
	 */
	enable(){
		this._periods.forEach( period => {
			period.addEventListener('mouseover', this.createCompositorList);
			period.addEventListener('mousemove', this.positionList);
		});
		this._chronographic.classList.add('ready');
	}

	/**
     * Switch layouting of infographic when window is resizing and innerWidth < 680 px.
     */
	autoLayout = () => {
        if (window.innerWidth < 680) {
            this._chronographic.classList.remove('ladder', 'ready');
        } else {
            this._chronographic.classList.add('ladder');
			if (window.matchMedia(`(any-hover:hover)`).matches){
				this._chronographic.classList.add('ready');
			}else{
				this._chronographic.classList.remove('ladder');
			}
        }
    }

	/**
	 * Load Compositors from targeted Period
	 * @param {EventObject} evt - Event reference period
	 */
	createCompositorList = async evt => {
		let target = evt.currentTarget // [!]

		/** Avoid future Request */
		target.removeEventListener('mouseover', this.createCompositorList);

		/** Targeting Resources */
		let tag = target.getAttribute('data-tag');
		let url = `/async/chronographic/${tag}`;
		const data = await fetch( url )
			.then( res => { 
				if (res.status < 200 || res.status >= 400) throw new Error('Cible non trouvée');
				return res;
			})
			.then( res => res.text() )
			.catch( err => `<ul><li class="nothing">Requête impossible : ${err.message}</li></ul>`);
		
		/** Insertion of data */
		target.insertAdjacentHTML('beforeend', data);
	}

	/**
	 * Position the compositors' list when mouving the mouse
	 * @param {Object} evt - Mouse event
	 */
	positionList = evt => {
		evt.currentTarget.lastElementChild.style.bottom = (evt.currentTarget.offsetHeight - evt.offsetY) +'px';
	}
}

export default Chronographic;