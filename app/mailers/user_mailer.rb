class UserMailer < ApplicationMailer
  default from: 'paras@1oh1.org'
  def welcome_email(user)
    @user = user
    mail(to: @user.email, subject: 'Welcome to 1oh1')
  end
end