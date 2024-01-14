const { BkashGateway } = require('bkash-payment-gateway');

const bkashConfig = {
	baseURL: 'https://checkout.sandbox.bka.sh/v1.2.0-beta', //do not add a trailing slash
	key: 'abcdxx2369',
	username: 'bkashTest',
	password: 'bkashPassword1',
	secret: 'bkashSup3rS3cRet',
};

const bkash = new BkashGateway(config);
module.exports = bkash;

export default bkashConfig;