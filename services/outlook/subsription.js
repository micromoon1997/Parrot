const { getClient } = require('./ms-graph-client');
const ONE_DAY = 86400000;

async function createSubscription() {
  const subscription = {
    changeType: 'created, updated',
    notificationUrl: process.env.SERVER_ADDRESS + '/email',
    resource: 'me/events',
    expirationDateTime: new Date((new Date()).getTime() + ONE_DAY * 2)
  };
  try {
    const client = getClient();
    const result = await client
      .api('/subscriptions')
      .post(subscription);
    console.log(`Subscription created. Id: ${result.id}`);
  } catch (err) {
    console.log(err);
  }
}

async function listSubscription() {
  try {
    const client = getClient();
    const result = await client
      .api('/subscriptions')
      .get();
    console.log(`Current subscriptions:\n${JSON.stringify(result.value, null, 2)}`);
  } catch (err) {
    console.log(err);
  }
}

async function deleteAllSubscriptions() {
  try {
    const client = getClient();
    const result = await client
      .api('/subscriptions')
      .get();
    for (const subscription of result.value) {
      await client
        .api(`/subscriptions/${subscription.id}`)
        .delete();
    }
  } catch (err) {
    console.log(err);
  }
}

async function renewSubscription(id) {
  const subscription = {
    expirationDateTime: new Date((new Date()).getTime() + ONE_DAY * 2)
  };
  try {
    const client = getClient();
    await client
      .api(`/subscriptions/${id}`)
      .update(subscription);
    console.log(`Subscription updated to ${subscription.expirationDateTime}`);
  } catch (err) {
    console.log(err);
  }
}

async function checkSubscription() {
  try {
    const client = getClient();
    const result = await client
      .api('/subscriptions')
      .get();
    const subscriptions = result.value;
    if (subscriptions.length === 0) {
      await createSubscription();
    } else {
      if (subscriptions.length > 1) {
        console.log('Warning: more than one subscription found!');
      }
      const subscription = subscriptions[0];
      const tomorrow = new Date((new Date()).getTime() + ONE_DAY);
      if (new Date(subscription.expirationDateTime) < tomorrow) {
        await renewSubscription(subscription.id);
      }
    }
    await listSubscription();
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  deleteAllSubscriptions: deleteAllSubscriptions,
  checkSubscription: checkSubscription
};