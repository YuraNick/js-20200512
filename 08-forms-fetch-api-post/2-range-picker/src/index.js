export default class RangePicker {
    element;
    subElements;
    range;
    rightCalendarMonth;
    rightCalendarYear;

    days = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
    months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']; 

    constructor({
        from = new Date(),
        to = new Date()
    }) {
        this.from = from;
        this.to = to;
        
        this.render();
    }

    render() {
        this.checkRange();
        this.rightCalendarMonth = this.to.getMonth();
        this.rightCalendarYear = this.to.getFullYear();

        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.template();

        this.element = wrapper.firstElementChild;
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
          <div class="container">
            <div class="rangepicker rangepicker_open">
              ${this.iputTemplate()}
              <div class="rangepicker__selector" data-element="selector">
                <div class="rangepicker__selector-arrow"></div>
                <div class="rangepicker__selector-control-left"></div>
                <div class="rangepicker__selector-control-right"></div>
                ${this.calendarTemplate('left')}
                ${this.calendarTemplate('right')}
              </div>
            </div>
          </div>
        `;
    }

    iputTemplate() {
        return `
          <div class="rangepicker__input" data-element="input">
            <span data-element="from">${this.getRangeDate(this.from)}</span> -
            <span data-element="to">${this.getRangeDate(this.to)}</span>
          </div>
        `
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
        myDate.setDate(1);

        const year = this.rightCalendarYear;
        const month = (position === 'left') ? this.rightCalendarMonth - 1 : this.rightCalendarMonth;
        
        myDate.setFullYear(year, month);
        
        const myDateObj = this.getMyDateObject(myDate);

        return this.daysOfMonthTemplate(myDateObj);
    }

    daysOfMonthTemplate (myDateObj) {
        const daysTemplate = [];

        for (let i = 0; i < myDateObj.daysInMonth; i++) {
            daysTemplate.push(this.daysOfMonthFirstDayTemplate(myDateObj, i + 1));
        }

        return daysTemplate.join('');
    }

    daysOfMonthFirstDayTemplate (myDateObj, day) {
        const { year, month, hours, minutes, seconds, miliseconds, firstDayOfWeekNumber } = myDateObj;
        
        if (day === 1) {
            return `<button type="button" class="rangepicker__cell" data-value="${this.getDateString(myDateObj, day)}" style="--start-from: ${firstDayOfWeekNumber}">${day}</button>`;
        }
        
        return `<button type="button" class="rangepicker__cell" data-value="${this.getDateString(myDateObj, day)}">${day}</button>`;
    }

    getDateString (myDateObj, day) {
        const { year, month, hours, minutes, seconds, miliseconds } = myDateObj;

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${miliseconds}Z`;
    }

    getMyDateObject (date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDay();
        const hours = date.getHours();
        const minutes = date.getMinutes(); 
        const seconds = date.getSeconds(); 
        const miliseconds = date.getMilliseconds();
        const daysInMonth = 33 - new Date(year, month, 33).getDate();
        const firstDayOfWeekNumber = date.getDay();

        return {
            year,
            month,
            day,
            hours,
            minutes,
            seconds,
            miliseconds,
            daysInMonth,
            firstDayOfWeekNumber
        }
    }



    getRangeDate(date) {
        const month = date.getMonth() + 1;
        const day = date.getDay() + 1;
        const year = String(date.getFullYear()).slice(2, 4);

        return `${month}/${day}/${year}`;
    }

    remove() {

    }

    destroy() {

    }



}
