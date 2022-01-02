'use strict';
/**
 * @author :: Elodie Bayet
 *   @role :: Fullstack Web Developer
 *   @date :: 2020.01 + 2021.10
 * @origin :: Belgium, EU
 */

import GUIServices from './modules/guiServices.js';
import Opener from './modules/opener.js';

( () => {
	const _NAV = {
		container: document.querySelector('#uihead'), 
		trigger: document.querySelector('#uihead button'), 
		receptor: document.querySelector('#uihead .navigation')
	}
	/** Implementation controller of elements */
	const menu = GUIServices.implementController( _NAV, Opener ) || GUIServices.moduleError('menu');
	/** Additional service : according to correct implementation */
	if ( menu instanceof Opener ){
		GUIServices.delayedResizer( menu.autoCompute );
	}
})();


/** Remove class '.nojs' */
document.documentElement.removeAttribute('class');


/** 
 * Module requirement detections
 */
if (document.getElementById('chronographic')) {
	import('./modules/chronographic.js')
		.then( ({default: Chronographic}) => {
			const container = document.querySelector('#chronographic');
			const periods = document.querySelectorAll('#chronographic > div');
			const chronographic = new Chronographic(container, periods);
			/** Attach Resizing Analysis */
			GUIServices.delayedResizer(chronographic.autoLayout)
		})
		.catch( Errors => {
			GUIServices.moduleError('Chronographic', document.querySelector('#chronographic'));
			console.error(Errors);
		});
}

if (document.getElementById('filter')) {
	import('./modules/filter.js')
		.then( ({default: Filter}) => { 
			const togglers = document.querySelectorAll('.filters a.toggle')
			const reseter = document.querySelector('.filters a.anchor');
			const targets = document.querySelectorAll('._target');
			const filter = new Filter(togglers, reseter, targets);
		})
		.catch( Errors => {
			GUIServices.moduleError('Filter', document.querySelector('#filter ul'));
			console.error(Errors);
		});
}