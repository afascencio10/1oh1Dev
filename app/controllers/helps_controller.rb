class HelpsController < ApplicationController
  before_action :authenticate_user!
  # before_action :set_help, only: [:show, :edit, :update, :destroy]

  # GET /helps
  # GET /helps.json
  def index
    @filterrific = initialize_filterrific(
      Category,
      params[:filterrific]
    ) or return
   @categories = @filterrific.find.page(params[:page])
    respond_to do |format|
      format.html
      format.js
    end

  end

  def states
    render json: CS.states(params[:country]).to_json
  end

  def cities
    render json: CS.cities(params[:state],params[:country]).to_json
  end
  # private
  #   # Use callbacks to share common setup or constraints between actions.
  #   def set_help
  #     @help = Help.find(params[:id])
  #   end
  #
  #   # Never trust parameters from the scary internet, only allow the white list through.
  #   def help_params
  #     params.fetch(:help, {})
  #   end
end
