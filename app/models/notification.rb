class Notification < ApplicationRecord
  belongs_to :user
  belongs_to :recipient, class_name: "User"
  belongs_to :notifiable, polymorphic: true
  after_create_commit -> { NotificationRelayJob.perform_later(self) }

  scope :unread, -> {where(read_at: nil)}
  scope :read, -> {where.not(read_at: nil)}
  scope :earlier_notification, -> {order(created_at: :desc).limit(5)}
end
