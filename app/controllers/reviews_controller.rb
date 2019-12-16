class ReviewsController < ApplicationController
  def index

    if !params["explore_id"].nil? || !params["guide_id"].nil?
        @info = params["explore_id"] ? Explore.find(params["explore_id"].to_i) : Guide.find(params["guide_id"].to_i)
        @explore_ratings = ExploreRating.joins(:explore).where(:explores=>{:category_id=> @info.category_id})
        @guide_ratings = GuideRating.joins(:guide).where(:guides=>{:category_id=> @info.category_id})
    end

  end
  private

  def current_profile
    current_user.profile
  end
end
