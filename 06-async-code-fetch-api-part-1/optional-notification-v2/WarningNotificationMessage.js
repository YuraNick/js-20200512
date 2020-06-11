import NotificationMessage from './NotificationMessage.js';

export default class WarningNotificationMessage extends NotificationMessage {

    constructor(
        showText = 'Hello World!',
        {
            duration = 2000, 
            type = 'Warning'
        } = {}
    ) {
        // @param type = ['success' | 'error' | 'warning']
        super(showText, {duration, type});
        
        this.render();
    }
    
}