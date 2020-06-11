import NotificationMessage from './NotificationMessage.js';

export default class SuccessNotificationMessage extends NotificationMessage {

    constructor(
        showText = 'Hello World!',
        {
            duration = 2000, 
            type = 'Warning'
        } = {}
    ) {
        // @param type = ['Success' | 'Error' | 'Warning']
        super(showText, {duration, type});

        this.render();
    }

}