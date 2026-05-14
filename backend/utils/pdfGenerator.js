import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const generateReceipt = async (order, service, user) => {
  return new Promise((resolve, reject) => {
    try {
      const uploadsDir = 'uploads';
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filename = `receipt-${order.orderNumber}.pdf`;
      const filepath = path.join(uploadsDir, filename);
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Header
      doc.fontSize(24).font('Helvetica-Bold').text('JaySoftShine', { align: 'center' });
      doc.fontSize(12).font('Helvetica').text('Your Trusted Business Consultant', { align: 'center' });
      doc.fontSize(10).text('Kota, Rajasthan, India', { align: 'center' });
      doc.moveDown();

      // Divider
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Order Details
      doc.fontSize(14).font('Helvetica-Bold').text('Order Receipt');
      doc.fontSize(10).font('Helvetica');
      doc.moveDown(0.5);

      doc.text(`Order Number: ${order.orderNumber}`);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
      doc.text(`Status: ${order.status}`);
      doc.text(`Payment Status: ${order.paymentStatus}`);
      doc.moveDown();

      // Customer Details
      doc.fontSize(12).font('Helvetica-Bold').text('Customer Details');
      doc.fontSize(10).font('Helvetica');
      doc.text(`Name: ${order.customerDetails.name}`);
      doc.text(`Email: ${order.customerDetails.email}`);
      doc.text(`Phone: ${order.customerDetails.phone}`);
      doc.text(`Address: ${order.customerDetails.address}, ${order.customerDetails.city}, ${order.customerDetails.state} ${order.customerDetails.zip}`);
      doc.moveDown();

      // Service Details
      doc.fontSize(12).font('Helvetica-Bold').text('Service Details');
      doc.fontSize(10).font('Helvetica');
      doc.text(`Service: ${service.name}`);
      doc.text(`Category: ${service.category}`);
      doc.text(`Description: ${service.description}`);
      doc.moveDown();

      // Amount Summary
      doc.fontSize(12).font('Helvetica-Bold').text('Amount Summary');
      doc.fontSize(10).font('Helvetica');
      const totalAmount = order.totalAmount || service.basePrice;
      doc.text(`Service Price: ₹${totalAmount}`);
      if (order.discount) {
        doc.text(`Discount: -₹${order.discount}`);
      }
      doc.fontSize(12).font('Helvetica-Bold');
      doc.text(`Total Amount: ₹${order.finalAmount || totalAmount}`);
      doc.moveDown();

      // Payment Details
      if (order.razorpayPaymentId) {
        doc.fontSize(10).font('Helvetica');
        doc.text(`Payment ID: ${order.razorpayPaymentId}`);
        doc.text(`Paid On: ${new Date(order.paidAt).toLocaleDateString()}`);
        doc.moveDown();
      }

      // Footer
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();
      doc.fontSize(10).text('Thank you for your business!', { align: 'center' });
      doc.text('Email: hello@jaysoftshine.com | Support: https://services.jayeshvyas.com/support-portal/', { align: 'center' });
      doc.text('© 2026 JaySoftShine. All rights reserved.', { align: 'center' });

      doc.end();

      stream.on('finish', () => {
        resolve(`/uploads/${filename}`);
      });

      stream.on('error', reject);
    } catch (err) {
      reject(err);
    }
  });
};

export default generateReceipt;