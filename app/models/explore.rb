class Explore < ApplicationRecord
  belongs_to :profile
  belongs_to :category
  has_many :guide_ratings,dependent: :destroy
  has_many :explore_ratings,dependent: :destroy
  has_many :bookings,dependent: :nullify
end
