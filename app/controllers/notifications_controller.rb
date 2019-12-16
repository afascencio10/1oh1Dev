class NotificationsController < ApplicationController
  before_action :authenticate_user!

  def index
    @notification = Notification.includes(:recipient,:user,:notifiable)
    @notifications = @notification.where(:recipient => current_user).unread
    @earlier_notifications = @notification.where(:recipient => current_user).read.earlier_notification
  end

  def mark_as_read
    @notification = Notification.find(params[:id])
    @notification.update(read_at: Time.zone.now)
    render json: {success: true}
  end

end
