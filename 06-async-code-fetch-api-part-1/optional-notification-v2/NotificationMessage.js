export default class NotificationMessage {
    element;
    timerId;

    eventRemove = () => this.remove();

    constructor(
        showText = 'Hello World!',
        {
            duration = 2000, 
            type = 'Success'
        } = {}
    ) {
        // @param type = ['Success' | 'Error' | 'Warning']
        this.showText = showText;
        this.duration = duration;
        this.type = type;
    }

    show (node = document.body) {
        node.append(this.element);
        this.timerId = setTimeout(() => this.remove(null), this.duration);
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.template;

        this.element = wrapper.firstElementChild;
    }

    get template () {
        return `
        <div class="notification ${this.type.toLocaleLowerCase()}" style="--value:${this.duration / 1000}s">
          <div class="timer"></div>
          <div class="inner-wrapper">
            <div class="notification-header">${this.type}:</div>
            <div class="notification-body">
              ${this.showText}
            </div>
          </div>
        </div>
        `;
    }

    remove (timerId = this.timerId) {
        if (timerId) {
            clearTimeout(timerId);
        }

        this.timerId = null;

        this.element.remove();
    }

    destroy() {
        this.remove();
    }
}