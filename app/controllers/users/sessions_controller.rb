class Users::SessionsController < Devise::SessionsController


  def create
    self.resource = warden.authenticate(auth_options)
    if self.resource
      set_flash_message(:notice, :signed_in) if is_navigational_format?
      flash[:success] = "Logged In"
      sign_in(resource_name, resource)
      if !session[:return_to].blank?
        redirect_to session[:return_to]
        session[:return_to] = nil
      else
        redirect_to '/'
      end
    else
      # Authentication fails, redirect the user to the root page
      flash[:error] = "Invalid Email or Password"
      redirect_to unauthenticated_root_path
    end
    UserMailer.welcome_email(@user).deliver_now
  end


end
