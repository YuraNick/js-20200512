export default class DoubleSlider {
    element;
    subElements;
    setup;
    min;
    max;
    selected;
    rangeSelectedEvent;

    mouseDown = (event) => {
        const element = event.target.closest('[data-element]');
        const elementName = (element) ? element.dataset.element : '';
        
        if (elementName === 'thumbLeft' || elementName === 'thumbRight') {
            // так тесты не проходят, а в браузере нормально работает:
            // this.selected.innerProperty = this.subElements.inner.getBoundingClientRect();
            this.selected.innerProperty = this.getBoundingClientRect(this.subElements.inner);

            this.selected.shiftX = event.clientX - element.getBoundingClientRect().left;

            switch (elementName) {
                case 'thumbLeft':
                    this.selected.dragZone = {
                        left : this.selected.innerProperty.left,
                        // при right : this.subElements.thumbRight.getBoundingClientRect().left, тесты не проходят, а в браузере нормально работает:
                        right : this.selected.innerProperty.left + ((100 - this.selected.thumbRight) * this.selected.innerProperty.width / 100),
                    };
                    break;

                case 'thumbRight':
                    this.selected.dragZone = {
                        // при left : this.subElements.thumbLeft.getBoundingClientRect().right, тесты не проходят, а в браузере нормально работает:
                        left : this.selected.innerProperty.left + (this.selected.thumbLeft * this.selected.innerProperty.width / 100),
                        right : this.selected.innerProperty.right
                    };
            }

            this.selected.elementName = elementName;

            document.addEventListener('pointermove', this.mouseMove);
            document.addEventListener('pointerup', this.mouseUp, {once:true});
        }
    };

    mouseMove = (event) => {
        let newX = event.clientX - this.selected.shiftX;

        if (newX < this.selected.dragZone.left) {
            newX = this.selected.dragZone.left;
        } else if (newX > this.selected.dragZone.right) {
            newX = this.selected.dragZone.right;
        }

        const newPercent = 100 * (newX - this.selected.innerProperty.left) / this.selected.innerProperty.width;
        const newValue = this.setup.min + (newPercent * this.setup.range / 100);

        switch (this.selected.elementName) {
            case 'thumbLeft' :
                this.selected.thumbLeft = newPercent;
                this.selected.from = newValue;
                this.setLeftElementStyle(this.selected);
                break;
                
            case 'thumbRight':
                this.selected.thumbRight = 100 - newPercent;
                this.selected.to = newValue;
                this.setRightElementStyle(this.selected);
        }
    };

    mouseUp = () => {
        this.element.dispatchEvent(this.rangeSelectedEvent);
        document.removeEventListener('pointermove', this.mouseMove);
    } 

    constructor(
        {
            min = 0,
            max = 100,
            selected = { from: min, to: max },
            formatValue = value => value + '%'
        } = {}
    ){
        this.min = min;
        this.max = max;
        
        this.setup = {
            min,
            max,
            range : max - min,
            formatValue
        };
        
        this.selected = this.getBeginSelected(selected);

        this.render();
    }

    render () {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.template;

        this.element = wrapper.firstElementChild;
        this.subElements = this.getSubElements(this.element);
        this.setLeftElementStyle(this.selected);
        this.setRightElementStyle(this.selected);

        this.element.addEventListener('pointerdown', this.mouseDown);

        this.rangeSelectedEvent = new CustomEvent("range-select", {
            detail: {from: this.selected.from, to: this.selected.to},
            bubbles: true
        });
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

    setLeftElementStyle ({thumbLeft, from}) {
        this.subElements.from.textContent = this.setup.formatValue(Math.round(from));
        this.subElements.thumbLeft.style.left = `${thumbLeft}%`;
        this.subElements.progress.style.left = `${thumbLeft}%`;
    }
    
    setRightElementStyle ({thumbRight, to}) {
        this.subElements.to.textContent = this.setup.formatValue(Math.round(to));
        this.subElements.thumbRight.style.right = `${thumbRight}%`;
        this.subElements.progress.style.right = `${thumbRight}%`;
    }

    getBeginSelected ({from = 0, to = 0}) {
        let left = from - this.setup.min;
        let right = this.setup.range - to + this.setup.min;
        
        if (left < 0) { left = 0 };
        if (right < 0) { right = 0 };

        return {
          from, 
          to, 
          left : left,
          right : right,
          thumbLeft : 100 * left / this.setup.range,
          thumbRight : 100 * right / this.setup.range,
          shiftX : 0,
          elementName : '',
          dragZone : {},
          innerProperty : {}
        };
    }

    getBoundingClientRect (element) {
        if (element.getBoundingClientRect().right) {
            return element.getBoundingClientRect();
        }

         // добавлено для тестов
        return {
            left : element.getBoundingClientRect().left,
            width : element.getBoundingClientRect().width,
            right : element.getBoundingClientRect().left + element.getBoundingClientRect().width
        }
    }

    removeEvents() {
        document.removeEventListener('pointermove', this.mouseMove);
        document.removeEventListener('pointerup', this.mouseUp, {once:true});
        this.element.removeEventListener('pointerdown', this.mouseDown);
    }

    destroy() {
        this.removeEvents();
        this.element.remove();
    }

}
