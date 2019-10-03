function onCoinOrSubscriptionClick (type, event) {
	var iterator

	if (type === 'subscription') {
		iterator = $('.subscriptions .subscription')
	} else {
		iterator = $('.coins .coin')
	}

	iterator.removeClass('active')

	iterator.find('button').removeClass('btn-primary')
	iterator.find('button').addClass('btn-outline-secondary')

	$(event.currentTarget).closest('.' + type).addClass('active')

	$(event.currentTarget).addClass('btn-primary')
}

jQuery(document).ready(function($) {
	$('.subscriptions .subscription button').click(function (event) {
		onCoinOrSubscriptionClick('subscription', event)
	})

	$('.coins .coin button').click(function (event) {
		onCoinOrSubscriptionClick('coin', event)
	})
})
