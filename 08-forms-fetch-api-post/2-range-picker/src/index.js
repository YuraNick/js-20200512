export default class RangePicker {
    element;
    subElements;
    rightCalendarMonth;
    rightCalendarYear;

    days = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
    months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']; 


    rangePickerShowEvent = (event) => {
        const rangepicker = event.target.closest('.rangepicker');
        rangepicker.classList.toggle('rangepicker_open');

        this.renderSelected();
    }

    rangePickerHiddenEvent = (event) => {
        const rangepicker = event.target.closest('.rangepicker');

        if (! rangepicker) {
            this.pickerHide();
        }
    }

    selectorEvent = (event) => {
        const element = event.target;

        if (element.classList.contains('rangepicker__selector-control-left')) {
            this.monthShift('left');
        } else if (element.classList.contains('rangepicker__selector-control-right')) {
            this.monthShift('right');
        } else if (element.classList.contains('rangepicker__cell')) {
            const endRange = this.rangeChange(element);

            if (endRange) {
                this.element.dispatchEvent(new CustomEvent('date-select', {
                    detail: this.getDispatchEventValue(),
                    bubbles: true
                }));

                this.pickerHide();
            }

        }
    }

    constructor({
        from = new Date(),
        to = new Date()
    }) {
        this.from = from;
        this.to = to;
        
        this.checkedFrom = from;
        this.checkedTo = to;
        
        this.render();
    }

    initEvents() {
        const { input, selector } = this.subElements;
        input.addEventListener('click', this.rangePickerShowEvent);
        selector.addEventListener('click', this.selectorEvent)

        document.addEventListener('click', this.rangePickerHiddenEvent, {capture: false});
    }

    removeEvents() {
        const { input, selector } = this.subElements;
        input.removeEventListener('click', this.rangePickerShowEvent);
        selector.removeEventListener('click', this.selectorEvent)

        document.removeEventListener('click', this.rangePickerHiddenEvent, {capture: false});
    }

    render() {
        this.checkRange();
        this.rightCalendarMonth = this.to.getMonth();
        this.rightCalendarYear = this.to.getFullYear();

        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.template();

        this.element = wrapper.firstElementChild;
        this.subElements = this.getSubElements(this.element);

        this.initEvents();
    }

    renderSelected() {
        this.subElements.selector.innerHTML = this.selectorTemplate();
        this.setSelectedStyle();
    }

    pickerHide () {
        this.element.classList.remove('rangepicker_open');
    }

    getDispatchEventValue () {
        return {
            from : this.from,
            to : this.to
        }
    }

    rangeChange (cell) {
        const dateCell = this.getCellDate(cell);

        if (this.checkedFrom && this.checkedTo) {
            this.checkedFrom = dateCell;
            this.checkedTo = null;

        } else {
            if (dateCell < this.checkedFrom) {
                this.checkedTo = this.checkedFrom;
                this.checkedFrom = dateCell;
            } else {
                this.checkedTo = dateCell;
            }

            this.rangeUpdate(this.checkedFrom, this.checkedTo);
        }

        this.setSelectedStyle();

        if (this.checkedFrom && this.checkedTo) {
            return true;
        }
    }

    rangeUpdate (checkedFrom, checkedTo) {
        this.from = checkedFrom;
        this.to = checkedTo;

        const { from, to } = this.subElements;
        
        from.innerText = this.getRangeDate(checkedFrom);
        to.innerText = this.getRangeDate(checkedTo);
    }

    monthShift (direction = 'left') {
        this.changeCalendarMonth(direction);

        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.calendarTemplate(direction);

        const calendarElement = wrapper.firstElementChild;
        this.setSelectedStyle(calendarElement);

        const { selector } = this.subElements;
        const calendars = selector.querySelectorAll('.rangepicker__calendar');

        if (direction === 'left') {
            calendars[1].remove();
            calendars[0].before(calendarElement);
        } else {
            calendars[0].remove();
            calendars[1].after(calendarElement);
        }
    }

    changeCalendarMonth (direction = 'left') {
        if (direction === 'left') {
            this.rightCalendarMonth--;

            if (this.rightCalendarMonth < 0) {
                this.rightCalendarYear--;
                this.rightCalendarMonth = this.months.length - 1;
            }
        } else {
            this.rightCalendarMonth++;

            if (this.rightCalendarMonth > this.months.length - 1) {
                this.rightCalendarYear++;
                this.rightCalendarMonth = 0;
            }
        }
    }

    getCellDate (cell) {
        const dataValue = cell.dataset.value;
        const dateCell = new Date( Date.parse(dataValue) );
        dateCell.setHours(0, 0, 0, 0);

        return dateCell;
    }

    setSelectedStyle (calendarElement = this.subElements.selector) {
        const cells = calendarElement.querySelectorAll('.rangepicker__cell[data-value]');
        
        [...cells].forEach( cell => {
            const dateCell = this.getCellDate(cell);

            cell.classList.remove('rangepicker__selected-to', 'rangepicker__selected-from', 'rangepicker__selected-between');

            if (dateCell - this.checkedTo === 0) {
                cell.classList.add('rangepicker__selected-to');
            } else if (dateCell - this.checkedFrom === 0) {
                cell.classList.add('rangepicker__selected-from');
            } else if (this.checkedFrom && dateCell > this.checkedFrom && dateCell < this.checkedTo) {
                cell.classList.add('rangepicker__selected-between');
            }
        });

    }

    getSubElements (element) {
        const elements = element.querySelectorAll('[data-element]');
    
        return [...elements].reduce((accum, subElement) => {
          accum[subElement.dataset.element] = subElement;
    
          return accum;
        }, {});
    }

    checkRange() {
        if (this.from > this.to) {
            const temp = this.from;
            
            this.from = this.to;
            this.to = temp;
        }
    }

    template() {
        return `
            <div class="rangepicker">
              ${this.iputTemplate()}
              <div class="rangepicker__selector" data-element="selector"></div>
            </div>
        `;
    }

    selectorTemplate() {
        return `
            <div class="rangepicker__selector-arrow"></div>
            <div class="rangepicker__selector-control-left"></div>
            <div class="rangepicker__selector-control-right"></div>
            ${this.calendarTemplate('left')}
            ${this.calendarTemplate('right')}
        `;
    }

    iputTemplate() {
        return `
          <div class="rangepicker__input" data-element="input">
            <span data-element="from">${this.getRangeDate(this.from)}</span> -
            <span data-element="to">${this.getRangeDate(this.to)}</span>
          </div>
        `;
    }

    calendarTemplate (position = 'right') {
        const monthName = this.getMonthName(position);

        return `
            <div class="rangepicker__calendar">
                <div class="rangepicker__month-indicator">
                  <time datetime="${monthName}">${monthName}</time>
                </div>
                <div class="rangepicker__day-of-week">
                    ${this.getDaysOfWeekTemplate()}
                </div>
                <div class="rangepicker__date-grid">
                    ${this.getCalendarMonth(position)}
                </div>
            </div>
        `;
    }

    getMonthName (position = 'right') {
        const monthNum = (position === 'right') ? this.rightCalendarMonth : this.rightCalendarMonth - 1;
        
        if (monthNum < 0) {
            return this.months[this.months.length - 1];
        }

        return this.months[monthNum];
    }

    getDaysOfWeekTemplate() {
        return this.days.map(day => `<div>${day}</div>`).join('');
    }

    getCalendarMonth (position = 'right') {
        const myDate = new Date();

        const year = this.rightCalendarYear;
        const month = (position === 'left') ? this.rightCalendarMonth - 1 : this.rightCalendarMonth;
        
        myDate.setFullYear(year, month, 1);

        return this.daysOfMonthTemplate(myDate);
    }

    daysOfMonthTemplate (date) {
        const daysTemplate = [];
        const firstDayOfWeekNumber = date.getDay();
        const month = date.getMonth();

        while (month === date.getMonth()) {
            daysTemplate.push( this.daysOfMonthFirstDayTemplate(date, firstDayOfWeekNumber) );

            date.setDate( date.getDate() + 1 );
        }

        return daysTemplate.join('');
    }

    daysOfMonthFirstDayTemplate (date, firstDayOfWeekNumber) {
        const day = date.getDate();

        if (day === 1) {
            return `<button type="button" class="rangepicker__cell" data-value="${date.toISOString()}" style="--start-from: ${firstDayOfWeekNumber}">${day}</button>`;
        }
        
        return `<button type="button" class="rangepicker__cell" data-value="${date.toISOString()}">${day}</button>`;
    }

    getRangeDate (date) {
        const month = this.numberToStringLengthTwoFormatting( date.getMonth() + 1 );
        const day = this.numberToStringLengthTwoFormatting( date.getDate() );
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    }

    numberToStringLengthTwoFormatting (number) {
        return (number > 9) ? number : `0${number}`;
    }

    remove() {
        this.removeEvents();
        this.element.remove();
    }

    destroy() {
        this.remove();
    }

}
