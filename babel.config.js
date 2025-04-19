module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: ['nativewind/babel',
    [
			'module:react-native-dotenv',
			{
				"envName": "APP_ENV",
				"moduleName": "@env",
				"path": ".env",
				"blocklist": null,
				"whitelist": null, 
				"safe": false,
				"allowUndefined": true,
			},
		],
  ],
};
