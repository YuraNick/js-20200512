export default class DoubleSlider {
    element;
    subElements;
    setup;
    selected;

    mouseDown = (event) => {
        const element = event.target.closest('[data-element]');
        const dataElement = (element) ? element.dataset.element : '';
        
        if (dataElement === 'thumbLeft' || dataElement === 'thumbRight') {
            this.selected.innerProperty = this.subElements.inner.getBoundingClientRect();
            this.selected.shiftX = event.clientX - element.getBoundingClientRect().left;

            if (dataElement === 'thumbLeft') {
                this.selected.dragZone = {
                    left : this.selected.innerProperty.left,
                    right : this.subElements.thumbRight.getBoundingClientRect().left
                };
            } else {
                this.selected.dragZone = {
                    left : this.subElements.thumbLeft.getBoundingClientRect().right,
                    right : this.selected.innerProperty.right
                };
            }

            this.selected.dataElement = dataElement;

            document.addEventListener('mousemove', this.mouseMove);
            document.addEventListener('mouseup', this.mouseUp, {once:true});
        }
    };

    mouseMove = (event) => {
        let newX = event.pageX - this.selected.shiftX;

        if (newX < this.selected.dragZone.left) {
            newX = this.selected.dragZone.left;
        }

        if (newX > this.selected.dragZone.right) {
            newX = this.selected.dragZone.right;
        }

        const newPercent = 100 * (newX - this.selected.innerProperty.left) / this.selected.innerProperty.width;
        const newValue = Math.round(this.setup.min + (newPercent * this.setup.range / 100));

        switch (this.selected.dataElement) {
            case 'thumbLeft' :
                this.setLeftElementStyle({thumbLeft: newPercent, from : newValue});
                break;
            case 'thumbRight':
                this.setRightElementStyle({thumbRight: 100 - newPercent, to : newValue});
        }
    };

    mouseUp = (event) => {
        document.removeEventListener('mousemove', this.mouseMove);
    } 

    constructor(
        {
            min = 0,
            max = 100,
            selected = { from: 11, to: 100 },
            formatValue = value => value + '%'
        } = {}
    ){
        this.setup = {
            min,
            max,
            range : max - min,
            formatValue
        };
        this.selected = this.getBeginSelected(selected);

        this.render(document.body);
    }

    render (parent) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.template;

        this.element = wrapper.firstElementChild;
        this.subElements = this.getSubElements(this.element);
        this.setElementStyle();

        this.element.addEventListener('mousedown', this.mouseDown);
    }

    getSubElements (element) {
        const elements = element.querySelectorAll('[data-element]');

        return [...elements].reduce((accum, subElement) => {
            accum[subElement.dataset.element] = subElement;
            return accum;
        }, {});
    }

    get template() {
        
        return `
            <div class="range-slider">
              <span data-element="from"></span>
              <div data-element="inner" class="range-slider__inner">
                <span data-element="progress" class="range-slider__progress"></span>
                <span data-element="thumbLeft" class="range-slider__thumb-left"></span>
                <span data-element="thumbRight" class="range-slider__thumb-right"></span>
              </div>
              <span data-element="to"></span>
            </div>
        `;
    }

    setElementStyle() {
        const objValues = {
            thumbLeft : 100 * this.selected.left / this.setup.range,
            thumbRight : 100 * this.selected.right / this.setup.range,
            from : this.setup.formatValue(this.selected.from),
            to : this.setup.formatValue(this.selected.to)
        };

        this.setLeftElementStyle(objValues);
        this.setRightElementStyle(objValues);
    }

    setLeftElementStyle({thumbLeft, from}) {
        this.subElements.from.innerText = from;
        this.subElements.thumbLeft.style.left = `${thumbLeft}%`;
        this.subElements.progress.style.left = `${thumbLeft}%`;
    }
    
    setRightElementStyle({thumbRight, to}) {
        this.subElements.to.innerText = to;
        this.subElements.thumbRight.style.right = `${thumbRight}%`;
        this.subElements.progress.style.right = `${thumbRight}%`;
    }

    getBeginSelected ({from = 0, to = 0}) {
        if (from < this.setup.min) from = this.setup.min;
        if (to > this.setup.max) to = this.setup.max;
        if (to < from) to = from;

        return {
          from, 
          to, 
          left : from,
          right : this.setup.range - to,
          shiftX : 0,
          dataElement : '',
          dragZone : {},
          innerProperty : {}
        };
    }

}
