class GuideRating < ApplicationRecord
  belongs_to :profile
  belongs_to :explore
  belongs_to :guide
  scope :rate_desc,-> {order("rating DESC")}
end
