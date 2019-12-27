class ExploreRating < ApplicationRecord
  belongs_to :profile
  belongs_to :guide
  belongs_to :explore
  belongs_to :category

  scope :rate_desc,-> {order("rating DESC")}
  scope :sort_by_created_desc, -> {order(created_at: :desc)}
  scope :average_rating, -> (profile,category_id) {where(:profile=>profile,:category_id=>category_id).average(:rating).to_f}
end
