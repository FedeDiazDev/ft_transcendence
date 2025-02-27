export default function postSignup(request, reply){
	if (request.body.password != request.body.confirmPassword)
		reply.status(400).send({message : "Password does not match"});
	else{
		reply.status(200).send({message : "Registration complete"});
		//const nickname = request.body.nickname;
		//const pass = request.body.password;
		//const email = request.body.email;
	}
}