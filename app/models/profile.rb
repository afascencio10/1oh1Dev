class Profile < ApplicationRecord
  rolify
  extend FriendlyId
  friendly_id :full_user_name, use: :slugged

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
  has_many :transactions
  serialize :languages, Array

  self.per_page = 4

  def full_user_name
    "#{user.firstname.downcase}-#{user.lastname.downcase}"
  end

  scope :with_country_name, ->(country_name) {
   where(:country => [*country_name])
  }

  scope :sorted_by, lambda { |sort_option|
    direction = (sort_option =~ /desc$/) ? 'desc' : 'asc'

    case sort_option.to_s
      when /^created_at_/
        order("profiles.created_at #{ direction }")
      # when /^user_type_name_/
      #   order("LOWER(user_types.name) #{ direction }")
      else
        raise(ArgumentError, "Invalid sort option: #{ sort_option.inspect }")
    end
  }

  filterrific(
   default_filter_params: { sorted_by: 'created_at_desc' },
   available_filters: [
     :sorted_by,
     :with_country_name
   ]
 )

  def self.options_for_select
   # profile = Profile.arel_table
   # order(profile[:country].lower).pluck(:country, :country)
   Profile.distinct.pluck(:country)
  end

end
