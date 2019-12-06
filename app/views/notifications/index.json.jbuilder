json.unread @notifications do |notification|
  json.id notification.id
  json.recipient notification.recipient
  json.url notification.url
  json.action notification.action
  json.actor notification.user
  json.notifiable notification.notifiable
end
json.read @earlier_notifications do |notification|
  json.id notification.id
  json.recipient notification.recipient
  json.url notification.url
  json.action notification.action
  json.actor notification.user
  json.notifiable notification.notifiable
end
