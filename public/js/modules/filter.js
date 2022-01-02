'use strict';
/**
 * @author :: Elodie Bayet
 *   @role :: Fullstack Web Developer
 *   @date :: 2020.01 + 2021.10
 * @origin :: Belgium, EU
 */

/**
 * Manage Filter component
 * @param {Array} togglers HTML elements List that toggle filtering
 * @param {Object} reseter HTML element that reset all filters
 * @param {Object} targets HTML elements List that get hidden or not
 */
 class Filter {

    constructor(togglers, reseter, targets){
        this._togglers = togglers;
        this._reseter = reseter
        this._targets = targets;
        this._filter = {};
        this._register = {};

        /** Attach Events and sort elements */
        this._togglers.forEach( link => { 
            // Enable Togglers Event
            link.addEventListener('click', this.handleToggling );
            // Sort elements by Togglers Target
            let ref = link.getAttribute('href').substr(1);
            if (!Array.isArray(this._register[ref])) {
                this._register[ref] = document.querySelectorAll(`._target[data-tag*=${ref}]`);
            }
        });
        // Bind actions on edit storage
        this._filter = this.filterManager(this.handleInitial, this.handleReset);
    }

   /**
    * General manager of filter
    * @param {Function} oninit Action on init filters
    * @param {Function} onempty Action on empty filters
    */
    filterManager = (oninit, onempty) => {
        let _storage = [];
        let _oninit = () => oninit();
        let _onempty = () => onempty();
        return {
            empty : () => {
                _storage = [];
            },
            remove : key => {
                _storage.splice(_storage.indexOf(key), 1);
                if (_storage.length === 0) _onempty();
            },
            insert : key => {
                if (_storage.length === 0) _oninit();
                _storage.push(key);
            },
            stored : () => _storage
        }
    }

    /**
     * Detect filter-toggler selected or not and call action on targets
     * @param {Object} evt Event object from triggered filter-toggler
     */
    handleToggling = evt => {
        evt.preventDefault();
        let ref = evt.currentTarget.getAttribute('href').substr(1);
        if (evt.currentTarget.classList.contains('selected')) {
            evt.currentTarget.classList.remove('selected');
            this._register[ref].forEach( target => target.classList.add('hide'));
            this._filter.remove(ref);
            // Re-Display those that might be hidden
            for(let key of this._filter.stored()) this._register[key].forEach( target => target.classList.remove('hide'));
        } else {
            evt.currentTarget.classList.add('selected');
            this._filter.insert(ref);
            this._register[ref].forEach( target => target.classList.remove('hide'));
        }
    }

    /**
     * Enable / Disabale filter-reseter
     * @param {Boolean} status Determiner to enable or disable filter-reseter
     */
    toggleReseter = status => {
        if (status) this._reseter.addEventListener('click', this.handleReset);
        else this._reseter.removeEventListener('click', this.handleReset);
        this._reseter.classList.toggle('disabled', !status);
    }

    /**
     * For Filter Initialization
     */
    handleInitial = () => {
        for(let target of this._targets) target.classList.add('hide');
        this.toggleReseter(true);
    }
    
    /**
     * For Filter Reseting
     */
    handleReset = () => {
        for(let target of this._targets) target.classList.remove('hide');
        this._togglers.forEach( toggle => toggle.classList.remove('selected') );
        this._filter.empty();
        this.toggleReseter(false);
    }
}

export default Filter