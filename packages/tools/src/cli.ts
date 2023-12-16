import { Command } from 'commander';
import { packageInfo } from './utils/constants.js';
import { error } from './utils/print.js';

async function main() {
    const program = new Command();
    program.name(packageInfo.name);
    program.description(packageInfo.description);
    program.version(packageInfo.version);

    const fn = (await import('./command/health-check.js')).default;
    fn(program);

    // await loadCommands({
    //     commandDirs: [resolve(__dirname, 'command')],
    //     filter: filePath => path.extname(filePath) === '.js' || fs.statSync(filePath).isDirectory(),
    //     program
    // });

    program.parse();
}

try {
    await main();
} catch (err) {
    error('Run error.', err);
    process.exit(1);
}
