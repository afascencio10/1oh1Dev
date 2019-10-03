class NotificationsController < ApplicationController
  before_action :authenticate_user!

  def index
    @notifications = Notification.where(:recipient => current_user).unread
    @earlier_notifications = Notification.where(:recipient => current_user).read.earlier_notification
  end

  def mark_as_read
    @notification = Notification.find(params[:id])
    @notification.update(read_at: Time.zone.now)
    render json: {success: true}
  end

end
