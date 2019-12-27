class ReviewsController < ApplicationController
  def index

    if !params["explore_id"].nil? || !params["guide_id"].nil?
        @info = params["explore_id"] ? Explore.find(params["explore_id"].to_i) : Guide.find(params["guide_id"].to_i)
        @explore_ratings = ExploreRating.where(category_id: @info.category_id,profile: current_profile)
        @guide_ratings = GuideRating.where(category_id: @info.category_id,profile: current_profile)
        @explore_rate = ExploreRating.average_rating(current_profile,@info.category_id)
        @guide_rate = GuideRating.average_rating(current_profile,@info.category_id)


    end

  end

  def create
    @booking = Booking.find(params[:booking_id])
    if @booking.guide.profile_id == current_profile.id
      @model = ExploreRating.new
      @model.profile = User.find(params["peer_id"]).profile
    else
      @model = GuideRating.new
      @model.profile = User.find(params["peer_id"]).profile
    end
    puts @booking.explore.category
    @model.guide = @booking.guide
    @model.explore = @booking.explore
    @model.rating = params[:rating]
    @model.review = params[:review]
    @model.category = @booking.explore.category

    @model.save!

    respond_to do |format|
      format.js
    end
  end

  private

  def current_profile
    current_user.profile
  end
end
