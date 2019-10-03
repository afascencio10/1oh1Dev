class Users::PasswordsController < Devise::PasswordsController

  protected
  def after_sending_reset_password_instructions_path_for(resource_name)
    unauthenticated_root_url
  end

end

