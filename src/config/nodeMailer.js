const nodemailer = require('nodemailer');

// Tạo transporter
const transporter = nodemailer.createTransport({
	service: 'gmail',
	port: 587,
	secure: true,
	auth: {
		user: 'tainvFX21453@funix.edu.vn',
		pass: '2J8pv6qmBBjf',
	},
});

// Gửi email
const sendEmail = async (to, subject, html) => {
	try {
		await transporter.sendMail({
			from: 'tainvFX21453@funix.edu.vn',
			to,
			subject,
			html,
		});
		console.log('Email đã được gửi thành công!');
	} catch (error) {
		console.error('Gửi email thất bại:', error);
	}
};

//sử dụng
const sendOrderConfirmationEmail = async (order) => {
	const { customer, products, totalPrice } = order;
	const html = `
    <html>
      <head>
        <title>Xác nhận đơn hàng</title>
      </head>
      <body>
        <h1>Xin chào ${customer.name}</h1>

        <p>Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi!</p>

        <h2>Thông tin đơn hàng</h2>

        <table border="1">
          <tr>
            <th>Tên sản phẩm</th>
            <th>Hình ảnh</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Thành tiền</th>
          </tr>
          ${products
						.map(
							(product) => `
            <tr>
              <td style="padding-left:16px;">${product.name}</td>
              <td><img style="max-width: 100px; height: auto; display: block;"alt='product' src=${
								product.image
							}/></td>
              <td style="text-align:center;frot-size:2rem;font-weight:600;">${
								product.quantity
							}</td>
              <td>${product.price.toLocaleString('vi-VN')} VND</td>
              <td>${(product.price * product.quantity).toLocaleString(
								'vi-VN'
							)} VND</td>
            </tr>
          `
						)
						.join('')}
           
        </table>
		 <h2>Tổng thanh toán :</h2>
            <p style="font-weight:700;font-size:1.6rem;">${totalPrice.toLocaleString(
							'vi-VN'
						)} VND</p>
        <p>Cảm ơn bạn đã tin tưởng cửa hàng của chúng tôi. Chúng tôi sẽ giao hàng cho bạn trong thời gian sớm nhất.</p>

        <p>Trân trọng,</p>

        <p>Hệ thống đặt hàng</p>
      </body>
    </html>
  `;

	await sendEmail(customer.email, 'Xác nhận đơn hàng', html);
};

module.exports = { sendOrderConfirmationEmail };
