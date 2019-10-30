require 'securerandom'
class BookingsController < ApplicationController
  include BookingsHelper
  before_action :authenticate_user!
  before_action :set_booking, only: [:show, :edit, :update, :destroy]

  # GET /bookings
  # GET /bookings.json
  def index
    if params["self"].to_i == 1 && params["other"].to_i == 1
      if params["explore_id"] !=nil
        @reservation_bookings = Explore.find(params["explore_id"].to_i).profile.bookings.uniq + Profile.find(current_user.id).bookings.uniq
      elsif params["guide_id"] !=nil
        @reservation_bookings = Guide.find(params["guide_id"].to_i).profile.bookings.uniq + Profile.find(current_user.id).bookings.uniq
      end

    elsif params["self"].to_i == 1 && params["other"].to_i == 0
      @reservation_bookings = Profile.find(current_user.id).bookings.uniq

    elsif params["self"].to_i == 0 && params["other"].to_i == 1
      if params["explore_id"] != nil
        @reservation_bookings = Explore.find(params["explore_id"].to_i).profile.bookings.uniq
      elsif params["guide_id"] !=nil
        @reservation_bookings = Guide.find(params["guide_id"].to_i).profile.bookings.uniq
      end
    else
      @reservation_bookings = Profile.find(current_user.id).bookings.uniq
    end
    @profile_id = current_profile.id
    @pending_bookings =  current_profile.bookings.where(:status => "pending")
    @completed_bookings = current_profile.bookings.where(:status => "completed")
    @upcoming_bookings = current_profile.bookings.where(:status => "upcoming")


    @bookings = Profile.find(current_user.id).bookings.uniq
    # @guide_bookings = Booking.joins(:guide).where(:guides => {:profile_id => current_profile_id})
    # @explore_bookings = Booking.joins(:explore).where(:explores => {:profile_id => current_profile_id})
    # @all_bookings = @guide_bookings + @explore_bookings
    # @my_bookings = @all_bookings.uniq
    #JSON view for dipslaying Calendar
    # if params[:type] == "undefined"
    #   @bookings = @my_bookings
    # elsif params[:type] == "guide"
    #   @bookings = Booking.where(:guide_id=> params[:id])
    # elsif params[:type] == "explore"
    #   @bookings = Booking.where(:explore_id=> params[:id])
    # end
  end

  # GET /bookings/1
  # GET /bookings/1.json
  def show

  end

  # GET /bookings/new
  def new
    @booking = Booking.new
  end

  # GET /bookings/1/edit
  def edit
    @booking = Booking.find(params[:id])
  end

  # POST /bookings
  # POST /bookings.json
  def create
    @booking = Booking.new(booking_params)
    #next 3 lines of code for changing local time to UTC (Manage Timezones)
    # timezone = timezone(current_user)
    # @booking.start = timezone.local_to_utc(@booking.start)
    # @booking.end = timezone.local_to_utc(@booking.end)

    @diff_seconds = (params[:booking][:end].to_time-params[:booking][:start].to_time).to_i
    @booking.duration = format_time(@diff_seconds)
    @booking.status = "pending"
    if params[:booking][:cancel_date]=="explore"
      @booking.guide_id = Guide.find_by(:profile_id => current_profile_id,:category_id => Explore.find(params[:booking][:id]).category_id).id
      @booking.explore_id = params[:booking][:id]
      @booking.description = params[:booking][:description]
      @other_profile = Explore.find(params[:booking][:id]).profile
      @booking.identifier = SecureRandom.base64(10)
    else
      @booking.explore_id = Explore.find_by(:profile_id => current_profile_id,:category_id => Guide.find(1).category_id).id
      @booking.guide_id = 1
      @booking.description = params[:booking][:description]
      @other_profile = Guide.find(1).profile
      @booking.identifier = SecureRandom.base64(10)
    end

    if @booking.save
      @booking.video_sessions.create(profile_id: Profile.find_by(:user_id => current_user.id).id)
      @booking.video_sessions.create(profile_id: @other_profile.id)
      flash[:notice] = "Booking Created"
      render js: "window.location='#{calendars_path}'"
    end



    # redirect_to profile_booking_path(Profile.find_by(:user_id => current_user.id), @booking,  :peer_id => @other_profile.id)


  end


  def show
    @end = @booking.end
  end

  # PATCH/PUT /bookings/1
  # PATCH/PUT /bookings/1.json
  def update
    @booking = Booking.find(params[:id])
    @booking.update_columns(title: booking_params['title'],start:booking_params['start'],end: booking_params['end'], description: booking_params['description'])
    flash[:notice] = "Booking Updated"
    render js: "window.location='#{calendars_path}'"
  end

  # DELETE /bookings/1
  # DELETE /bookings/1.json
  def destroy
    @booking = Booking.find(params[:id])
    @booking.destroy
    flash[:notice] = "Booking Deleted"
    render js: "window.location='#{calendars_path}'"
  end

  def in_session
  end

  def post_session
  end

  def pre_session
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_booking
      if params[:profile_id].to_i == current_user.id
        Profile.find_by(:user_id => current_user.id).bookings.each do |booking|
          if booking[:slug] == params[:id]
            Profile.find(params[:peer_id]).bookings.each do |peer_booking|
              if booking.id == peer_booking.id && booking.slug == params[:id] && peer_booking.slug == params[:id]
                @other_profile = Profile.find(params[:peer_id])
                @booking = Booking.friendly.find(params[:id])
              end
            end
          end
        end
      end
    end

    # def find_booking(second_profile)
    #   bookings = Profile.find_by(:user_id => current_user.id).bookings
    #   bookings.each do |booking|
    #     booking.video_sessions.each do |s|
    #       if s.profile_id == second_profile.id
    #         return booking
    #       end
    #     end
    #   end
    #   nil
    # end

    def booking_params
      params.require(:booking).permit(:title,:date_range, :start, :end, :duration, :cancel_date, :status,:description)
    end
    def format_time (timeElapsed)
      @timeElapsed = timeElapsed
      seconds = @timeElapsed % 60
      minutes = (@timeElapsed / 60) % 60
      hours = (@timeElapsed/3600)
      return hours.to_s + ":" + format("%02d",minutes.to_s) + ":" + format("%02d",seconds.to_s)
    end

    def current_profile_id
      Profile.find_by(:user_id => current_user.id).id
    end

    def current_profile
      Profile.find_by(:user_id => current_user.id)
    end



end
