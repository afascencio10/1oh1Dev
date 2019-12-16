class ProfilesController < ApplicationController
  before_action :authenticate_user!,:only => [:show]
  before_action :set_profile, only: [:show, :edit, :update, :destroy]

  # GET /profiles
  # GET /profiles.json
  def index
    @profiles = Profile.all
    @user = current_user
    if current_user.profile
      @profile = current_user.profile
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
    @filterrific = initialize_filterrific(
      Category,
      params[:filterrific]
    ) or return
    @categories = @filterrific.find.page(params[:page])
    respond_to do |format|
      format.html
      format.js
    end
    @list = current_user.profile.explore_categories.pluck(:id).uniq

    @category = Category.all
  end

  # GET /profiles/1
  # GET /profiles/1.json
  def show
    @profile = Profile.friendly.find(params[:id])
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
    if current_user.profile #if Profile already exits
      @profile = current_user.profile
      @params = profile_params
      puts @params
      if @params["country"]
        @params["country"] = CS.get[profile_params[:country].to_sym]
      end
      if @params["state"]
        @states = CS.get profile_params[:country].to_sym
        @params["state"] = @states[profile_params[:state].to_sym]
      end

      @lan_array = @params["languages"].split(',')
      @params["languages"] = @lan_array.map!{|x| LanguageList::LanguageInfo.find(x).name}

      if(params[:first_signup] == "true")
        respond_to do |format|
          if @profile.update(@params)
            format.html { redirect_to '/profile/explores', notice: 'Profile was successfully updated.' }
            format.json { render :show, status: :ok, location: @profile }
          else
            format.html { render :edit }
            format.json { render json: @profile.errors, status: :unprocessable_entity }
          end
        end
      else
        respond_to do |format|
          if @profile.update(@params)
            format.html { redirect_to profiles_path, notice: 'Profile was successfully updated.' }
            format.json { render :show, status: :ok, location: @profile }
          else
            format.html { render :edit }
            format.json { render json: @profile.errors, status: :unprocessable_entity }
          end
        end
      end



    else
      # Create
      @user = current_user
      @profile = Profile.new(profile_params)  #create new Profile
      @user.profile = @profile
      @profile.country = CS.get[profile_params[:country].to_sym]
      @profile.state = CS.get[profile_params[:state].to_sym]

      @params["languages"]= []
      @params["languages"] = params["languages"].map!{|x| LanguageList::LanguageInfo.find(x).name}

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

  def introduction
    @profile = Profile.new(profile_params)
  end

  def explores
    @filterrific = initialize_filterrific(
      Category,
      params[:filterrific]
    ) or return
    @categories = @filterrific.find.page(params[:page])
    respond_to do |format|
      format.html
      format.js
    end

    @profile = current_user.profile
    @list = @profile.explore_categories.pluck(:id).uniq
  end

  def guides
    @filterrific = initialize_filterrific(
      Category,
      params[:filterrific]
    ) or return
   @categories = @filterrific.find.page(params[:page])
    respond_to do |format|
      format.html
      format.js
    end

    @profile = current_user.profile
    @list = @profile.guide_categories.uniq.pluck(:id).uniq
  end

  def projects
  end

  def availabilty
  end

  def completed
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
      params.permit(:state,:country,:profile_photo,:banner_photo,:bio,:contact_no,:profile_photo,:banner_photo,:birth_date,:city,:state,:languages)
    end

end
