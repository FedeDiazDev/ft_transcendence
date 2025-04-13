import QRCode from 'qrcode';
import speakeasy from 'speakeasy';

export default async function createQR(){
	const secret = speakeasy.generateSecret();
	const qrcode = await QRCode.toDataURL(secret.otpauth_url)
	const data = {
		sr : secret,
		qr : qrcode
	}
	return data;
}
