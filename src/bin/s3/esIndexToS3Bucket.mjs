import { Command, Option } from 'commander';
import * as _ from 'lamb';

import { indexToBucket } from 'dap_dv_backends_utils/aws/s3.mjs';
import { arxliveCopy } from 'dap_dv_backends_utils/conf/config.mjs';
import { commanderParseInt } from 'dap_dv_backends_utils/util/commander.mjs';

const program = new Command();
program.option(
	'-d, --domain <domain>',
	'ES domain on which the index is held',
	arxliveCopy
);
program.requiredOption('-i, --index <index>', 'ES index to copy');
program.requiredOption('-b, --bucket <bucket name>', 'name of s3 bucket');
program.requiredOption('-k, --key <bucket key>', 'name of s3 key');
program.option(
	'-p, --page-size <page size>',
	'Size of page to scroll with',
	commanderParseInt,
	10000
);
program.option(
	'-t, --threshold <confidence value>',
	'Threshold to filter with',
	commanderParseInt,
	0
);
program.option(
	'-n, --pages <number of pages>',
	'Number of pages to iterate',
	'all'
);
program.addOption(
	new Option('--format <format>')
	.choices(['array', 'object', 'entities'])
	.default('array')
);
program.addOption(
	new Option('--processor <processor>')
	.choices(['default', 'simple', 'es'])
	.default('default')
);

program.parse();
const options = program.opts();


const main = async () => {
	await indexToBucket(
		options.index,
		options.domain,
		options.bucket,
		options.key,
		options
	);
};

await main();
