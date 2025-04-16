const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    tenant: {
        type: Schema.Types.ObjectId,
        ref: 'Tenant',
        required: function () {
            return !this.isForLandlord;
        }
    },
    landlord: {
        type: Schema.Types.ObjectId,
        ref: 'Landlord',
        required: function () {
            return !this.isForTenant;
        }
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: function () {
            return this.notificationType === 'roomRequest' ||
                this.notificationType === 'roomStatus' ||
                this.notificationType === 'maintenance';
        }
    },
    request: {
        type: Schema.Types.ObjectId,
        ref: 'Request',
        required: function () {
            return this.notificationType === 'roomRequest' ||
                this.notificationType === 'maintenance';
        }
    },

    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: function () {
            return this.notificationType === 'customMessage' ||
                this.notificationType === 'issueReport' ||
                this.notificationType === 'activity' ||
                this.notificationType === 'warning';
        }
    },

    notificationType: {
        type: String,
        required: true,
        enum: [
            'roomRequest',
            'roomStatus',
            'issueReport',
            'maintenance',
            'customMessage',
            'activity',
            'warning'
        ]
    },
    status: {
        type: String,
        required: function () {
            return this.notificationType === 'roomStatus' ||
                this.notificationType === 'maintenance';
        },
        enum: [
            'pending',
            'confirmed',
            'tenant-cancelled',
            'landlord-cancelled',
            'cancelled',
            'inProgress',
            'completed',
            'approve',
            'tenant-leave',
            'in-progress',
            'resolved'
        ]
    },

    isRead: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    time: {
        type: String,
        default: function () {
            return new Date().toLocaleTimeString();
        }
    }
});

// Index for sorting by latest first
notificationSchema.index({ createdAt: -1 });

notificationSchema.pre('save', function (next) {
    if (!this.title) {
        switch (this.notificationType) {
            case 'roomRequest':
                this.title = `Room request by Tenant`;
                break;
            case 'roomStatus':
                this.title = `Room status updated: ${this.status}`;
                break;
            case 'issueReport':
                this.title = `Issue reported: ${this.maintenanceType}`;
                break;
            case 'maintenance':
                this.title = `Maintenance update: ${this.maintenanceType} - ${this.status}`;
                break;
            case 'customMessage':
                this.title = `New message from ${this.tenant ? 'Tenant' : 'Landlord'}`;
                break;
            case 'activity':
                this.title = `Landlord activity: ${this.message}`;
                break;
            case 'warning':
                this.title = `Warning to Tenant`;
                break;
            default:
                this.title = `Notification`;
        }
    }
    next();
});


const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;