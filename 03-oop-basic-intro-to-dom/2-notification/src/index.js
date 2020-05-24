export default class NotificationMessage {
    element; // HTMLElement;
    button;
    timerId;

    constructor(
        showText = 'Hello World!',
        {duration = 2000, type = 'success'} = {}
    ) {
        // @param type = ['success' | 'error']
        this.showText = showText;
        this.duration = duration;
        this.durationSeconds = (duration / 1000).toFixed(1);
        this.type = type;
        this.button = document.getElementById('btn1');

        this.render();
        this.initEventListeners();
    }

    show (node = document.body) {
        node.append(this.element);
        
        // как this остается в контексте класса внутри ф-ии remove() при ее выполнении внутри setTimeout?
        this.timerId = setTimeout(() => this.remove(), this.duration);
    }

    initEventListeners() {
        // не лучше ли тут все-так написать 
        // if (! this.button) return;
        // и ниже остальной код - избавление от лишнего уровня вложенности (?)
        if (this.button) {
            this.button.addEventListener(
                'click', 
                () => this.remove(),
                { once: true } //выполнится один раз
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
        element.setAttribute('style', `--value:${this.durationSeconds}s`);
        element.innerHTML = this.template;
        
        this.element = element;
    }

    remove() {
        if (this.timerId) clearTimeout(this.timerId); // нужно ли удалять таймер?
        this.element.remove();
    }

    destroy() {
        this.remove();
    }
}
