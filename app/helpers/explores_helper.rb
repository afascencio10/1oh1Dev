module ExploresHelper
  def average_rating(user,category)
    if !category.nil?
      explore_rating = ExploreRating.average_rating(user.profile,category.id)
      guide_rating = GuideRating.average_rating(user.profile,category.id)
    else
      explore_rating = ExploreRating.average_rating(user.profile,nil)
      guide_rating = GuideRating.average_rating(user.profile,nil)
    end
    explore_rate = explore_rating.average(:rating).to_f
    explore_count = explore_rating.count
    guide_rate = guide_rating.average(:rating).to_f
    guide_count = guide_rating.count

    return {
            rating: (explore_rate + guide_rate)/2,
            count: (explore_count+guide_count),
            explore_rating: explore_rate,
            explore_count: explore_count,
            guide_rating: guide_rate,
            guide_count: guide_count
          }
  end

  def popular_merge(country,landing)
    popular_explore_category = Category.joins(explores: :profile).distinct_country(country)
    popular_guide_category = Category.joins(guides: :profile).distinct_country(country)
    popular = popular_explore_category.merge(popular_guide_category)
    if landing == true
      result = popular.sort_by { rand }.first(4)
    else
      result = popular
    end
    return result
  end

  def all_countries
    Profile.pluck(:country).uniq
  end
end
