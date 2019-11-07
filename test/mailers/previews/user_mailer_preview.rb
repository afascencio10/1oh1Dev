class UserPreview < ActionMailer::Preview
  # Accessible from http://localhost:3000/rails/mailers/user/welcome_email
  def welcome_email
    UserMailer.welcome_email(User.first)
  end
end
