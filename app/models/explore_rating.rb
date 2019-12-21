class ExploreRating < ApplicationRecord
  belongs_to :profile
  belongs_to :guide
  belongs_to :explore
  
  scope :rate_desc,-> {order("rating DESC")}
  scope :sort_by_created_desc, -> {order(created_at: :desc)}
end
