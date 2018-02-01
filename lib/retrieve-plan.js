module.exports = {


  friendlyName: 'Retrieve Plan Details',


  description: 'Retrieve details of a plan.',


  sideEffects: 'cacheable',


  inputs: {

    apiKey: require('../constants/apiKey.input'),

    plan: {
      description: 'The ID of the plan you wish to retrieve details for.',
      extendedDescription: 'When you create a plan for a customer, this will have a specific ID.',
      example: 'basic',
      required: true
    }

  },

  exits: {

    success: {
      outputFriendlyName: 'Stripe plan details',
      outputDescription: 'The details of the specified Stripe plan.',
      outputExample: require('../constants/plan.schema')
    }

  },

  fn: function (inputs, exits) {

    // Import `stripe`, and initialize it with the given API key.
    // (Or fall back to the cached API key, if available)
    var stripe = require('stripe')(inputs.apiKey||require('./private/cache').apiKey);

    // Use the Stripe API to retrieve the subscription's details.
    stripe.plans.retrieve(inputs.plan, function(err, plan) {
      // Send any errors through the `error` exit.
      // TODO: handle more specific exits (i.e. rate limit, customer does not
      // exist, etc.), possibly via a separate `negotiateError` machine.
      if (err) {return exits.error(err);}

      // Return the new plan details through the `success` exit.
      return exits.success(plan);
    });

  }

};
