class ProfilesController < ApplicationController
  before_action :authenticate_user!,:only => [:show]
  before_action :set_profile, only: [:show, :edit, :update, :destroy]

  # GET /profiles
  # GET /profiles.json
  def index
    @profiles = Profile.all
    @user = current_user
    if Profile.find_by(:user_id=>current_user.id)
      @profile = Profile.find_by(:user_id=>current_user.id)
      @explores = @profile.explore_categories.uniq
      @guides = @profile.guide_categories.uniq
      @projects = @profile.projects
      @explore_ratings = @profile.explore_ratings.order("created_at DESC").first(3)
      @guide_ratings = @profile.guide_ratings.order("created_at DESC").first(3)

      @new_profile = false
    else
      @new_profile = true
      @profile = Profile.new
      @explores = []
      @guides = []
    end
    @category = Category.all
  end

  # GET /profiles/1
  # GET /profiles/1.json
  def show

  end

  # GET /profiles/new
  def new
    @profile = Profile.new
  end

  # GET /profiles/1/edit
  def edit
  end

  # POST /profiles
  # POST /profiles.json
  def create
    # Update
    if Profile.find_by(:user_id=>current_user.id) #if Profile already exits
      @profile = Profile.find_by(:user_id=>current_user.id)
      respond_to do |format|
        if @profile.update(profile_params)
          format.html { redirect_to profiles_path, notice: 'Profile was successfully updated.' }
          format.json { render :show, status: :ok, location: @profile }
        else
          format.html { render :edit }
          format.json { render json: @profile.errors, status: :unprocessable_entity }
        end
      end
    else
      # Create
      @user = current_user
      @profile = Profile.new(profile_params)  #create new Profile
      @user.profile = @profile
      respond_to do |format|
        if @profile.save
          flash[:success] = "Profile was successfully created!"
          format.html { redirect_to profiles_path}
          format.json { render :show, status: :created, location: @profile }
        else
          format.html { render :new }
          format.json { render json: @profile.errors, status: :unprocessable_entity }
        end
      end
    end


  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_profile
      if params[:id].to_i == current_user.id
        @profile = Profile.find(params[:id])
      end
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def profile_params
      params.permit(:state,:country,:profile_photo,:banner_photo,:bio,:contact_no,:profile_photo,:banner_photo,languages:[])
    end
end
