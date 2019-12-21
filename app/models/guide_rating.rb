class GuideRating < ApplicationRecord
  belongs_to :profile
  belongs_to :explore
  belongs_to :guide
  
  scope :rate_desc,-> {order("rating DESC")}
  scope :sort_by_created_desc, -> {order(created_at: :desc)}
end
