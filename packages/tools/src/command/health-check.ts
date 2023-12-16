import { Command } from 'commander';

export default function (program: Command) {
    console.log('health check');
    program
        .command(`health-check`)
        .description(`Health check.`)
        .action(() => {
            console.log('Health check');
        });
}
