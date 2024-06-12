const authenticate = async (req, res, next) => {
	console.log('req', req.cookies);
	if (!req.cookies.user) {
		return res.json({ status: false, msg: 'k có cookie' });
	}
	next();
};

// Middleware để phân quyền dựa trên cookie
function authorize(roles) {
	return function (req, res, next) {
		const user = req.cookies.user;
		if (!user || !roles?.includes(user.role)) {
			return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
		}
		next();
	};
}
module.exports = { authenticate, authorize };
