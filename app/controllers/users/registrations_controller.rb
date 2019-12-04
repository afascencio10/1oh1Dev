class Users::RegistrationsController < Devise::RegistrationsController
  # before_filter :configure_permitted_parameters, only: [:create, :new]
  # before_filter :configure_account_update_params, only: [:update]
  skip_before_action :require_no_authentication
  before_action :resource_name
  before_action :configure_permitted_parameters, if: :devise_controller?


  def new
    super
  end

  def create
    @user = User.new(sign_up_params)
    @user.add_role :guest
    if User.exists?(email: params[:email]) # I think this should be `user_params[:email]` instead of `params[:email]`
      flash[:error] = "User already exists."
      redirect_to '/'
    end
    if @user.save
      UserMailer.welcome_email(@user).deliver_now
      session[:user_id] = @user.id
      flash[:success] = "Successfully signed up!!"

      sign_in(resource_name, resource)
      redirect_to '/profile/about-yourself'
    else
      render 'landing/index'
    end
  end


  protected

  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation,:firstname, :lastname)
  end


  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up) do |user_params|
      user_params.permit(:email, :password, :password_confirmation, :firstname, :lastname)
    end
    devise_parameter_sanitizer.permit(:account_update) do |user_params|
      user_params.permit(:email, :password, :password_confirmation, :preferred, :current_password)
    end
  end
# You can put the params you want to permit in the empty array.
# def configure_account_update_params
#   devise_parameter_sanitizer.for(:account_update) << :attribute
# end
  def invalid_sign_up_attempt
    set_flash_message(:alert, :sign_up_invalid)
    render json: flash[:alert], status: 401
  end

  def valid_sign_up_attempt
    set_flash_message(:alert, :sign_up_success)
    render json: flash[:alert], status: 200
  end

  def invalid_sign_up_attempt_no_name
    set_flash_message(:alert, :sign_up_invalid_no_name)
    render json: flash[:alert], status: 401
  end


# The path used after sign up.
# def after_sign_up_path_for(resource)
#   super(resource)
# end

# The path used after sign up for inactive accounts.
# def after_inactive_sign_up_path_for(resource)
#   super(resource)
# end
#   def build_resource(*args)
#     super
#     if session["devise.facebook_data"]
#       puts session["devise.facebook_data"]
#       resource.provider = session["devise.facebook_data"].provider
#       resource.uid = session["devise.facebook_data"].uid
#       resource.first_name = session["devise.facebook_data"].info.first_name
#       resource.last_name = session["devise.facebook_data"].info.last_name
#       # @user.username = User.autousername(@user)
#       # @user.password_confirmation = @user.password = Devise.friendly_token[0,20]
#       resource.valid?
#     end
#     if session["devise.weibo_data"]
#       resource.provider = session["devise.weibo_data"].provider
#       resource.uid = session["devise.weibo_data"].uid
#       resource.valid?
#     end
#     if session["devise.qq_data"]
#       resource.provider = session["devise.qq_data"].provider
#       resource.uid = session["devise.qq_data"].uid
#       resource.valid?
#     end
#   end
end
