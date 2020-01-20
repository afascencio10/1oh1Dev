class LandingController < ApplicationController
  # skip_before_action :authenticate_user!
  include ExploresHelper
  def index
    @user_country = request.location.data["country_code"].nil? ? "India" : CS.get[request.location.data["country_code"].to_sym]

    @categories = Guide.pluck(:category_id).uniq.first(7).map{|x| Category.find(x)}

    @popular_incountry = popular_merge(@user_country,true)

    @popular_inworld = popular_merge(all_countries,true)
    @top_guides = GuideRating.includes(profile: :user,explore: [:category]).rate_desc.pluck(:guide_id).uniq.map{|x| Guide.find(x)}
    @top_explores = ExploreRating.includes(profile: :user,explore: [:category]).rate_desc.pluck(:explore_id).uniq.map{|x| Explore.find(x)}
  end

  def search_result
    @filterrific = initialize_filterrific(
      Guide,
      params[:filterrific]
    ) or return
    @categories = @filterrific.find.page(params[:page])
  end

  private
  def all_countries
    Profile.pluck(:country).uniq
  end
end
