class Profile < ApplicationRecord
  rolify
  belongs_to :user
  has_many :guides,dependent: :destroy
  has_many :guide_categories,:through => :guides, :source => :category
  has_many :explores,dependent: :destroy
  has_many :explore_categories,:through => :explores, :source => :category
  has_many :projects,dependent: :destroy
  has_many :guide_ratings,dependent: :destroy
  has_many :explore_ratings,dependent: :destroy
  has_many :video_sessions
  has_many :bookings, through: :video_sessions
  serialize :languages, Array
end
