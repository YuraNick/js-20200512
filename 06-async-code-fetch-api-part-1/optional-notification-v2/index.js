import SuccessNotificationMessage from './SuccessNotificationMessage.js';
import WarningNotificationMessage from './WarningNotificationMessage.js';
import ErrorNotificationMessage from './ErrorNotificationMessage.js';

export default class NotificationManager {
    stackLimit;
    normalNotifications = [];

    constructor ({ stackLimit = 5 } = {}) {
        this.stackLimit = stackLimit;
    }

    showMessage (text, {
        duration = 1000,
        type = 'Success'
    } = {}) {
        const typeLowered = type.toLocaleLowerCase();
        const notificationMessage = this.getNotificationMessage(typeLowered, text, {duration, type});

        this.show(typeLowered, notificationMessage)
    }

    show (typeLowered, notificationMessage) {
        if (typeLowered !== 'error') {
            const notifications = this.getNotificationsShowed(this.normalNotifications);
            
            notifications.push(notificationMessage);
            
            if (notifications[0] && notifications.length > this.stackLimit) {
                notifications[0].remove();
                notifications.shift();
            }

            this.normalNotifications = notifications; 
        }

        notificationMessage.show();
    }

    getNotificationMessage (typeLowered, text, {duration, type}) {
        switch (typeLowered) {
            case 'error':
                return new ErrorNotificationMessage(text, {duration, type});

            case 'warning':
                return new WarningNotificationMessage(text, {duration, type});
            
            case 'success':
            default:
                return new SuccessNotificationMessage(text, {duration, type});
        }

    }

    getNotificationsShowed (normalNotifications) {
        return normalNotifications.filter(item => item.timerId);
    }

}



