class ExploreRating < ApplicationRecord
  belongs_to :profile
  belongs_to :guide
  belongs_to :explore
  scope :rate_desc,-> {order("rating DESC")}
end
