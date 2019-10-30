class SessionsController < ApplicationController
  def index
    @random_number = rand(0...10_000)
    # @booking = Booking.all[2].guide_id
    # @messages = Message.all
  end

  def create
    head :no_content
    # ActionCable.server.broadcast 'session_channel_'+id.to_s, session_params
    ActionCable.server.broadcast( "session_channel_#{session_params[:session_id]}",session_params)
  end

  private

  def session_params
    params.permit(:type, :from, :session_id, :to, :sdp, :candidate)
  end
end
