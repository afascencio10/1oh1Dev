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
    @transaction.profile = Profile.find_by(:user_id => 2)
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
    @transaction.save

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
