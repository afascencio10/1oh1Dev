json.array! @reservation_bookings do |booking|
  date_format = booking.all_day_booking? ? '%Y-%m-%d' : '%Y-%m-%dT%H:%M:%S'
  json.id booking.id
  json.title booking.title
  json.start booking.start.strftime(date_format)
  json.end booking.end.strftime(date_format)
  if booking.status == 0
    json.className 'pending'
  elsif booking.status == 1
    json.className 'exploring'
  elsif booking.status == 2
    json.className 'guiding'
  else
    json.className 'unavailable'
  end
  # json.allDay booking.all_day_booking? ? true : false
  json.extendedProps do
    json.update_url booking_path(booking, method: :patch)
    json.unavailable_url edit_calendar_path(booking)
    json.edit_url edit_booking_path(booking)
    json.delete_url booking_path(booking)
    json.eventDescription booking.description
  end


end
