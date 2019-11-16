function onCoinOrSubscriptionClick (type, event) {
	var iterator

	if (type === 'subscription') {
		iterator = $('.subscriptions .subscription')
	} else {
		iterator = $('.coins .coin')
	}

	iterator.removeClass('active')

	$(event.currentTarget).closest('.' + type).addClass('active')
}

function showPreCheckout(amount, total) {
	$('#preCheckoutAmount').text(amount)
	$('#preCheckoutTotal').text(total)

	$('#preCheckoutDialog').modal()
}

jQuery(document).ready(function($) {
	$('.subscriptions .subscription button').click(function (event) {
		onCoinOrSubscriptionClick('subscription', event)
	})

	$('.coins .coin button').click(function (event) {
		onCoinOrSubscriptionClick('coin', event)

		showPreCheckout($(this).attr('data-amount'), $(this).attr('data-total'))
	})

	$('#postCheckoutFailedDialog').on('hidden.bs.modal', function (e) {
  		$('#postCheckoutFailedDialog .failed-container').addClass('d-none')
	})
	$('#postCheckoutFailedDialog').on('shown.bs.modal', function (e) {
		$('#postCheckoutFailedDialog .failed-container').removeClass('d-none')
	})

	$('#postCheckoutSuccessDialog').on('hidden.bs.modal', function (e) {
		$('#postCheckoutSuccessDialog .success-container').addClass('d-none')
	})

	$('#postCheckoutSuccessDialog').on('shown.bs.modal', function (e) {
		$('#postCheckoutSuccessDialog .success-container').removeClass('d-none')
	})
})
