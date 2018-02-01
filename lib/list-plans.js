module.exports = {


  friendlyName: 'List plans',


  description: 'List all Stripe plans.',


  moreInfoUrl: 'https://stripe.com/docs/api#list_plans',


  sideEffects: 'cacheable',


  inputs: {

    apiKey: require('../constants/apiKey.input'),

    created: {
      description: 'An optional object used to filter out the results based on the object `created` field.',
      example: { limit: 3 },
      required: false
    }

  },

  exits: {

    success: {
      outputFriendlyName: 'Stripe plans',
      outputDescription: 'A object with a data property that contains an array of up to `limit` plans',
      outputExample: {
        'object': 'list',
        'url': '/v1/plans',
        'has_more': false,
        'data': [require('../constants/plan.schema')]
      }
    }
  },

  fn: function (inputs, exits) {

    // Import `stripe`, and initialize it with the given API key.
    // (Or fall back to the cached API key, if available)
    var stripe = require('stripe')(inputs.apiKey||require('./private/cache').apiKey);

    var options = {};

    if (inputs.created) {
      options.created = inputs.created
    }

    // Use the Stripe API to list the plans.
    stripe.plans.list(options, function(err, plans) {

      // Send any errors through the `error` exit.
      // TODO: handle more specific exits (i.e. rate limit, customer does not
      // exist, etc.), possibly via a separate `negotiateError` machine.
      if (err) {return exits.error(err);}

      // Return the list of plans through the `success` exit.
      return exits.success(plans);
    });

  }

};
