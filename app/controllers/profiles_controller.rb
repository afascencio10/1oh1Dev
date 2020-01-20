class ProfilesController < ApplicationController
  before_action :authenticate_user!,:except => [:show]
  before_action :set_profile, only: [:show, :edit, :update, :destroy]
  include ExploresHelper
  # GET /profiles
  # GET /profiles.json
  def index
    @profiles = Profile.all
    @user = current_user
    if current_user.profile
      @profile = current_user.profile
      @explores = @profile.explore_categories.uniq
      @guides = @profile.guide_categories.uniq
      @projects = @profile.projects.includes(:categories).sort_by_created_desc
      @explore_ratings = @profile.explore_ratings.includes(:category).sort_by_created_desc.group_by(&:category)
      @guide_ratings = @profile.guide_ratings.includes(:category).sort_by_created_desc.group_by(&:category)
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
    @listg = current_user.profile.guide_categories.pluck(:id).uniq

    @category = Category.all
  end

  # GET /profiles/1
  # GET /profiles/1.json
  def show
    @profile = Profile.includes(:user).friendly.find(params[:id])
    @user = @profile.user
    @explores = @profile.explore_categories.uniq
    @guides = @profile.guide_categories.uniq
    @explore_categories = @profile.explore_categories.uniq
    @guide_categories = @profile.guide_categories.uniq
    @projects = @profile.projects
    @explore_ratings = @profile.explore_ratings.includes(:category).sort_by_created_desc.group_by(&:category)
    @guide_ratings = @profile.guide_ratings.includes(:category).sort_by_created_desc.group_by(&:category)
  end

  # GET /profiles/new
  def new
  end

  # GET /profiles/1/edit
  def edit
  end

  # POST /profiles
  # POST /profiles.json
  def create
    @params = profile_params
    if @params["country"]
      @params["country"] = CS.get[profile_params[:country].to_sym]
    end
    if @params["state"].size==2
      @states = CS.get profile_params[:country].to_sym
      @params["state"] = @states[profile_params[:state].to_sym]
    end

    if current_user.profile #if Profile already exists
      @profile = current_user.profile
      @projects = @profile.projects
      if !params["edit-profile-languages"].empty?
        @lan_array = JSON.parse(params["edit-profile-languages"])
        @params["languages"] = @lan_array
      end
      if !@profile.profile_photo.nil? & params["profile_photo"].empty?
        @params["profile_photo"] = @profile.profile_photo
      else
        @params["profile_photo"] = params["profile_photo"].empty? ? nil : params["profile_photo"]
      end
      if !@profile.banner_photo.nil? & params["banner_photo"].empty?
        @params["banner_photo"] = @profile.banner_photo
      else
        @params["banner_photo"] = params["banner_photo"].empty? ? nil : params["banner_photo"]
      end

      respond_to do |format|
        if @profile.update(@params)
          format.html { redirect_to profiles_path, notice: 'Profile was successfully updated.' }
          format.json { render :show, status: :ok, location: @profile }
        else
          format.html { render :edit }
          format.json { render json: @profile.errors, status: :unprocessable_entity }
        end
      end
    else
      if(params[:first_signup] == "true")
        @user = current_user
        @profile = Profile.new()  #create new Profile
        @user.profile = @profile
        @lan_array = JSON.parse(params["languages"])
        @params["languages"] = @lan_array
        coordinates = Geocoder.search(profile_params[:city]).first.coordinates
        latitude = coordinates[0]
        longitude = coordinates[1]
        @params["time_zone"] = Timezone.lookup(latitude,longitude).name

        respond_to do |format|
          if @profile.update(@params)
            format.html { redirect_to '/profile/explores', notice: 'Profile was successfully updated.' }
            format.json { render :show, status: :ok, location: @profile }
          else
            format.html { render :edit }
            format.json { render json: @profile.errors, status: :unprocessable_entity }
          end
        end
    end
  end
end

def update
  @params = profile_params
  if @params["country"]
    @params["country"] = CS.get[profile_params[:country].to_sym]
  end
  if @params["state"].size==2
    @states = CS.get profile_params[:country].to_sym
    @params["state"] = @states[profile_params[:state].to_sym]
  end

  @profile = current_user.profile
  @projects = @profile.projects
  if !params["edit-profile-languages"].empty?
    @lan_array = JSON.parse(params["edit-profile-languages"])
    @params["languages"] = @lan_array
  end
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

  def introduction
    if current_user.profile.nil?
      @profile = Profile.new(profile_params)
    else
      @profile = current_user.profile
    end

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
    @explore = Explore.new(profile_params)
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
    @listg = @profile.guide_categories.uniq.pluck(:id).uniq
    @guide = Guide.new(profile_params)
  end

  def projects
    @projects = current_user.profile.projects.includes(:categories).sort_by_created_desc
  end

  def availabilty
  end

  def availabilty_booking_create
    profile_id = current_user.profile.id
    @availabilty = JSON.parse(params[:availabilty])
    @availabilty.each do |day,time_array|
      time_array.each do |time|
        @process = process_time(day,time)
        @start_time = @process[:start]
        @end_time = @process[:end]
        @booking = Booking.new()
        @booking.title = "Unavailable"
        @booking.description = "Busy Schedule"
        @booking.status = "unavailable"
        @booking.start = @start_time.to_time.utc
        @booking.end = @end_time.to_time.utc

        @diff_seconds = (@end_time.to_time-@start_time.to_time).to_i
        @booking.duration = format_time(@diff_seconds)

        @booking.guide_id = 1
        @booking.explore_id = 1
        @booking.identifier = SecureRandom.base64(10)

        if @booking.save
          @booking.video_sessions.create(profile_id: profile_id )
        end
      end
    end
    flash[:success] = "Unavailabilty Schedule Updated"
    if params[:first].to_i == 1
      redirect_to profile_completed_path
    else
      redirect_to calendars_path
    end

  end


  def completed
   @wallet = Wallet.new
   @wallet.profile = current_user.profile
   @wallet.coins = 120
   @wallet.save
   flash.now[:success] = "Reward for completing profile added!!!"
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_profile
      @profile = Profile.find(params[:id])
    end

    def format_time (timeElapsed)
      @timeElapsed = timeElapsed
      seconds = @timeElapsed % 60
      minutes = (@timeElapsed / 60) % 60
      hours = (@timeElapsed/3600)
      return hours.to_s + ":" + format("%02d",minutes.to_s) + ":" + format("%02d",seconds.to_s)
    end

    def date_of_next(day)
      date  = Date.parse(day)
      delta = date > Date.today ? 0 : 7
      date + delta
    end

    def process_time(day,time)
      @raw_start = time[0].to_time.to_s.split(' ')[1]
      @raw_end = time[1].to_time.to_s.split(' ')[1]
      @date_next = date_of_next(day).to_s
      {start: @date_next + "T" + @raw_start, end: @date_next + "T" + @raw_end}
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def profile_params
      params.permit(:state,:country,:profile_photo,:banner_photo,:time_zone,:bio,:contact_no,:birth_date,:city,:state,:languages)
    end

end
