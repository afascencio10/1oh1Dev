require 'rest-client'

class PaymentController < ApplicationController
  rescue_from Stripe::CardError, with: :catch_exception

  def index
  end

  def new
  end

  def create
    StripeChargesServices.new(charges_params, current_user).call
    redirect_to payment_index_path
  end

  def after_payment
    @transaction = Transaction.new

    if request.headers['Content-Type'] == 'application/json'
      data = JSON.parse(request.body.read)
    else
      # application/x-www-form-urlencoded
      data = params.as_json
    end

    @transaction.customer_id = data["data"]["object"]["customer"]
    @transaction.currency = data["data"]["object"]["display_items"][0]["currency"]
    @transaction.price = data["data"]["object"]["display_items"][0]["amount"]
    @transaction.profile = Profile.find(2)
    @transaction.mode = data["data"]["object"]["mode"]

    if @transaction.mode == "payment"
      @transaction.name = data["data"]["object"]["display_items"][0]["sku"]["attributes"]["name"]
      @transaction.interval = nil
      @transaction.product_id = data["data"]["object"]["display_items"][0]["sku"]["product"]
    else
      @transaction.name = data["data"]["object"]["display_items"][0]["plan"]["nickname"]
      @transaction.interval = data["data"]["object"]["display_items"][0]["plan"]["interval"]
      @transaction.product_id = data["data"]["object"]["display_items"][0]["plan"]["product"]
    end

    body = RestClient::Request.execute( method: "get",url: 'https://api.stripe.com/v1/charges',
            user: 'sk_test_RtD0URFi6IkU7cdGsNms5TKj00lRyT23Gv',
            headers: {customer: @transaction.customer_id}
          )
    response = JSON.parse(body)

    @transaction.charge_id = response["data"][0]["id"]

    if @transaction.save
      @self_wallet = Wallet.find_by(profile_id: current_user.profile.id)
      #Update wallet_history and wallet coins for Self, source: Transaction
      @self_history = WalletHistory.create(wallet_id: @self_wallet.id, cost: @transaction.coins, prev_bal: @self_wallet.coins, new_bal: @self_wallet.coins + @transaction.coins,action: @transaction,source: "Purchase")
      @self_wallet.update(coins: @self_history.new_bal)
    end

    render json: @transaction
  end

  private

  def charges_params
    params.permit(:stripeEmail, :stripeToken, :order_id)
  end

  def catch_exception(exception)
    flash[:error] = exception.message
  end

end
