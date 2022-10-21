import { sendEmail } from 'aws/email.mjs';

import { performance } from 'perf_hooks';

export const Progress = class {
	constructor(total, email, id) {
		this.total = total;
		this.email = email;
		this.id = id;
		this.current = 0;
		this.startTime = performance.now();
		this.endTime = null;
	}

	increment(amount) {
		this.current += amount;
	};

	status() {
		if (this.current === 0) {
			return { status: 'provisioning' };
		}
		if (this.current === this.total) {
			return {
				status: 'finished',
				timeTakenInMS: this.endTime - this.startTime
			};
		}
		return {
			status: 'annotating',
			progress: this.current,
			total: this.total
		};
	}

	stop() {
		this.current = this.total;
		this.endTime = performance.now();
		sendEmail(
			this.email,
			'annotations@dap-tools.uk',
			`Your annotation with id <code>${this.id}</code> has finished`,
			'Annotation finished.'
		);
	}
};
