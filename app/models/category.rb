class Category < ApplicationRecord
  extend FriendlyId
  friendly_id :name

  has_many :explores,:dependent => :delete_all
  has_many :guides,:dependent => :delete_all
  has_many :explore_ratings
  has_many :guide_ratings
  has_many :explore_profiles, :through => :explores,:source => :profile,:dependent => :destroy
  has_many :guide_profiles, :through => :guides,:source => :profile,:dependent => :destroy
  has_and_belongs_to_many :projects
  self.per_page = 9
  scope :distinct_country, -> (country) { where(:profiles => {:country => country}).distinct }

  scope :search_query, lambda { |query|
   return nil  if query.blank?

   terms = query.downcase.split(/\s+/)

   terms = terms.map { |e|
     ( '%'+e.gsub('*', '%') + '%').gsub(/%+/, '%')
   }
   num_or_conditions = 2
   where(
       terms.map {
         or_clauses = [
             "LOWER(categories.name) LIKE ?",
             "LOWER(categories.slug) LIKE ?"
         ].join(' OR ')
         "(#{ or_clauses })"
       }.join(' AND '),
       *terms.map { |e| [e] * num_or_conditions }.flatten
   )
 }
 scope :sorted_by, lambda { |sort_option|
   direction = (sort_option =~ /desc$/) ? 'desc' : 'asc'

   case sort_option.to_s
     when /^created_at_/
       order("categories.created_at #{ direction }")
     when /^user_type_name_/
       order("LOWER(user_types.name) #{ direction }")
     else
       raise(ArgumentError, "Invalid sort option: #{ sort_option.inspect }")
   end
 }

  filterrific(
  default_filter_params: { sorted_by: 'created_at_desc' },
  available_filters: [
    :sorted_by,
    :search_query,
  ]
)

end
