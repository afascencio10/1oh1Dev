class Category < ApplicationRecord
  extend FriendlyId
  friendly_id :name

  has_many :explores,:dependent => :delete_all
  has_many :guides,:dependent => :delete_all
  has_many :explore_profiles, :through => :explores,:source => :profile,:dependent => :destroy
  has_many :guide_profiles, :through => :guides,:source => :profile,:dependent => :destroy

end
