class UserMailer < ApplicationMailer
  default from: 'paras@1oh1.org'
  def welcome_email(user)
    @user = user
    mail(to: 'as.ascencio10@gmail.com', subject: 'Welcome to 1oh1')
  end
end