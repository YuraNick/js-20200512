class Tooltip {
    static onlyInstance = null;
    element;

    pointerOverEvent = (event) => {
        const tooltipElement = event.target.closest('[data-tooltip]');
        if (tooltipElement) {
            this.element.innerHTML = tooltipElement.dataset.tooltip;
            this.render();

            tooltipElement.addEventListener('mousemove', this.mouseMoveEvent);
        }
    }

    mouseMoveEvent = (event) => {
        this.element.style.left = event.clientX + 5 + "px";
        this.element.style.top = event.clientY + 5 + "px";
    }

    pointerOutEvent = (event) => {
        const tooltipElement = event.target.closest('[data-tooltip]');
        if (tooltipElement) {
            this.element.innerHTML = '';
            
            this.element.remove();
            event.target.removeEventListener('mousemove', this.mouseMoveEvent);
        }
    }


    constructor() {
        if (! Tooltip.onlyInstance) {
            Tooltip.onlyInstance = this;
        } else {
            return Tooltip.onlyInstance;
        }
    }

    initialize() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.tooltipTemplate;
        this.element = wrapper.firstElementChild;

        document.body.addEventListener('pointerover', this.pointerOverEvent);
        document.body.addEventListener('pointerout', this.pointerOutEvent);
    }

    get tooltipTemplate() {
        return `<div class="tooltip"></div>`;
    }

    render(parent) {
        parent = parent || document.body;
        parent.append(this.element);
    }

    destroy() {
        document.body.removeEventListener('pointerover', this.pointerOverEvent);
        document.body.removeEventListener('pointerout', this.pointerOutEvent);
        this.element.remove();
    }

}

const tooltip = new Tooltip();

export default tooltip;
