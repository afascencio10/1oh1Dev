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
      @projects = @profile.projects.includes(:categories).sort_by_created_desc
      @explore_ratings = @profile.explore_ratings.sort_by_created_desc
      @guide_ratings = @profile.guide_ratings.sort_by_created_desc
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
    @profile = Profile.includes(:user).friendly.find(params[:id])
    @explore_categories = @profile.explore_categories.uniq
    @guide_categories = @profile.guide_categories.uniq
    @projects = @profile.projects
    @explore_ratings = @profile.explore_ratings.order("created_at DESC")
    @guide_ratings = @profile.guide_ratings.order("created_at DESC")
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
    # Update
    if current_user.profile #if Profile already exits
      @profile = current_user.profile
      @projects = @profile.projects
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
    @list = @profile.guide_categories.uniq.pluck(:id).uniq
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
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_profile
      if params[:id].to_i == current_user.id
        @profile = Profile.find(params[:id])
      end
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
      params.permit(:state,:country,:profile_photo,:banner_photo,:bio,:contact_no,:profile_photo,:banner_photo,:birth_date,:city,:state,:languages)
    end

end
