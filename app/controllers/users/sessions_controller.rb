class Users::SessionsController < Devise::SessionsController


  def create
    self.resource = warden.authenticate!(auth_options)
    puts(self.resource)
    set_flash_message(:notice, :signed_in) if is_navigational_format?
    flash[:success] = "Logged In"
    sign_in(resource_name, resource)
    if !session[:return_to].blank?
      redirect_to session[:return_to]
      session[:return_to] = nil
    else
      redirect_to '/'
    end
  end


end
