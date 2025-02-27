export default function postSignup(reply, request){
	if (request.body.password != request.body.confirmPassword)
		reply.status(400).send({message : "Password does not match"});
	else{
		const nickname = request.body.nickname;
		const pass = request.body.password;
		const email = request.body.email;
	}
}