class StartSessionJob < ApplicationJob
  queue_as :default

  def perform()

    # NotificationRelayJob.perform_later(Notification.first)
    # NotificationRelayJob.perform_later(Notification.last)
    # UserMailer.welcome_email(User.find(4)).deliver_later
  end
end
