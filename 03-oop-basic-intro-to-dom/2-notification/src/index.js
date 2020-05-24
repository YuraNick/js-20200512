export default class NotificationMessage {
    element; // HTMLElement;
    button;
    timerId;

    constructor(
        showText = 'Hello World!',
        {duration = 2000, type = 'success'}
    ) {
        // type = 'success' | 'error'
        this.showText = showText;
        this.duration = duration;
        this.type = type;
        this.button = document.getElementById('btn1');
    }

    show () {
        this.render();
        this.initEventListeners();
        // как this остается в контексте класса внутри ф-ии remove() при ее выполнении внутри setTimeout?
        this.timerId = setTimeout(() => this.remove(), this.duration);
    }

    initEventListeners() {
        // не красивее ли тут все-так написать 
        // if (! this.button) return;
        // и ниже остальной код - избавление от лишнего уровня вложенности (?)
        if (this.button) {
            this.button.addEventListener(
                'click', 
                () => this.remove(),
                { once: true }
            );
        }
    }

    get template() {
        return `
          <div class="timer"></div>
          <div class="inner-wrapper">
            <div class="notification-header">${this.type}</div>
            <div class="notification-body">
              ${this.showText}
            </div>
          </div>
        `;
    }

    render() {
        // решил, что будет неправильно размещать всю конструкцию сообщение внутри простого div
        const element = document.createElement('div');
        element.className = `notification ${this.type}`;
        element.setAttribute('style', `--value:${this.duration/1000}s`);
        element.innerHTML = this.template;

        this.element = element;
        document.body.append(this.element);
    }

    remove() {
        if (this.timerId) clearTimeout(this.timerId); // нужно ли это?
        this.element.remove();
    }

    destroy() {
        this.remove();
    }
}
