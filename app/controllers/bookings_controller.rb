require 'securerandom'
class BookingsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_booking, only: [:show, :edit, :update, :destroy]

  # GET /bookings
  # GET /bookings.json
  def index
    if params["self"].to_i == 1 && params["other"].to_i == 1

      if params["explore_id"] !=nil
        @reservation_bookings = (Explore.find(params["explore_id"].to_i).profile.bookings + Profile.find(current_profile_id).bookings).uniq
        all_other_user_ids = Explore.find(params["explore_id"].to_i).profile.bookings.map(&:id)
        all_current_user_ids = current_user.profile.bookings.pluck(:id).uniq
        @meta = {other: all_other_user_ids, self: all_current_user_ids, common: all_other_user_ids & all_current_user_ids }
      elsif params["guide_id"] !=nil
        @reservation_bookings = (Guide.find(params["guide_id"].to_i).profile.bookings + Profile.find(current_profile_id).bookings).uniq
        all_other_user_ids = Guide.find(params["guide_id"].to_i).profile.bookings.map(&:id)
        all_current_user_ids = current_user.profile.bookings.pluck(:id).uniq
        @meta = {other: all_other_user_ids, self: all_current_user_ids, common: all_other_user_ids & all_current_user_ids }
      end

    elsif params["self"].to_i == 1 && params["other"].to_i == 0
      @reservation_bookings = current_user.profile.bookings.includes(:explore,:guide).uniq


    elsif params["self"].to_i == 0 && params["other"].to_i == 1

      if params["explore_id"] != nil
        @reservation_bookings = Explore.find(params["explore_id"].to_i).profile.bookings.uniq
      elsif params["guide_id"] !=nil
        @reservation_bookings = Guide.find(params["guide_id"].to_i).profile.bookings.uniq
      end

    else
      @reservation_bookings=[]
    end

    @profile_id = current_profile.id
    @bookings = current_profile.bookings.includes(explore: [ profile: :user], guide: [ :category,profile: :user])
    # @pending_bookings =  @bookings.my_pending(current_profile_id).order(created_at: :desc).uniq
    @pending_bookings =  @bookings.where(:status => 0).order(created_at: :desc).uniq
    @completed_bookings = @bookings.where(:status => 2).order(created_at: :desc).uniq
    @upcoming_bookings = @bookings.where(:status => 1).order(created_at: :desc).uniq


    @bookings = Profile.find_by_id(current_user.profile.id).bookings.uniq
  end

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
    @booking.start = Time.parse(params[:booking][:start]).getutc
    @booking.end = Time.parse(params[:booking][:end]).getutc
    @diff_seconds = (params[:booking][:end].to_time-params[:booking][:start].to_time).to_i
    @booking.duration = format_time(@diff_seconds)
    if params["status"] == "3" #unaviable events for personal calendar
      @booking.guide_id = 1
      @booking.explore_id = 1
      @booking.client_id = current_profile_id
      @booking.recipient_id = current_profile.id
      @booking.identifier = SecureRandom.base64(10)
      @booking.status = params["status"].to_i
      if @booking.save
        @booking.video_sessions.create(profile_id: current_user.profile.id)
        redirect_to calendars_path
      end
    else
      @companion_type = params["type"].split("=")[0]
      @companion_id = params["type"].split("=")[1].to_i
      @booking.status = "pending"
      @companion = Guide.find(@companion_id)
      @booking.explore_id = Explore.find_by(:profile_id => current_profile_id,:category_id => Guide.find(@companion_id).category_id).id
      @booking.guide_id = @companion_id
      @booking.coins = 100
      @booking.description = params[:booking][:description]
      @other_profile = Guide.find(@companion_id).profile
      @booking.identifier = SecureRandom.base64(10)
      @booking.client_id = current_profile_id
      @booking.recipient_id = @companion.profile_id
      if @booking.save
        @booking.video_sessions.create(profile_id: current_user.profile.id)
        @booking.video_sessions.create(profile_id: @other_profile.id)
        flash[:notice] = "Booking Created"

        # #Find respective wallet for explore and guide respectively
        # @self_wallet = Wallet.find_by(profile_id: current_profile_id)
        # @companion_wallet = Wallet.find_by(profile_id: @companion.profile.id)
        #
        # #Update wallet_history and wallet coins for explore(Self)
        # @self_history = WalletHistory.create(wallet_id: @self_wallet.id, cost: -@booking.coins, prev_bal: @self_wallet.coins, new_bal: @self_wallet.coins - @booking.coins,action: @booking,source: "Explore")
        # @self_wallet.update(coins: @self_history.new_bal)
        #
        # #Update wallet_history and wallet coins for guide(Companion)
        # @companion_history = WalletHistory.create(wallet_id: @companion_wallet.id, cost: @booking.coins, prev_bal: @companion_wallet.coins, new_bal: @companion_wallet.coins + @booking.coins,action: @booking,source: "Guide")
        # @companion_wallet.update(coins: @companion_history.new_bal)

        # Notification.create(recipient: @companion.profile.user, user: current_user, action: "booking", notifiable: current_user, url: "/bookings" )

        # mailer_time = timezone.utc_to_local(@booking.start) - 5.minute
        #
        # StartSessionJob.set(wait_until: mailer_time).perform_later @booking, profile_booking_path(current_user.profile.id, @booking,  :peer_id => @other_profile.id)

        # render js: "window.location='#{calendars_path}'"
        render js: "window.location = '#{profile_booking_path(current_user.profile.id, @booking,  :peer_id => @other_profile.id)}'"
        puts profile_booking_path(@other_profile.id, @booking,  :peer_id => current_user.profile.id)

      end

    end

    # if @companion_type == "explore_id"
    #   @companion = Explore.find(@companion_id)
    #   @booking.guide_id = Guide.find_by(:profile_id => current_profile_id,:category_id => Explore.find(@companion_id).category_id).id
    #   @booking.explore_id = @companion_id
    #   @booking.description = params[:booking][:description]
    #   @other_profile = Explore.find(@companion_id).profile
    #   @booking.identifier = SecureRandom.base64(10)
    #   @booking.client_id = current_profile_id
    #   @booking.recipient_id = @companion.profile_id
    # else

    # end
  end


  def show
    @end = @booking.end
  end

  # PATCH/PUT /bookings/1
  # PATCH/PUT /bookings/1.json
  def update
    @profile_id = current_profile.id
    if !params[:booking_id].nil? && params[:change_request].nil? #for Approving request from Pending State
      @booking = Booking.find(params[:booking_id])
      @booking.update(:status => 1)
      flash.now[:success] = "Booking Approved!!"
      @new_bookings = current_profile.bookings.includes(explore: [ profile: :user], guide: [ :profile,:category])
      @upcoming_bookings = @new_bookings.where(:status => 1).order(created_at: :desc).uniq
      # @pending_bookings =  @new_bookings.my_pending(current_profile_id).order(created_at: :desc).uniq
      @pending_bookings =  @new_bookings.where(:status => 0).order(created_at: :desc).uniq

      @flashing = flash
      respond_to do |format|
        format.js
      end
    elsif !params[:booking_id].nil? && params[:change_request] == "true"  #for Changing request from Upcoming state to Pending
      @booking = Booking.find(params[:booking_id])
      @other_profile_id = @booking.profile_ids.select{|x| x!= current_profile_id}[0]
      @booking.update_columns(:status => "pending",:client_id=>current_profile_id,:recipient_id=>@other_profile_id)
      flash.now[:notice] = "Booking Change Requested!!"
      @new_bookings = current_profile.bookings.includes(explore: [ profile: :user], guide: [ :profile,:category])
      @upcoming_bookings = @new_bookings.where(:status => 1).order(created_at: :desc).uniq
      # @pending_bookings =  @new_bookings.my_pending(current_profile_id).order(created_at: :desc).uniq
      @pending_bookings =  @new_bookings.where(:status => 0).order(created_at: :desc).uniq

      @flashing = flash
      respond_to do |format|
        format.js
      end
    else
      @booking = Booking.find(params[:id])
      @booking.update_columns(title: booking_params['title'],start:booking_params['start'],end: booking_params['end'], description: booking_params['description'])
      flash[:notice] = "Booking Updated"
      render js: "window.location='#{calendars_path}'"
    end

  end

  # DELETE /bookings/1
  # DELETE /bookings/1.json
  def destroy
    if !params[:booking_id].nil?
      @booking = Booking.find(params[:booking_id])
      if @booking.destroy
        if @booking.guide.profile_id == current_profile_id
          @type = "Guiding"
          @companion = @booking.explore
        else
          @type = "Exploring"
          @companion = @booking.guide
        end
        #Find respective wallet for explore and guide respectively
        @self_wallet = Wallet.find_by(profile_id: current_profile_id)
        @companion_wallet = Wallet.find_by(profile_id: @companion.profile.id)

        if @type == "Exploring"
          #Update wallet_history and wallet coins for explore(Self)
          @self_history = WalletHistory.create(wallet_id: @self_wallet.id, cost: @booking.coins, prev_bal: @self_wallet.coins, new_bal: @self_wallet.coins + @booking.coins,action: @booking,source: "Cancelled by Explorer")
          @self_wallet.update(coins: @self_history.new_bal)

          #Update wallet_history and wallet coins for guide(Companion)
          @companion_history = WalletHistory.create(wallet_id: @companion_wallet.id, cost: -@booking.coins, prev_bal: @companion_wallet.coins, new_bal: @companion_wallet.coins-@booking.coins,action: @booking,source: "Cancelled by Explorer")
          @companion_wallet.update(coins: @companion_history.new_bal)
        else
          #Update wallet_history and wallet coins for guide(Self)
          @self_history = WalletHistory.create(wallet_id: @self_wallet.id, cost: -@booking.coins, prev_bal: @self_wallet.coins, new_bal: @self_wallet.coins - @booking.coins,action: @booking,source: "Cancelled by Guide")
          @self_wallet.update(coins: @self_history.new_bal)

          #Update wallet_history and wallet coins for explore(Companion)
          @companion_history = WalletHistory.create(wallet_id: @companion_wallet.id, cost: @booking.coins, prev_bal: @companion_wallet.coins, new_bal: @companion_wallet.coins + @booking.coins,action: @booking,source: "Cancelled by Guide")
          @companion_wallet.update(coins: @companion_history.new_bal)
        end

      end
      @profile_id = current_profile.id
      flash.now[:success] = "Booking Deleted!!"
      @flashing = flash
      @bookings = current_profile.bookings.includes(explore: [ profile: :user], guide: [ :profile,:category])
      @pending_bookings =  @bookings.my_pending(current_profile_id).order(created_at: :desc).uniq
      @upcoming_bookings = @bookings.where(:status => 1).order(created_at: :desc).uniq

      if !params[:cancel_message].blank?
        @message_mail = params[:cancel_message]
      end
      respond_to do |format|
        format.js
      end
    end
  end

  def in_session
  end

  def post_session
  end

  def pre_session
  end

  def send_tip
    if params[:booking_id]
      # @tip_coins = params[:tip_coins]
      @booking = Booking.find(params[:booking_id])

      if @booking.guide.profile_id == current_profile_id
        @type = "Guiding"
        @companion = @booking.explore
      else
        @type = "Exploring"
        @companion = @booking.guide
      end

      # @self_wallet = Wallet.find_by(profile_id: current_profile_id)
      # @companion_wallet = Wallet.find_by(profile_id: @companion.profile.id)
      # if @type == "Exploring"
      #   #Update wallet_history and wallet coins for Self
      #   @self_history = WalletHistory.create(wallet_id: @self_wallet.id, cost: -@tip_coins, prev_bal: @self_wallet.coins, new_bal: @self_wallet.coins - @booking.coins,action: nil,source: "Tip from Explorer")
      #   @self_wallet.update(coins: @self_history.new_bal)
      #
      #   #Update wallet_history and wallet Tip coins for Companion
      #   @companion_history = WalletHistory.create(wallet_id: @companion_wallet.id, cost: @tip_coins, prev_bal: @companion_wallet.coins, new_bal: @companion_wallet.coins + @tip_coins,action: nil,source: "Tip for Guide")
      #   @companion_wallet.update(coins: @companion_history.new_bal)
      # else
      #   #Update wallet_history and wallet coins for Self
      #   @self_history = WalletHistory.create(wallet_id: @self_wallet.id, cost: -@tip_coins, prev_bal: @self_wallet.coins, new_bal: @self_wallet.coins - @booking.coins,action: nil,source: "Tip from Guide")
      #   @self_wallet.update(coins: @self_history.new_bal)
      #
      #   #Update wallet_history and wallet Tip coins for Companion
      #   @companion_history = WalletHistory.create(wallet_id: @companion_wallet.id, cost: @tip_coins, prev_bal: @companion_wallet.coins, new_bal: @companion_wallet.coins + @tip_coins,action: nil,source: "Tip for Explorer")
      #   @companion_wallet.update(coins: @companion_history.new_bal)
      # end




    end

    flash.now[:success] = "Tip Send!!"
    @flashing = flash
    respond_to do |format|
      format.js
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_booking
      if params[:profile_id].to_i == current_user.profile.id
        current_user.profile.bookings.each do |booking|
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
      current_user.profile.id
    end

    def current_profile
      current_user.profile
    end



end
