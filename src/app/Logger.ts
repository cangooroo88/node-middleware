export class Logger {

    public static forkName = 'unknow';

    protected static getDate() {
        return (new Date()).toISOString().replace('T', ' ').replace('Z', '');
    }

    protected static write(msgs: any[], type: string) {
        let header = Logger.getDate() + ' {' + Logger.forkName + '}                ';
        header = header.substr(0, 38);
        header += '['+ type+'] ::';
        let args = [header].concat(msgs);
        console.log.apply(console, args);
    }

    public static log(...msgs: any[]) {
        Logger.write(msgs, 'log');
    }

    public static error(...msgs: any[]) {
        Logger.write(msgs, 'error');
    }

    public static info(...msgs: any[]) {
        Logger.write(msgs, 'info');
    }

    public static warn(...msgs: any[]) {
        Logger.write(msgs, 'warn');
    }

}