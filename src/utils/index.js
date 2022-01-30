module.exports.GenVideoID = () => {
	const length = 16,
		charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let result = '';

	for (let i = length; i > 0; --i) {
		result += charset[Math.floor(Math.random() * charset.length)];
	}
	return result;
};
