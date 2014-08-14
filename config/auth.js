// expose our config directly to our application using module.exports

module.exports = {

	'twitterAuth' : {
		'consumerKey'		: 'bHvbLhnCOCUmbBWIxkvxitd57',
		'consumerSecret'	: '8zpT3FoQY71tzNtJ704eQyAe5txDbMSUtBN72ybVOIGCChMQ4i',
		'callbackURL'		: 'http://127.0.0.1:3000/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID'			: '997716163685-htc7i5894vfqelg7o483lqgsac2tdk0m.apps.googleusercontent.com',
		'clientSecret'		: '7L61BISeu69-zOsAetTmo_H8',
		'callbackURL'		: 'http://127.0.0.1:3000/auth/google/callback'
	}
};