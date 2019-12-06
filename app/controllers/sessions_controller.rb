class SessionsController < ApplicationController
  def index
    if params["explore_id"]
      @companion = Explore.find(params["explore_id"])
      if @companion.profile.user_id.to_i == current_user.id
        render :file => "#{Rails.root}/public/404.html", :status => 404, :layout => false
      end
    else
      @companion = Guide.find(params["guide_id"])
      if @companion.profile.user_id.to_i == current_user.id
        render :file => "#{Rails.root}/public/404.html", :status => 404, :layout => false
      end
    end

  end

  def new
    @booking = Booking.new
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
