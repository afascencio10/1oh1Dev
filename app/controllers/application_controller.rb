class ApplicationController < ActionController::Base
  protect_from_forgery  unless: -> { request.format.json? }

  # skip_before_action :verify_authenticity_token, raise: false
  # before_action :authenticate_user!
  include UsersHelpers
  private



end
