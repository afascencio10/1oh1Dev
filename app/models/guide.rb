class Guide < ApplicationRecord
  belongs_to :profile
  belongs_to :category
  has_many :explore_ratings,dependent: :destroy
  has_many :guide_ratings,dependent: :destroy
  has_many :bookings,dependent: :nullify

    self.per_page = 1

    scope :with_country_name, ->(country_name) {
     where(:profiles => {:country => [*country_name]})
    }

    scope :sorted_by, lambda { |sort_option|
      direction = (sort_option =~ /desc$/) ? 'desc' : 'asc'

      case sort_option.to_s
        when /^created_at_/
          order("guides.created_at #{ direction }")
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

end
