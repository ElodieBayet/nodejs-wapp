'use strict';
/**
 * @author :: Elodie Bayet
 *   @role :: Fullstack Web Developer
 *   @date :: 2020.01 + 2021.10
 * @origin :: Belgium, EU
 */

/**
 * Provide solution for Opening|Closing HTML container
 * @param {Object} container HTML element that contains trigger and receptor, and hold class '.closed'
 * @param {Array} trigger HTML element that triggers opening/closing receptor
 * @param {Object} receptor HTML element that recepts opening/closing action
 */
 class Opener {

    constructor(container, trigger, receptor){
        this._container = container;
        this._trigger = trigger;
        this._receptor = receptor;
        this._trigger.addEventListener('click', this.handleClosing);
    }

    /**
     * Adjust height of receptor if innerWidth < 960 px.
     */
     autoCompute = () => {
        if (window.innerWidth < 960) {
            let isOpened = !this._container.classList.contains('closed');
            this._receptor.style.height = this.setHeight(isOpened) + 'px';
        } else {
            if (this._receptor.hasAttribute('style')) this._receptor.removeAttribute('style');
        }
    }

    /**
     * Perform autoclosing of container if innerWidth < 960 px.
     */
     autoClose = () => {
        if (window.innerWidth < 960) {
            let isClosed = this._container.classList.contains('closed');
            this._receptor.style.height = this.setHeight(isClosed) + 'px';
            this._container.classList.toggle('closed');
        }
    }
    /**
     * Compute height of receptor's children
     * @param {Boolean} compute - Bolean to order height computing or turn it to 1px
     */
    setHeight = compute => {
        let height = 1;
        if (compute) for( let child of this._receptor.children ) height += child.offsetHeight;
        return height;
    }

    /**
     * Open or close HTML element by switching heights and allow smooth transition in CSS
     */
    handleClosing = () => {
        let isClosed = this._container.classList.contains('closed');
        this._receptor.style.height = this.setHeight(isClosed) + 'px';
        this._container.classList.toggle('closed');
    }
}

export default Opener;