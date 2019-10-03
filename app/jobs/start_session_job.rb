class StartSessionJob < ApplicationJob
  queue_as :default

  def perform(name)
    # Do something later
    # booking = Booking.all[2]

    puts User.first
  end
end
