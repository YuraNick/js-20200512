import NotificationMessage from './NotificationMessage.js';

export default class ErrorNotificationMessage extends NotificationMessage {
    closeElement;

    eventRemove = () => this.remove();

    constructor(
        showText = 'Hello World!',
        {
            type = 'Error'
        } = {}
    ){
        // @param type = ['Success' | 'Error' | 'Warning']
        super(showText, {type});

        this.render();
    }

    show (node = document.body) {
        this.closeElement.addEventListener('click', this.eventRemove);
        node.append(this.element);
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.template;

        this.element = wrapper.firstElementChild;
        this.closeElement = wrapper.querySelector('.close');
    }

    get template () {
        return `
          <div class="notification error">
            <div class="inner-wrapper">
              <div class="notification-header">${this.type}: <span class="close">&times;</span></div>
              <div class="notification-body">
                ${this.showText}
              </div>
            </div>
          </div>
        `
    }

    remove () {
        this.closeElement.removeEventListener('click', this.eventRemove);

        this.element.remove();
    }

}