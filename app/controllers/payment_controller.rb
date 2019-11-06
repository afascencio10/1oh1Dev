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

  def receive
    if request.headers['Content-Type'] == 'application/json'
      data = JSON.parse(request.body.read)
    else
      # application/x-www-form-urlencoded
      data = params.as_json
    end
    puts data
    # Webhook::Received.save(data: data, integration: params[:integration_name])

    render json: data
  end

  private

  def charges_params
    params.permit(:stripeEmail, :stripeToken, :order_id)
  end

  def catch_exception(exception)
    flash[:error] = exception.message
  end

end
