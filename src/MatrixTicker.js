import { io } from 'socket.io-client';


class MatrixTicker {
    constructor({ root, token, reconnect = true, max_retry = 50, max_delay = 60 }) {
        this.root = 'https://9jlz82ql-7000.inc1.devtunnels.ms';
        this.token = token;
        this.auto_reconnect = reconnect;
        this.reconnect_max_tries = max_retry;
        this.reconnect_max_delay = max_delay;

        this.triggers = {
            'connect': [], 'ticks': [], 'disconnect': [], 'price_update' : [] , 'telegram_message' : [],'premium_telegram_message' : [],
            'error': [], 'close': [], 'reconnect': [], 'noreconnect': [], 'message': [], 'order_update': [] , 
        };

        this.ws = null;
        this.last_read = new Date();
        this.last_reconnect_interval = 0;
        this.current_reconnection_count = 0;

        this.connect();
    }

    connect() {
        if (this.ws) return;

        let url = `${this.root}?token=${this.token}`;
        this.ws = io(url, {  transports: ['websocket'], reconnection: false });

        this.ws.on('price_update', (data) => {
            this.trigger('price_update', [data]);
        });
        
        
        this.ws.on('connect', () => {
            this.last_reconnect_interval = 0;
            this.current_reconnection_count = 0;
            this.trigger('connect');
        });
        
        this.ws.on('message', (data) => {
            this.trigger('ticks', [data]);
            this.last_read = new Date();
        });
        
        this.ws.on('telegram_message', (data) => {
            this.trigger('telegram_message', [data]);
        });
        this.ws.on('premium_telegram_message', (data) => {
            this.trigger('premium_telegram_message', [data]);
        });

        this.ws.on('connect_error', (error) => {
            this.trigger('error', [error]);
        });

        this.ws.on('disconnect', (reason) => {
            this.trigger('disconnect', [reason]);
            if (this.auto_reconnect) this.attemptReconnection();
        });
    }
    disconnect() {
        if (this.ws) {
            this.ws.disconnect();
            this.ws = null;
        }
    }
    on(event, callback) {
        if (this.triggers[event]) {
            this.triggers[event].push(callback);
        }
    }
    subscribe(tokens , id) {
        if (this.ws && tokens.length > 0 ) {
            console.log(tokens)
            this.ws.emit('subscribe_symbol', { symbol : tokens , user_id : id});
        }
    }
    unsubscribe(tokens , id) {
        if (this.ws) {
            this.ws.emit('unsubscribe', { symbol : tokens , user_id : id });
        }
    }

    calculate_profit(data) {
        if (this.ws) {
            this.ws.emit('calculate_profit' ,  data);
        }
    }

    attemptReconnection() {
        if (this.current_reconnection_count > this.reconnect_max_tries) {
            this.trigger('noreconnect');
            return;
        }

        this.last_reconnect_interval = Math.min(2 ** this.current_reconnection_count, this.reconnect_max_delay);
        this.current_reconnection_count++;

        setTimeout(() => {
            this.connect();
        }, this.last_reconnect_interval * 1000);
    }

    trigger(event, args = []) {
        if (this.triggers[event]) {
            this.triggers[event].forEach(callback => callback(...args));
        }
    }
}

export default MatrixTicker;
