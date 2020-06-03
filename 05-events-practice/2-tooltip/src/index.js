class Tooltip {
    static onlyInstance = null;
    tooltipElement;

    pointerOverEvent = (event) => {
        const tooltipElement = event.target.closest('[data-tooltip]');
        if (tooltipElement) {
            this.tooltipElement.innerHTML = tooltipElement.dataset.tooltip;
            document.body.append(this.tooltipElement);

            tooltipElement.addEventListener('mousemove', this.mouseMoveEvent);
        }
    }

    mouseMoveEvent = (event) => {
        this.tooltipElement.style.left = event.clientX + 5 + "px";
        this.tooltipElement.style.top = event.clientY + 5 + "px";
    }

    pointerOutEvent = (event) => {
        const tooltipElement = event.target.closest('[data-tooltip]');
        if (tooltipElement) {
            this.tooltipElement.innerHTML = '';
            
            this.tooltipElement.remove();
            event.target.removeEventListener('mousemove', this.mouseMoveEvent)
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
        this.tooltipElement = wrapper.firstElementChild;

        document.body.addEventListener('pointerover', this.pointerOverEvent);
        document.body.addEventListener('pointerout', this.pointerOutEvent);
    }

    get tooltipTemplate() {
        return `<div class="tooltip"></div>`;
    }

}

const tooltip = new Tooltip();

export default tooltip;
